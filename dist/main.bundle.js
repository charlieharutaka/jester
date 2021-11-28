/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@electron/remote/dist/src/common/get-electron-binding.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@electron/remote/dist/src/common/get-electron-binding.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getElectronBinding = void 0;
const getElectronBinding = (name) => {
    if (process._linkedBinding) {
        return process._linkedBinding('electron_common_' + name);
    }
    else if (process.electronBinding) {
        return process.electronBinding(name);
    }
    else {
        return null;
    }
};
exports.getElectronBinding = getElectronBinding;


/***/ }),

/***/ "./node_modules/@electron/remote/dist/src/common/type-utils.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@electron/remote/dist/src/common/type-utils.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deserialize = exports.serialize = exports.isSerializableObject = exports.isPromise = void 0;
const electron_1 = __webpack_require__(/*! electron */ "electron");
function isPromise(val) {
    return (val &&
        val.then &&
        val.then instanceof Function &&
        val.constructor &&
        val.constructor.reject &&
        val.constructor.reject instanceof Function &&
        val.constructor.resolve &&
        val.constructor.resolve instanceof Function);
}
exports.isPromise = isPromise;
const serializableTypes = [
    Boolean,
    Number,
    String,
    Date,
    Error,
    RegExp,
    ArrayBuffer
];
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#Supported_types
function isSerializableObject(value) {
    return value === null || ArrayBuffer.isView(value) || serializableTypes.some(type => value instanceof type);
}
exports.isSerializableObject = isSerializableObject;
const objectMap = function (source, mapper) {
    const sourceEntries = Object.entries(source);
    const targetEntries = sourceEntries.map(([key, val]) => [key, mapper(val)]);
    return Object.fromEntries(targetEntries);
};
function serializeNativeImage(image) {
    const representations = [];
    const scaleFactors = image.getScaleFactors();
    // Use Buffer when there's only one representation for better perf.
    // This avoids compressing to/from PNG where it's not necessary to
    // ensure uniqueness of dataURLs (since there's only one).
    if (scaleFactors.length === 1) {
        const scaleFactor = scaleFactors[0];
        const size = image.getSize(scaleFactor);
        const buffer = image.toBitmap({ scaleFactor });
        representations.push({ scaleFactor, size, buffer });
    }
    else {
        // Construct from dataURLs to ensure that they are not lost in creation.
        for (const scaleFactor of scaleFactors) {
            const size = image.getSize(scaleFactor);
            const dataURL = image.toDataURL({ scaleFactor });
            representations.push({ scaleFactor, size, dataURL });
        }
    }
    return { __ELECTRON_SERIALIZED_NativeImage__: true, representations };
}
function deserializeNativeImage(value) {
    const image = electron_1.nativeImage.createEmpty();
    // Use Buffer when there's only one representation for better perf.
    // This avoids compressing to/from PNG where it's not necessary to
    // ensure uniqueness of dataURLs (since there's only one).
    if (value.representations.length === 1) {
        const { buffer, size, scaleFactor } = value.representations[0];
        const { width, height } = size;
        image.addRepresentation({ buffer, scaleFactor, width, height });
    }
    else {
        // Construct from dataURLs to ensure that they are not lost in creation.
        for (const rep of value.representations) {
            const { dataURL, size, scaleFactor } = rep;
            const { width, height } = size;
            image.addRepresentation({ dataURL, scaleFactor, width, height });
        }
    }
    return image;
}
function serialize(value) {
    if (value && value.constructor && value.constructor.name === 'NativeImage') {
        return serializeNativeImage(value);
    }
    if (Array.isArray(value)) {
        return value.map(serialize);
    }
    else if (isSerializableObject(value)) {
        return value;
    }
    else if (value instanceof Object) {
        return objectMap(value, serialize);
    }
    else {
        return value;
    }
}
exports.serialize = serialize;
function deserialize(value) {
    if (value && value.__ELECTRON_SERIALIZED_NativeImage__) {
        return deserializeNativeImage(value);
    }
    else if (Array.isArray(value)) {
        return value.map(deserialize);
    }
    else if (isSerializableObject(value)) {
        return value;
    }
    else if (value instanceof Object) {
        return objectMap(value, deserialize);
    }
    else {
        return value;
    }
}
exports.deserialize = deserialize;


/***/ }),

/***/ "./node_modules/@electron/remote/dist/src/main/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@electron/remote/dist/src/main/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.enable = exports.initialize = void 0;
var server_1 = __webpack_require__(/*! ./server */ "./node_modules/@electron/remote/dist/src/main/server.js");
Object.defineProperty(exports, "initialize", ({ enumerable: true, get: function () { return server_1.initialize; } }));
Object.defineProperty(exports, "enable", ({ enumerable: true, get: function () { return server_1.enable; } }));


/***/ }),

/***/ "./node_modules/@electron/remote/dist/src/main/objects-registry.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@electron/remote/dist/src/main/objects-registry.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const getOwnerKey = (webContents, contextId) => {
    return `${webContents.id}-${contextId}`;
};
class ObjectsRegistry {
    constructor() {
        this.nextId = 0;
        // Stores all objects by ref-counting.
        // (id) => {object, count}
        this.storage = {};
        // Stores the IDs + refCounts of objects referenced by WebContents.
        // (ownerKey) => { id: refCount }
        this.owners = {};
        this.electronIds = new WeakMap();
    }
    // Register a new object and return its assigned ID. If the object is already
    // registered then the already assigned ID would be returned.
    add(webContents, contextId, obj) {
        // Get or assign an ID to the object.
        const id = this.saveToStorage(obj);
        // Add object to the set of referenced objects.
        const ownerKey = getOwnerKey(webContents, contextId);
        let owner = this.owners[ownerKey];
        if (!owner) {
            owner = this.owners[ownerKey] = new Map();
            this.registerDeleteListener(webContents, contextId);
        }
        if (!owner.has(id)) {
            owner.set(id, 0);
            // Increase reference count if not referenced before.
            this.storage[id].count++;
        }
        owner.set(id, owner.get(id) + 1);
        return id;
    }
    // Get an object according to its ID.
    get(id) {
        const pointer = this.storage[id];
        if (pointer != null)
            return pointer.object;
    }
    // Dereference an object according to its ID.
    // Note that an object may be double-freed (cleared when page is reloaded, and
    // then garbage collected in old page).
    remove(webContents, contextId, id) {
        const ownerKey = getOwnerKey(webContents, contextId);
        const owner = this.owners[ownerKey];
        if (owner && owner.has(id)) {
            const newRefCount = owner.get(id) - 1;
            // Only completely remove if the number of references GCed in the
            // renderer is the same as the number of references we sent them
            if (newRefCount <= 0) {
                // Remove the reference in owner.
                owner.delete(id);
                // Dereference from the storage.
                this.dereference(id);
            }
            else {
                owner.set(id, newRefCount);
            }
        }
    }
    // Clear all references to objects refrenced by the WebContents.
    clear(webContents, contextId) {
        const ownerKey = getOwnerKey(webContents, contextId);
        const owner = this.owners[ownerKey];
        if (!owner)
            return;
        for (const id of owner.keys())
            this.dereference(id);
        delete this.owners[ownerKey];
    }
    // Saves the object into storage and assigns an ID for it.
    saveToStorage(object) {
        let id = this.electronIds.get(object);
        if (!id) {
            id = ++this.nextId;
            this.storage[id] = {
                count: 0,
                object: object
            };
            this.electronIds.set(object, id);
        }
        return id;
    }
    // Dereference the object from store.
    dereference(id) {
        const pointer = this.storage[id];
        if (pointer == null) {
            return;
        }
        pointer.count -= 1;
        if (pointer.count === 0) {
            this.electronIds.delete(pointer.object);
            delete this.storage[id];
        }
    }
    // Clear the storage when renderer process is destroyed.
    registerDeleteListener(webContents, contextId) {
        // contextId => ${processHostId}-${contextCount}
        const processHostId = contextId.split('-')[0];
        const listener = (_, deletedProcessHostId) => {
            if (deletedProcessHostId &&
                deletedProcessHostId.toString() === processHostId) {
                webContents.removeListener('render-view-deleted', listener);
                this.clear(webContents, contextId);
            }
        };
        // Note that the "render-view-deleted" event may not be emitted on time when
        // the renderer process get destroyed because of navigation, we rely on the
        // renderer process to send "ELECTRON_BROWSER_CONTEXT_RELEASE" message to
        // guard this situation.
        webContents.on('render-view-deleted', listener);
    }
}
exports["default"] = new ObjectsRegistry();


/***/ }),

/***/ "./node_modules/@electron/remote/dist/src/main/server.js":
/*!***************************************************************!*\
  !*** ./node_modules/@electron/remote/dist/src/main/server.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initialize = exports.enable = exports.isRemoteModuleEnabled = void 0;
const events_1 = __webpack_require__(/*! events */ "events");
const objects_registry_1 = __importDefault(__webpack_require__(/*! ./objects-registry */ "./node_modules/@electron/remote/dist/src/main/objects-registry.js"));
const type_utils_1 = __webpack_require__(/*! ../common/type-utils */ "./node_modules/@electron/remote/dist/src/common/type-utils.js");
const electron_1 = __webpack_require__(/*! electron */ "electron");
const get_electron_binding_1 = __webpack_require__(/*! ../common/get-electron-binding */ "./node_modules/@electron/remote/dist/src/common/get-electron-binding.js");
const v8Util = get_electron_binding_1.getElectronBinding('v8_util');
const hasWebPrefsRemoteModuleAPI = (() => {
    var _a, _b;
    const electronVersion = Number((_b = (_a = process.versions.electron) === null || _a === void 0 ? void 0 : _a.split(".")) === null || _b === void 0 ? void 0 : _b[0]);
    return Number.isNaN(electronVersion) || electronVersion < 14;
})();
// The internal properties of Function.
const FUNCTION_PROPERTIES = [
    'length', 'name', 'arguments', 'caller', 'prototype'
];
// The remote functions in renderer processes.
const rendererFunctionCache = new Map();
// eslint-disable-next-line no-undef
const finalizationRegistry = new FinalizationRegistry((fi) => {
    const mapKey = fi.id[0] + '~' + fi.id[1];
    const ref = rendererFunctionCache.get(mapKey);
    if (ref !== undefined && ref.deref() === undefined) {
        rendererFunctionCache.delete(mapKey);
        if (!fi.webContents.isDestroyed()) {
            try {
                fi.webContents.sendToFrame(fi.frameId, "REMOTE_RENDERER_RELEASE_CALLBACK" /* RENDERER_RELEASE_CALLBACK */, fi.id[0], fi.id[1]);
            }
            catch (error) {
                console.warn(`sendToFrame() failed: ${error}`);
            }
        }
    }
});
function getCachedRendererFunction(id) {
    const mapKey = id[0] + '~' + id[1];
    const ref = rendererFunctionCache.get(mapKey);
    if (ref !== undefined) {
        const deref = ref.deref();
        if (deref !== undefined)
            return deref;
    }
}
function setCachedRendererFunction(id, wc, frameId, value) {
    // eslint-disable-next-line no-undef
    const wr = new WeakRef(value);
    const mapKey = id[0] + '~' + id[1];
    rendererFunctionCache.set(mapKey, wr);
    finalizationRegistry.register(value, {
        id,
        webContents: wc,
        frameId
    });
    return value;
}
const locationInfo = new WeakMap();
// Return the description of object's members:
const getObjectMembers = function (object) {
    let names = Object.getOwnPropertyNames(object);
    // For Function, we should not override following properties even though they
    // are "own" properties.
    if (typeof object === 'function') {
        names = names.filter((name) => {
            return !FUNCTION_PROPERTIES.includes(name);
        });
    }
    // Map properties to descriptors.
    return names.map((name) => {
        const descriptor = Object.getOwnPropertyDescriptor(object, name);
        let type;
        let writable = false;
        if (descriptor.get === undefined && typeof object[name] === 'function') {
            type = 'method';
        }
        else {
            if (descriptor.set || descriptor.writable)
                writable = true;
            type = 'get';
        }
        return { name, enumerable: descriptor.enumerable, writable, type };
    });
};
// Return the description of object's prototype.
const getObjectPrototype = function (object) {
    const proto = Object.getPrototypeOf(object);
    if (proto === null || proto === Object.prototype)
        return null;
    return {
        members: getObjectMembers(proto),
        proto: getObjectPrototype(proto)
    };
};
// Convert a real value into meta data.
const valueToMeta = function (sender, contextId, value, optimizeSimpleObject = false) {
    // Determine the type of value.
    let type;
    switch (typeof value) {
        case 'object':
            // Recognize certain types of objects.
            if (value instanceof Buffer) {
                type = 'buffer';
            }
            else if (value && value.constructor && value.constructor.name === 'NativeImage') {
                type = 'nativeimage';
            }
            else if (Array.isArray(value)) {
                type = 'array';
            }
            else if (value instanceof Error) {
                type = 'error';
            }
            else if (type_utils_1.isSerializableObject(value)) {
                type = 'value';
            }
            else if (type_utils_1.isPromise(value)) {
                type = 'promise';
            }
            else if (Object.prototype.hasOwnProperty.call(value, 'callee') && value.length != null) {
                // Treat the arguments object as array.
                type = 'array';
            }
            else if (optimizeSimpleObject && v8Util.getHiddenValue(value, 'simple')) {
                // Treat simple objects as value.
                type = 'value';
            }
            else {
                type = 'object';
            }
            break;
        case 'function':
            type = 'function';
            break;
        default:
            type = 'value';
            break;
    }
    // Fill the meta object according to value's type.
    if (type === 'array') {
        return {
            type,
            members: value.map((el) => valueToMeta(sender, contextId, el, optimizeSimpleObject))
        };
    }
    else if (type === 'nativeimage') {
        return { type, value: type_utils_1.serialize(value) };
    }
    else if (type === 'object' || type === 'function') {
        return {
            type,
            name: value.constructor ? value.constructor.name : '',
            // Reference the original value if it's an object, because when it's
            // passed to renderer we would assume the renderer keeps a reference of
            // it.
            id: objects_registry_1.default.add(sender, contextId, value),
            members: getObjectMembers(value),
            proto: getObjectPrototype(value)
        };
    }
    else if (type === 'buffer') {
        return { type, value };
    }
    else if (type === 'promise') {
        // Add default handler to prevent unhandled rejections in main process
        // Instead they should appear in the renderer process
        value.then(function () { }, function () { });
        return {
            type,
            then: valueToMeta(sender, contextId, function (onFulfilled, onRejected) {
                value.then(onFulfilled, onRejected);
            })
        };
    }
    else if (type === 'error') {
        return {
            type,
            value,
            members: Object.keys(value).map(name => ({
                name,
                value: valueToMeta(sender, contextId, value[name])
            }))
        };
    }
    else {
        return {
            type: 'value',
            value
        };
    }
};
const throwRPCError = function (message) {
    const error = new Error(message);
    error.code = 'EBADRPC';
    error.errno = -72;
    throw error;
};
const removeRemoteListenersAndLogWarning = (sender, callIntoRenderer) => {
    const location = locationInfo.get(callIntoRenderer);
    let message = 'Attempting to call a function in a renderer window that has been closed or released.' +
        `\nFunction provided here: ${location}`;
    if (sender instanceof events_1.EventEmitter) {
        const remoteEvents = sender.eventNames().filter((eventName) => {
            return sender.listeners(eventName).includes(callIntoRenderer);
        });
        if (remoteEvents.length > 0) {
            message += `\nRemote event names: ${remoteEvents.join(', ')}`;
            remoteEvents.forEach((eventName) => {
                sender.removeListener(eventName, callIntoRenderer);
            });
        }
    }
    console.warn(message);
};
const fakeConstructor = (constructor, name) => new Proxy(Object, {
    get(target, prop, receiver) {
        if (prop === 'name') {
            return name;
        }
        else {
            return Reflect.get(target, prop, receiver);
        }
    }
});
// Convert array of meta data from renderer into array of real values.
const unwrapArgs = function (sender, frameId, contextId, args) {
    const metaToValue = function (meta) {
        switch (meta.type) {
            case 'nativeimage':
                return type_utils_1.deserialize(meta.value);
            case 'value':
                return meta.value;
            case 'remote-object':
                return objects_registry_1.default.get(meta.id);
            case 'array':
                return unwrapArgs(sender, frameId, contextId, meta.value);
            case 'buffer':
                return Buffer.from(meta.value.buffer, meta.value.byteOffset, meta.value.byteLength);
            case 'promise':
                return Promise.resolve({
                    then: metaToValue(meta.then)
                });
            case 'object': {
                const ret = meta.name !== 'Object' ? Object.create({
                    constructor: fakeConstructor(Object, meta.name)
                }) : {};
                for (const { name, value } of meta.members) {
                    ret[name] = metaToValue(value);
                }
                return ret;
            }
            case 'function-with-return-value': {
                const returnValue = metaToValue(meta.value);
                return function () {
                    return returnValue;
                };
            }
            case 'function': {
                // Merge contextId and meta.id, since meta.id can be the same in
                // different webContents.
                const objectId = [contextId, meta.id];
                // Cache the callbacks in renderer.
                const cachedFunction = getCachedRendererFunction(objectId);
                if (cachedFunction !== undefined) {
                    return cachedFunction;
                }
                const callIntoRenderer = function (...args) {
                    let succeed = false;
                    if (!sender.isDestroyed()) {
                        try {
                            succeed = sender.sendToFrame(frameId, "REMOTE_RENDERER_CALLBACK" /* RENDERER_CALLBACK */, contextId, meta.id, valueToMeta(sender, contextId, args)) !== false;
                        }
                        catch (error) {
                            console.warn(`sendToFrame() failed: ${error}`);
                        }
                    }
                    if (!succeed) {
                        removeRemoteListenersAndLogWarning(this, callIntoRenderer);
                    }
                };
                locationInfo.set(callIntoRenderer, meta.location);
                Object.defineProperty(callIntoRenderer, 'length', { value: meta.length });
                setCachedRendererFunction(objectId, sender, frameId, callIntoRenderer);
                return callIntoRenderer;
            }
            default:
                throw new TypeError(`Unknown type: ${meta.type}`);
        }
    };
    return args.map(metaToValue);
};
const isRemoteModuleEnabledImpl = function (contents) {
    const webPreferences = contents.getLastWebPreferences() || {};
    return webPreferences.enableRemoteModule != null ? !!webPreferences.enableRemoteModule : false;
};
const isRemoteModuleEnabledCache = new WeakMap();
const isRemoteModuleEnabled = function (contents) {
    if (hasWebPrefsRemoteModuleAPI && !isRemoteModuleEnabledCache.has(contents)) {
        isRemoteModuleEnabledCache.set(contents, isRemoteModuleEnabledImpl(contents));
    }
    return isRemoteModuleEnabledCache.get(contents);
};
exports.isRemoteModuleEnabled = isRemoteModuleEnabled;
function enable(contents) {
    isRemoteModuleEnabledCache.set(contents, true);
}
exports.enable = enable;
const handleRemoteCommand = function (channel, handler) {
    electron_1.ipcMain.on(channel, (event, contextId, ...args) => {
        let returnValue;
        if (!exports.isRemoteModuleEnabled(event.sender)) {
            event.returnValue = {
                type: 'exception',
                value: valueToMeta(event.sender, contextId, new Error('@electron/remote is disabled for this WebContents. Call require("@electron/remote/main").enable(webContents) to enable it.'))
            };
            return;
        }
        try {
            returnValue = handler(event, contextId, ...args);
        }
        catch (error) {
            returnValue = {
                type: 'exception',
                value: valueToMeta(event.sender, contextId, error),
            };
        }
        if (returnValue !== undefined) {
            event.returnValue = returnValue;
        }
    });
};
const emitCustomEvent = function (contents, eventName, ...args) {
    const event = { sender: contents, returnValue: undefined, defaultPrevented: false };
    electron_1.app.emit(eventName, event, contents, ...args);
    contents.emit(eventName, event, ...args);
    return event;
};
const logStack = function (contents, code, stack) {
    if (stack) {
        console.warn(`WebContents (${contents.id}): ${code}`, stack);
    }
};
let initialized = false;
function initialize() {
    if (initialized)
        throw new Error('@electron/remote has already been initialized');
    initialized = true;
    handleRemoteCommand("REMOTE_BROWSER_WRONG_CONTEXT_ERROR" /* BROWSER_WRONG_CONTEXT_ERROR */, function (event, contextId, passedContextId, id) {
        const objectId = [passedContextId, id];
        const cachedFunction = getCachedRendererFunction(objectId);
        if (cachedFunction === undefined) {
            // Do nothing if the error has already been reported before.
            return;
        }
        removeRemoteListenersAndLogWarning(event.sender, cachedFunction);
    });
    handleRemoteCommand("REMOTE_BROWSER_REQUIRE" /* BROWSER_REQUIRE */, function (event, contextId, moduleName, stack) {
        logStack(event.sender, `remote.require('${moduleName}')`, stack);
        const customEvent = emitCustomEvent(event.sender, 'remote-require', moduleName);
        if (customEvent.returnValue === undefined) {
            if (customEvent.defaultPrevented) {
                throw new Error(`Blocked remote.require('${moduleName}')`);
            }
            else {
                customEvent.returnValue = process.mainModule.require(moduleName);
            }
        }
        return valueToMeta(event.sender, contextId, customEvent.returnValue);
    });
    handleRemoteCommand("REMOTE_BROWSER_GET_BUILTIN" /* BROWSER_GET_BUILTIN */, function (event, contextId, moduleName, stack) {
        logStack(event.sender, `remote.getBuiltin('${moduleName}')`, stack);
        const customEvent = emitCustomEvent(event.sender, 'remote-get-builtin', moduleName);
        if (customEvent.returnValue === undefined) {
            if (customEvent.defaultPrevented) {
                throw new Error(`Blocked remote.getBuiltin('${moduleName}')`);
            }
            else {
                customEvent.returnValue = __webpack_require__(/*! electron */ "electron")[moduleName];
            }
        }
        return valueToMeta(event.sender, contextId, customEvent.returnValue);
    });
    handleRemoteCommand("REMOTE_BROWSER_GET_GLOBAL" /* BROWSER_GET_GLOBAL */, function (event, contextId, globalName, stack) {
        logStack(event.sender, `remote.getGlobal('${globalName}')`, stack);
        const customEvent = emitCustomEvent(event.sender, 'remote-get-global', globalName);
        if (customEvent.returnValue === undefined) {
            if (customEvent.defaultPrevented) {
                throw new Error(`Blocked remote.getGlobal('${globalName}')`);
            }
            else {
                customEvent.returnValue = global[globalName];
            }
        }
        return valueToMeta(event.sender, contextId, customEvent.returnValue);
    });
    handleRemoteCommand("REMOTE_BROWSER_GET_CURRENT_WINDOW" /* BROWSER_GET_CURRENT_WINDOW */, function (event, contextId, stack) {
        logStack(event.sender, 'remote.getCurrentWindow()', stack);
        const customEvent = emitCustomEvent(event.sender, 'remote-get-current-window');
        if (customEvent.returnValue === undefined) {
            if (customEvent.defaultPrevented) {
                throw new Error('Blocked remote.getCurrentWindow()');
            }
            else {
                customEvent.returnValue = event.sender.getOwnerBrowserWindow();
            }
        }
        return valueToMeta(event.sender, contextId, customEvent.returnValue);
    });
    handleRemoteCommand("REMOTE_BROWSER_GET_CURRENT_WEB_CONTENTS" /* BROWSER_GET_CURRENT_WEB_CONTENTS */, function (event, contextId, stack) {
        logStack(event.sender, 'remote.getCurrentWebContents()', stack);
        const customEvent = emitCustomEvent(event.sender, 'remote-get-current-web-contents');
        if (customEvent.returnValue === undefined) {
            if (customEvent.defaultPrevented) {
                throw new Error('Blocked remote.getCurrentWebContents()');
            }
            else {
                customEvent.returnValue = event.sender;
            }
        }
        return valueToMeta(event.sender, contextId, customEvent.returnValue);
    });
    handleRemoteCommand("REMOTE_BROWSER_CONSTRUCTOR" /* BROWSER_CONSTRUCTOR */, function (event, contextId, id, args) {
        args = unwrapArgs(event.sender, event.frameId, contextId, args);
        const constructor = objects_registry_1.default.get(id);
        if (constructor == null) {
            throwRPCError(`Cannot call constructor on missing remote object ${id}`);
        }
        return valueToMeta(event.sender, contextId, new constructor(...args));
    });
    handleRemoteCommand("REMOTE_BROWSER_FUNCTION_CALL" /* BROWSER_FUNCTION_CALL */, function (event, contextId, id, args) {
        args = unwrapArgs(event.sender, event.frameId, contextId, args);
        const func = objects_registry_1.default.get(id);
        if (func == null) {
            throwRPCError(`Cannot call function on missing remote object ${id}`);
        }
        try {
            return valueToMeta(event.sender, contextId, func(...args), true);
        }
        catch (error) {
            const err = new Error(`Could not call remote function '${func.name || 'anonymous'}'. Check that the function signature is correct. Underlying error: ${error.message}\nUnderlying stack: ${error.stack}\n`);
            err.cause = error;
            throw err;
        }
    });
    handleRemoteCommand("REMOTE_BROWSER_MEMBER_CONSTRUCTOR" /* BROWSER_MEMBER_CONSTRUCTOR */, function (event, contextId, id, method, args) {
        args = unwrapArgs(event.sender, event.frameId, contextId, args);
        const object = objects_registry_1.default.get(id);
        if (object == null) {
            throwRPCError(`Cannot call constructor '${method}' on missing remote object ${id}`);
        }
        return valueToMeta(event.sender, contextId, new object[method](...args));
    });
    handleRemoteCommand("REMOTE_BROWSER_MEMBER_CALL" /* BROWSER_MEMBER_CALL */, function (event, contextId, id, method, args) {
        args = unwrapArgs(event.sender, event.frameId, contextId, args);
        const object = objects_registry_1.default.get(id);
        if (object == null) {
            throwRPCError(`Cannot call method '${method}' on missing remote object ${id}`);
        }
        try {
            return valueToMeta(event.sender, contextId, object[method](...args), true);
        }
        catch (error) {
            const err = new Error(`Could not call remote method '${method}'. Check that the method signature is correct. Underlying error: ${error.message}\nUnderlying stack: ${error.stack}\n`);
            err.cause = error;
            throw err;
        }
    });
    handleRemoteCommand("REMOTE_BROWSER_MEMBER_SET" /* BROWSER_MEMBER_SET */, function (event, contextId, id, name, args) {
        args = unwrapArgs(event.sender, event.frameId, contextId, args);
        const obj = objects_registry_1.default.get(id);
        if (obj == null) {
            throwRPCError(`Cannot set property '${name}' on missing remote object ${id}`);
        }
        obj[name] = args[0];
        return null;
    });
    handleRemoteCommand("REMOTE_BROWSER_MEMBER_GET" /* BROWSER_MEMBER_GET */, function (event, contextId, id, name) {
        const obj = objects_registry_1.default.get(id);
        if (obj == null) {
            throwRPCError(`Cannot get property '${name}' on missing remote object ${id}`);
        }
        return valueToMeta(event.sender, contextId, obj[name]);
    });
    handleRemoteCommand("REMOTE_BROWSER_DEREFERENCE" /* BROWSER_DEREFERENCE */, function (event, contextId, id) {
        objects_registry_1.default.remove(event.sender, contextId, id);
    });
    handleRemoteCommand("REMOTE_BROWSER_CONTEXT_RELEASE" /* BROWSER_CONTEXT_RELEASE */, (event, contextId) => {
        objects_registry_1.default.clear(event.sender, contextId);
        return null;
    });
}
exports.initialize = initialize;


/***/ }),

/***/ "./node_modules/@electron/remote/main/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@electron/remote/main/index.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ../dist/src/main */ "./node_modules/@electron/remote/dist/src/main/index.js")


/***/ }),

/***/ "./src/common/Macros.ts":
/*!******************************!*\
  !*** ./src/common/Macros.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOCKET_ID = exports.SOCKET_PORT = void 0;
exports.SOCKET_PORT = 19269;
exports.SOCKET_ID = 'JESTER_APP';


/***/ }),

/***/ "./src/main/Server.ts":
/*!****************************!*\
  !*** ./src/main/Server.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createServer = void 0;
var node_ipc_1 = __importDefault(__webpack_require__(/*! node-ipc */ "./node_modules/node-ipc/node-ipc.cjs"));
var Macros_1 = __webpack_require__(/*! ../common/Macros */ "./src/common/Macros.ts");
function createServer(win) {
    node_ipc_1.default.config.id = Macros_1.SOCKET_ID;
    node_ipc_1.default.config.networkPort = Macros_1.SOCKET_PORT;
    node_ipc_1.default.config.silent = true;
    node_ipc_1.default.serveNet(function () {
        node_ipc_1.default.server.on('connect', function () {
            console.log('Connection established');
        });
        node_ipc_1.default.server.on('message', function (data, socket) {
            console.log('dispatch setResult');
            win.webContents.send('redux', data);
        });
    });
    return node_ipc_1.default.server;
}
exports.createServer = createServer;


/***/ }),

/***/ "./src/main/main.ts":
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Entry point of the Election app.
 */
var electron_1 = __webpack_require__(/*! electron */ "electron");
var path = __importStar(__webpack_require__(/*! path */ "path"));
var url = __importStar(__webpack_require__(/*! url */ "url"));
var child_process_1 = __webpack_require__(/*! child_process */ "child_process");
(__webpack_require__(/*! @electron/remote/main */ "./node_modules/@electron/remote/main/index.js").initialize)();
var Server_1 = __webpack_require__(/*! ./Server */ "./src/main/Server.ts");
var mainWindow;
var server;
electron_1.ipcMain.on('exec', function (event, args) {
    console.log('exec npm test');
    (0, child_process_1.exec)('npm test', { cwd: path.resolve('./') }, function (error, stdout, stderr) {
        if (error) {
            console.error(error);
        }
        console.log('stdout: ' + stdout);
        console.error('stderr: ' + stderr);
    });
});
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 1200,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            devTools:  false ? 0 : true,
            contextIsolation: false,
        },
    });
    (__webpack_require__(/*! @electron/remote/main */ "./node_modules/@electron/remote/main/index.js").enable)(mainWindow.webContents);
    server = (0, Server_1.createServer)(mainWindow);
    server.start();
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true,
    }));
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        if (server !== null)
            server.stop();
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        server = null;
    });
    // mainWindow.removeMenu()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "dgram":
/*!************************!*\
  !*** external "dgram" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("dgram");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "./node_modules/node-ipc/node-ipc.cjs":
/*!********************************************!*\
  !*** ./node_modules/node-ipc/node-ipc.cjs ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = undefined;
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};

// node_modules/js-message/Message.js
var require_Message = __commonJS({
  "node_modules/js-message/Message.js"(exports, module2) {
    function Message3() {
      Object.defineProperties(this, {
        data: {
          enumerable: true,
          get: getData,
          set: setData
        },
        type: {
          enumerable: true,
          get: getType,
          set: setType
        },
        load: {
          enumerable: true,
          writable: false,
          value: parse
        },
        JSON: {
          enumerable: true,
          get: getJSON
        }
      });
      var type = "";
      var data = {};
      function getType() {
        return type;
      }
      function getData() {
        return data;
      }
      function getJSON() {
        return JSON.stringify({
          type,
          data
        });
      }
      function setType(value) {
        type = value;
      }
      function setData(value) {
        data = value;
      }
      function parse(message) {
        try {
          var message = JSON.parse(message);
          type = message.type;
          data = message.data;
        } catch (err) {
          var badMessage = message;
          type = "error", data = {
            message: "Invalid JSON response format",
            err,
            response: badMessage
          };
        }
      }
    }
    module2.exports = Message3;
  }
});

// node_modules/js-queue/queue.js
var require_queue = __commonJS({
  "node_modules/js-queue/queue.js"(exports, module2) {
    function Queue2(asStack) {
      Object.defineProperties(this, {
        add: {
          enumerable: true,
          writable: false,
          value: addToQueue
        },
        next: {
          enumerable: true,
          writable: false,
          value: run
        },
        clear: {
          enumerable: true,
          writable: false,
          value: clearQueue
        },
        contents: {
          enumerable: false,
          get: getQueue,
          set: setQueue
        },
        autoRun: {
          enumerable: true,
          writable: true,
          value: true
        },
        stop: {
          enumerable: true,
          writable: true,
          value: false
        }
      });
      var queue = [];
      var running = false;
      var stop = false;
      function clearQueue() {
        queue = [];
        return queue;
      }
      function getQueue() {
        return queue;
      }
      function setQueue(val) {
        queue = val;
        return queue;
      }
      function addToQueue() {
        for (var i in arguments) {
          queue.push(arguments[i]);
        }
        if (!running && !this.stop && this.autoRun) {
          this.next();
        }
      }
      function run() {
        running = true;
        if (queue.length < 1 || this.stop) {
          running = false;
          return;
        }
        queue.shift().bind(this)();
      }
    }
    module2.exports = Queue2;
  }
});

// node-ipc.js
__export(exports, {
  IPCModule: () => IPCModule,
  default: () => singleton
});

// entities/Defaults.js
var import_os = __toModule(__webpack_require__(/*! os */ "os"));
var Defaults = class {
  constructor() {
    __publicField(this, "appspace", "app.");
    __publicField(this, "socketRoot", "/tmp/");
    __publicField(this, "id", import_os.default.hostname());
    __publicField(this, "encoding", "utf8");
    __publicField(this, "rawBuffer", false);
    __publicField(this, "sync", false);
    __publicField(this, "unlink", true);
    __publicField(this, "delimiter", "\f");
    __publicField(this, "silent", false);
    __publicField(this, "logDepth", 5);
    __publicField(this, "logInColor", true);
    __publicField(this, "logger", console.log.bind(console));
    __publicField(this, "maxConnections", 100);
    __publicField(this, "retry", 500);
    __publicField(this, "maxRetries", Infinity);
    __publicField(this, "stopRetrying", false);
    __publicField(this, "IPType", getIPType());
    __publicField(this, "tls", false);
    __publicField(this, "networkHost", this.IPType == "IPv6" ? "::1" : "127.0.0.1");
    __publicField(this, "networkPort", 8e3);
    __publicField(this, "readableAll", false);
    __publicField(this, "writableAll", false);
    __publicField(this, "interface", {
      localAddress: false,
      localPort: false,
      family: false,
      hints: false,
      lookup: false
    });
  }
};
function getIPType() {
  const networkInterfaces = import_os.default.networkInterfaces();
  let IPType = "";
  if (networkInterfaces && Array.isArray(networkInterfaces) && networkInterfaces.length > 0) {
    IPType = networkInterfaces[Object.keys(networkInterfaces)[0]][0].family;
  }
  return IPType;
}

// dao/client.js
var import_net = __toModule(__webpack_require__(/*! net */ "net"));
var import_tls = __toModule(__webpack_require__(/*! tls */ "tls"));

// entities/EventParser.js
var Parser = class {
  constructor(config) {
    if (!config) {
      config = new Defaults();
    }
    this.delimiter = config.delimiter;
  }
  format(message) {
    if (!message.data && message.data !== false && message.data !== 0) {
      message.data = {};
    }
    if (message.data["_maxListeners"]) {
      message.data = {};
    }
    message = message.JSON + this.delimiter;
    return message;
  }
  parse(data) {
    let events = data.split(this.delimiter);
    events.pop();
    return events;
  }
};

// dao/client.js
var import_js_message = __toModule(require_Message());
var import_fs = __toModule(__webpack_require__(/*! fs */ "fs"));
var import_js_queue = __toModule(require_queue());

// node_modules/strong-type/index.js
var Fake = class {
};
var FakeCore = class {
};
var Is = class {
  constructor(strict = true) {
    this.strict = strict;
  }
  throw(valueType, expectedType) {
    let err = new TypeError();
    err.message = `expected type of ${valueType} to be ${expectedType}`;
    if (!this.strict) {
      return false;
    }
    throw err;
  }
  typeCheck(value, type) {
    if (typeof value === type) {
      return true;
    }
    return this.throw(typeof value, type);
  }
  instanceCheck(value = new Fake(), constructor = FakeCore) {
    if (value instanceof constructor) {
      return true;
    }
    return this.throw(typeof value, constructor.name);
  }
  symbolStringCheck(value, type) {
    if (Object.prototype.toString.call(value) == `[object ${type}]`) {
      return true;
    }
    return this.throw(Object.prototype.toString.call(value), `[object ${type}]`);
  }
  compare(value, targetValue, typeName) {
    if (value == targetValue) {
      return true;
    }
    return this.throw(typeof value, typeName);
  }
  defined(value) {
    const weakIs = new Is(false);
    if (weakIs.undefined(value)) {
      return this.throw("undefined", "defined");
    }
    return true;
  }
  any(value) {
    return this.defined(value);
  }
  exists(value) {
    return this.defined(value);
  }
  union(value, typesString) {
    const types = typesString.split("|");
    const weakIs = new Is(false);
    let pass = false;
    let type = "undefined";
    for (type of types) {
      try {
        if (weakIs[type](value)) {
          pass = true;
          break;
        }
      } catch (err) {
        return this.throw(type, "a method available on strong-type");
      }
    }
    if (pass) {
      return this[type](value);
    }
    return this.throw(typeof value, types.join("|"));
  }
  finite(value) {
    if (isFinite(value)) {
      return true;
    }
    return this.throw(typeof value, "finite");
  }
  NaN(value) {
    if (!this.number(value)) {
      return this.number(value);
    }
    if (isNaN(value)) {
      return true;
    }
    return this.throw(typeof value, "NaN");
  }
  null(value) {
    return this.compare(value, null, "null");
  }
  array(value) {
    return this.instanceCheck(value, Array);
  }
  boolean(value) {
    return this.typeCheck(value, "boolean");
  }
  bigInt(value) {
    return this.typeCheck(value, "bigint");
  }
  date(value) {
    return this.instanceCheck(value, Date);
  }
  generator(value) {
    return this.symbolStringCheck(value, "Generator");
  }
  asyncGenerator(value) {
    return this.symbolStringCheck(value, "AsyncGenerator");
  }
  globalThis(value) {
    return this.compare(value, globalThis, "explicitly globalThis, not window, global nor self");
  }
  infinity(value) {
    return this.compare(value, Infinity, "Infinity");
  }
  map(value) {
    return this.instanceCheck(value, Map);
  }
  weakMap(value) {
    return this.instanceCheck(value, WeakMap);
  }
  number(value) {
    return this.typeCheck(value, "number");
  }
  object(value) {
    return this.typeCheck(value, "object");
  }
  promise(value) {
    return this.instanceCheck(value, Promise);
  }
  regExp(value) {
    return this.instanceCheck(value, RegExp);
  }
  undefined(value) {
    return this.typeCheck(value, "undefined");
  }
  set(value) {
    return this.instanceCheck(value, Set);
  }
  weakSet(value) {
    return this.instanceCheck(value, WeakSet);
  }
  string(value) {
    return this.typeCheck(value, "string");
  }
  symbol(value) {
    return this.typeCheck(value, "symbol");
  }
  function(value) {
    return this.typeCheck(value, "function");
  }
  asyncFunction(value) {
    return this.symbolStringCheck(value, "AsyncFunction");
  }
  generatorFunction(value) {
    return this.symbolStringCheck(value, "GeneratorFunction");
  }
  asyncGeneratorFunction(value) {
    return this.symbolStringCheck(value, "AsyncGeneratorFunction");
  }
  error(value) {
    return this.instanceCheck(value, Error);
  }
  evalError(value) {
    return this.instanceCheck(value, EvalError);
  }
  rangeError(value) {
    return this.instanceCheck(value, RangeError);
  }
  referenceError(value) {
    return this.instanceCheck(value, ReferenceError);
  }
  syntaxError(value) {
    return this.instanceCheck(value, SyntaxError);
  }
  typeError(value) {
    return this.instanceCheck(value, TypeError);
  }
  URIError(value) {
    return this.instanceCheck(value, URIError);
  }
  bigInt64Array(value) {
    return this.instanceCheck(value, BigInt64Array);
  }
  bigUint64Array(value) {
    return this.instanceCheck(value, BigUint64Array);
  }
  float32Array(value) {
    return this.instanceCheck(value, Float32Array);
  }
  float64Array(value) {
    return this.instanceCheck(value, Float64Array);
  }
  int8Array(value) {
    return this.instanceCheck(value, Int8Array);
  }
  int16Array(value) {
    return this.instanceCheck(value, Int16Array);
  }
  int32Array(value) {
    return this.instanceCheck(value, Int32Array);
  }
  uint8Array(value) {
    return this.instanceCheck(value, Uint8Array);
  }
  uint8ClampedArray(value) {
    return this.instanceCheck(value, Uint8ClampedArray);
  }
  uint16Array(value) {
    return this.instanceCheck(value, Uint16Array);
  }
  uint32Array(value) {
    return this.instanceCheck(value, Uint32Array);
  }
  arrayBuffer(value) {
    return this.instanceCheck(value, ArrayBuffer);
  }
  dataView(value) {
    return this.instanceCheck(value, DataView);
  }
  sharedArrayBuffer(value) {
    return this.instanceCheck(value, function() {
      try {
        return SharedArrayBuffer;
      } catch (e) {
        return Fake;
      }
    }());
  }
  intlDateTimeFormat(value) {
    return this.instanceCheck(value, Intl.DateTimeFormat);
  }
  intlCollator(value) {
    return this.instanceCheck(value, Intl.Collator);
  }
  intlDisplayNames(value) {
    return this.instanceCheck(value, Intl.DisplayNames);
  }
  intlListFormat(value) {
    return this.instanceCheck(value, Intl.ListFormat);
  }
  intlLocale(value) {
    return this.instanceCheck(value, Intl.Locale);
  }
  intlNumberFormat(value) {
    return this.instanceCheck(value, Intl.NumberFormat);
  }
  intlPluralRules(value) {
    return this.instanceCheck(value, Intl.PluralRules);
  }
  intlRelativeTimeFormat(value) {
    return this.instanceCheck(value, Intl.RelativeTimeFormat);
  }
  intlRelativeTimeFormat(value) {
    return this.instanceCheck(value, Intl.RelativeTimeFormat);
  }
  finalizationRegistry(value) {
    return this.instanceCheck(value, FinalizationRegistry);
  }
  weakRef(value) {
    return this.instanceCheck(value, WeakRef);
  }
};

// node_modules/event-pubsub/index.js
var is = new Is();
var _handleOnce, _all, _once, _events;
var EventPubSub = class {
  constructor() {
    __privateAdd(this, _handleOnce, (type, handlers, ...args) => {
      is.string(type);
      is.array(handlers);
      const deleteOnceHandled = [];
      for (let handler of handlers) {
        handler(...args);
        if (handler[__privateGet(this, _once)]) {
          deleteOnceHandled.push(handler);
        }
      }
      for (let handler of deleteOnceHandled) {
        this.off(type, handler);
      }
    });
    __privateAdd(this, _all, Symbol.for("event-pubsub-all"));
    __privateAdd(this, _once, Symbol.for("event-pubsub-once"));
    __privateAdd(this, _events, {});
  }
  on(type, handler, once = false) {
    is.string(type);
    is.function(handler);
    is.boolean(once);
    if (type == "*") {
      type = __privateGet(this, _all);
    }
    if (!__privateGet(this, _events)[type]) {
      __privateGet(this, _events)[type] = [];
    }
    handler[__privateGet(this, _once)] = once;
    __privateGet(this, _events)[type].push(handler);
    return this;
  }
  once(type, handler) {
    return this.on(type, handler, true);
  }
  off(type = "*", handler = "*") {
    is.string(type);
    if (type == __privateGet(this, _all).toString() || type == "*") {
      type = __privateGet(this, _all);
    }
    if (!__privateGet(this, _events)[type]) {
      return this;
    }
    if (handler == "*") {
      delete __privateGet(this, _events)[type];
      return this;
    }
    is.function(handler);
    const handlers = __privateGet(this, _events)[type];
    while (handlers.includes(handler)) {
      handlers.splice(handlers.indexOf(handler), 1);
    }
    if (handlers.length < 1) {
      delete __privateGet(this, _events)[type];
    }
    return this;
  }
  emit(type, ...args) {
    is.string(type);
    const globalHandlers = __privateGet(this, _events)[__privateGet(this, _all)] || [];
    __privateGet(this, _handleOnce).call(this, __privateGet(this, _all).toString(), globalHandlers, type, ...args);
    if (!__privateGet(this, _events)[type]) {
      return this;
    }
    const handlers = __privateGet(this, _events)[type];
    __privateGet(this, _handleOnce).call(this, type, handlers, ...args);
    return this;
  }
  reset() {
    this.off(__privateGet(this, _all).toString());
    for (let type in __privateGet(this, _events)) {
      this.off(type);
    }
    return this;
  }
  get list() {
    return Object.assign({}, __privateGet(this, _events));
  }
};
_handleOnce = new WeakMap();
_all = new WeakMap();
_once = new WeakMap();
_events = new WeakMap();

// dao/client.js
var eventParser = new Parser();
var Client = class extends EventPubSub {
  constructor(config, log2) {
    super();
    __publicField(this, "Client", Client);
    __publicField(this, "queue", new import_js_queue.default());
    __publicField(this, "socket", false);
    __publicField(this, "connect", connect);
    __publicField(this, "emit", emit);
    __publicField(this, "retriesRemaining", 0);
    __publicField(this, "explicitlyDisconnected", false);
    this.config = config;
    this.log = log2;
    this.publish = super.emit;
    config.maxRetries ? this.retriesRemaining = config.maxRetries : 0;
    eventParser = new Parser(this.config);
  }
};
function emit(type, data) {
  this.log("dispatching event to ", this.id, this.path, " : ", type, ",", data);
  let message = new import_js_message.default();
  message.type = type;
  message.data = data;
  if (this.config.rawBuffer) {
    message = Buffer.from(type, this.config.encoding);
  } else {
    message = eventParser.format(message);
  }
  if (!this.config.sync) {
    this.socket.write(message);
    return;
  }
  this.queue.add(syncEmit.bind(this, message));
}
function syncEmit(message) {
  this.log("dispatching event to ", this.id, this.path, " : ", message);
  this.socket.write(message);
}
function connect() {
  let client = this;
  client.log("requested connection to ", client.id, client.path);
  if (!this.path) {
    client.log("\n\n######\nerror: ", client.id, " client has not specified socket path it wishes to connect to.");
    return;
  }
  const options = {};
  if (!client.port) {
    client.log("Connecting client on Unix Socket :", client.path);
    options.path = client.path;
    if (process.platform === "win32" && !client.path.startsWith("\\\\.\\pipe\\")) {
      options.path = options.path.replace(/^\//, "");
      options.path = options.path.replace(/\//g, "-");
      options.path = `\\\\.\\pipe\\${options.path}`;
    }
    client.socket = import_net.default.connect(options);
  } else {
    options.host = client.path;
    options.port = client.port;
    if (client.config.interface.localAddress) {
      options.localAddress = client.config.interface.localAddress;
    }
    if (client.config.interface.localPort) {
      options.localPort = client.config.interface.localPort;
    }
    if (client.config.interface.family) {
      options.family = client.config.interface.family;
    }
    if (client.config.interface.hints) {
      options.hints = client.config.interface.hints;
    }
    if (client.config.interface.lookup) {
      options.lookup = client.config.interface.lookup;
    }
    if (!client.config.tls) {
      client.log("Connecting client via TCP to", options);
      client.socket = import_net.default.connect(options);
    } else {
      client.log("Connecting client via TLS to", client.path, client.port, client.config.tls);
      if (client.config.tls.private) {
        client.config.tls.key = import_fs.default.readFileSync(client.config.tls.private);
      }
      if (client.config.tls.public) {
        client.config.tls.cert = import_fs.default.readFileSync(client.config.tls.public);
      }
      if (client.config.tls.trustedConnections) {
        if (typeof client.config.tls.trustedConnections === "string") {
          client.config.tls.trustedConnections = [client.config.tls.trustedConnections];
        }
        client.config.tls.ca = [];
        for (let i = 0; i < client.config.tls.trustedConnections.length; i++) {
          client.config.tls.ca.push(import_fs.default.readFileSync(client.config.tls.trustedConnections[i]));
        }
      }
      Object.assign(client.config.tls, options);
      client.socket = import_tls.default.connect(client.config.tls);
    }
  }
  client.socket.setEncoding(this.config.encoding);
  client.socket.on("error", function(err) {
    client.log("\n\n######\nerror: ", err);
    client.publish("error", err);
  });
  client.socket.on("connect", function connectionMade() {
    client.publish("connect");
    client.retriesRemaining = client.config.maxRetries;
    client.log("retrying reset");
  });
  client.socket.on("close", function connectionClosed() {
    client.log("connection closed", client.id, client.path, client.retriesRemaining, "tries remaining of", client.config.maxRetries);
    if (client.config.stopRetrying || client.retriesRemaining < 1 || client.explicitlyDisconnected) {
      client.publish("disconnect");
      client.log(client.config.id, "exceeded connection rety amount of", " or stopRetrying flag set.");
      client.socket.destroy();
      client.publish("destroy");
      client = void 0;
      return;
    }
    setTimeout(function retryTimeout() {
      if (client.explicitlyDisconnected) {
        return;
      }
      client.retriesRemaining--;
      client.connect();
    }.bind(null, client), client.config.retry);
    client.publish("disconnect");
  });
  client.socket.on("data", function(data) {
    client.log("## received events ##");
    if (client.config.rawBuffer) {
      client.publish("data", Buffer.from(data, client.config.encoding));
      if (!client.config.sync) {
        return;
      }
      client.queue.next();
      return;
    }
    if (!this.ipcBuffer) {
      this.ipcBuffer = "";
    }
    data = this.ipcBuffer += data;
    if (data.slice(-1) != eventParser.delimiter || data.indexOf(eventParser.delimiter) == -1) {
      client.log("Messages are large, You may want to consider smaller messages.");
      return;
    }
    this.ipcBuffer = "";
    const events = eventParser.parse(data);
    const eCount = events.length;
    for (let i = 0; i < eCount; i++) {
      let message = new import_js_message.default();
      message.load(events[i]);
      client.log("detected event", message.type, message.data);
      client.publish(message.type, message.data);
    }
    if (!client.config.sync) {
      return;
    }
    client.queue.next();
  });
}

// dao/socketServer.js
var import_net2 = __toModule(__webpack_require__(/*! net */ "net"));
var import_tls2 = __toModule(__webpack_require__(/*! tls */ "tls"));
var import_fs2 = __toModule(__webpack_require__(/*! fs */ "fs"));
var import_dgram = __toModule(__webpack_require__(/*! dgram */ "dgram"));
var import_js_message2 = __toModule(require_Message());
var eventParser2 = new Parser();
var Server = class extends EventPubSub {
  constructor(path, config, log2, port) {
    super();
    __publicField(this, "udp4", false);
    __publicField(this, "udp6", false);
    __publicField(this, "server", false);
    __publicField(this, "sockets", []);
    __publicField(this, "emit", emit2);
    __publicField(this, "broadcast", broadcast);
    this.config = config;
    this.path = path;
    this.port = port;
    this.log = log2;
    this.publish = super.emit;
    eventParser2 = new Parser(this.config);
    this.on("close", serverClosed.bind(this));
  }
  onStart(socket) {
    this.publish("start", socket);
  }
  stop() {
    this.server.close();
  }
  start() {
    if (!this.path) {
      this.log("Socket Server Path not specified, refusing to start");
      return;
    }
    if (this.config.unlink) {
      import_fs2.default.unlink(this.path, startServer.bind(this));
    } else {
      startServer.bind(this)();
    }
  }
};
function emit2(socket, type, data) {
  this.log("dispatching event to socket", " : ", type, data);
  let message = new import_js_message2.default();
  message.type = type;
  message.data = data;
  if (this.config.rawBuffer) {
    this.log(this.config.encoding);
    message = Buffer.from(type, this.config.encoding);
  } else {
    message = eventParser2.format(message);
  }
  if (this.udp4 || this.udp6) {
    if (!socket.address || !socket.port) {
      this.log("Attempting to emit to a single UDP socket without supplying socket address or port. Redispatching event as broadcast to all connected sockets");
      this.broadcast(type, data);
      return;
    }
    this.server.write(message, socket);
    return;
  }
  socket.write(message);
}
function broadcast(type, data) {
  this.log("broadcasting event to all known sockets listening to ", this.path, " : ", this.port ? this.port : "", type, data);
  let message = new import_js_message2.default();
  message.type = type;
  message.data = data;
  if (this.config.rawBuffer) {
    message = Buffer.from(type, this.config.encoding);
  } else {
    message = eventParser2.format(message);
  }
  if (this.udp4 || this.udp6) {
    for (let i = 1, count = this.sockets.length; i < count; i++) {
      this.server.write(message, this.sockets[i]);
    }
  } else {
    for (let i = 0, count = this.sockets.length; i < count; i++) {
      this.sockets[i].write(message);
    }
  }
}
function serverClosed() {
  for (let i = 0, count = this.sockets.length; i < count; i++) {
    let socket = this.sockets[i];
    let destroyedSocketId = false;
    if (socket) {
      if (socket.readable) {
        continue;
      }
    }
    if (socket.id) {
      destroyedSocketId = socket.id;
    }
    this.log("socket disconnected", destroyedSocketId.toString());
    if (socket && socket.destroy) {
      socket.destroy();
    }
    this.sockets.splice(i, 1);
    this.publish("socket.disconnected", socket, destroyedSocketId);
    return;
  }
}
function gotData(socket, data, UDPSocket) {
  let sock = this.udp4 || this.udp6 ? UDPSocket : socket;
  if (this.config.rawBuffer) {
    data = Buffer.from(data, this.config.encoding);
    this.publish("data", data, sock);
    return;
  }
  if (!sock.ipcBuffer) {
    sock.ipcBuffer = "";
  }
  data = sock.ipcBuffer += data;
  if (data.slice(-1) != eventParser2.delimiter || data.indexOf(eventParser2.delimiter) == -1) {
    this.log("Messages are large, You may want to consider smaller messages.");
    return;
  }
  sock.ipcBuffer = "";
  data = eventParser2.parse(data);
  while (data.length > 0) {
    let message = new import_js_message2.default();
    message.load(data.shift());
    if (message.data && message.data.id) {
      sock.id = message.data.id;
    }
    this.log("received event of : ", message.type, message.data);
    this.publish(message.type, message.data, sock);
  }
}
function socketClosed(socket) {
  this.publish("close", socket);
}
function serverCreated(socket) {
  this.sockets.push(socket);
  if (socket.setEncoding) {
    socket.setEncoding(this.config.encoding);
  }
  this.log("## socket connection to server detected ##");
  socket.on("close", socketClosed.bind(this));
  socket.on("error", function(err) {
    this.log("server socket error", err);
    this.publish("error", err);
  }.bind(this));
  socket.on("data", gotData.bind(this, socket));
  socket.on("message", function(msg, rinfo) {
    if (!rinfo) {
      return;
    }
    this.log("Received UDP message from ", rinfo.address, rinfo.port);
    let data;
    if (this.config.rawSocket) {
      data = Buffer.from(msg, this.config.encoding);
    } else {
      data = msg.toString();
    }
    socket.emit("data", data, rinfo);
  }.bind(this));
  this.publish("connect", socket);
  if (this.config.rawBuffer) {
    return;
  }
}
function startServer() {
  this.log("starting server on ", this.path, this.port ? `:${this.port}` : "");
  if (!this.udp4 && !this.udp6) {
    this.log("starting TLS server", this.config.tls);
    if (!this.config.tls) {
      this.server = import_net2.default.createServer(serverCreated.bind(this));
    } else {
      startTLSServer.bind(this)();
    }
  } else {
    this.server = import_dgram.default.createSocket(this.udp4 ? "udp4" : "udp6");
    this.server.write = UDPWrite.bind(this);
    this.server.on("listening", function UDPServerStarted() {
      serverCreated.bind(this)(this.server);
    }.bind(this));
  }
  this.server.on("error", function(err) {
    this.log("server error", err);
    this.publish("error", err);
  }.bind(this));
  this.server.maxConnections = this.config.maxConnections;
  if (!this.port) {
    this.log("starting server as", "Unix || Windows Socket");
    if (process.platform === "win32") {
      this.path = this.path.replace(/^\//, "");
      this.path = this.path.replace(/\//g, "-");
      this.path = `\\\\.\\pipe\\${this.path}`;
    }
    this.server.listen({
      path: this.path,
      readableAll: this.config.readableAll,
      writableAll: this.config.writableAll
    }, this.onStart.bind(this));
    return;
  }
  if (!this.udp4 && !this.udp6) {
    this.log("starting server as", this.config.tls ? "TLS" : "TCP");
    this.server.listen(this.port, this.path, this.onStart.bind(this));
    return;
  }
  this.log("starting server as", this.udp4 ? "udp4" : "udp6");
  this.server.bind(this.port, this.path);
  this.onStart({
    address: this.path,
    port: this.port
  });
}
function startTLSServer() {
  this.log("starting TLS server", this.config.tls);
  if (this.config.tls.private) {
    this.config.tls.key = import_fs2.default.readFileSync(this.config.tls.private);
  } else {
    this.config.tls.key = import_fs2.default.readFileSync(`${__dirname}/../local-node-ipc-certs/private/server.key`);
  }
  if (this.config.tls.public) {
    this.config.tls.cert = import_fs2.default.readFileSync(this.config.tls.public);
  } else {
    this.config.tls.cert = import_fs2.default.readFileSync(`${__dirname}/../local-node-ipc-certs/server.pub`);
  }
  if (this.config.tls.dhparam) {
    this.config.tls.dhparam = import_fs2.default.readFileSync(this.config.tls.dhparam);
  }
  if (this.config.tls.trustedConnections) {
    if (typeof this.config.tls.trustedConnections === "string") {
      this.config.tls.trustedConnections = [this.config.tls.trustedConnections];
    }
    this.config.tls.ca = [];
    for (let i = 0; i < this.config.tls.trustedConnections.length; i++) {
      this.config.tls.ca.push(import_fs2.default.readFileSync(this.config.tls.trustedConnections[i]));
    }
  }
  this.server = import_tls2.default.createServer(this.config.tls, serverCreated.bind(this));
}
function UDPWrite(message, socket) {
  let data = Buffer.from(message, this.config.encoding);
  this.server.send(data, 0, data.length, socket.port, socket.address, function(err, bytes) {
    if (err) {
      this.log("error writing data to socket", err);
      this.publish("error", function(err2) {
        this.publish("error", err2);
      });
    }
  });
}

// services/IPC.js
var import_util = __toModule(__webpack_require__(/*! util */ "util"));
var IPC = class {
  constructor() {
    __publicField(this, "config", new Defaults());
    __publicField(this, "of", {});
    __publicField(this, "server", false);
  }
  get connectTo() {
    return connect2;
  }
  get connectToNet() {
    return connectNet;
  }
  get disconnect() {
    return disconnect;
  }
  get serve() {
    return serve;
  }
  get serveNet() {
    return serveNet;
  }
  get log() {
    return log;
  }
  set connectTo(value) {
    return connect2;
  }
  set connectToNet(value) {
    return connectNet;
  }
  set disconnect(value) {
    return disconnect;
  }
  set serve(value) {
    return serve;
  }
  set serveNet(value) {
    return serveNet;
  }
  set log(value) {
    return log;
  }
};
function log(...args) {
  if (this.config.silent) {
    return;
  }
  for (let i = 0, count = args.length; i < count; i++) {
    if (typeof args[i] != "object") {
      continue;
    }
    args[i] = import_util.default.inspect(args[i], {
      depth: this.config.logDepth,
      colors: this.config.logInColor
    });
  }
  this.config.logger(args.join(" "));
}
function disconnect(id) {
  if (!this.of[id]) {
    return;
  }
  this.of[id].explicitlyDisconnected = true;
  this.of[id].off("*", "*");
  if (this.of[id].socket) {
    if (this.of[id].socket.destroy) {
      this.of[id].socket.destroy();
    }
  }
  delete this.of[id];
}
function serve(path, callback) {
  if (typeof path == "function") {
    callback = path;
    path = false;
  }
  if (!path) {
    this.log("Server path not specified, so defaulting to", "ipc.config.socketRoot + ipc.config.appspace + ipc.config.id", this.config.socketRoot + this.config.appspace + this.config.id);
    path = this.config.socketRoot + this.config.appspace + this.config.id;
  }
  if (!callback) {
    callback = emptyCallback;
  }
  this.server = new Server(path, this.config, log);
  this.server.on("start", callback);
}
function emptyCallback() {
}
function serveNet(host, port, UDPType2, callback) {
  if (typeof host == "number") {
    callback = UDPType2;
    UDPType2 = port;
    port = host;
    host = false;
  }
  if (typeof host == "function") {
    callback = host;
    UDPType2 = false;
    host = false;
    port = false;
  }
  if (!host) {
    this.log("Server host not specified, so defaulting to", "ipc.config.networkHost", this.config.networkHost);
    host = this.config.networkHost;
  }
  if (host.toLowerCase() == "udp4" || host.toLowerCase() == "udp6") {
    callback = port;
    UDPType2 = host.toLowerCase();
    port = false;
    host = this.config.networkHost;
  }
  if (typeof port == "string") {
    callback = UDPType2;
    UDPType2 = port;
    port = false;
  }
  if (typeof port == "function") {
    callback = port;
    UDPType2 = false;
    port = false;
  }
  if (!port) {
    this.log("Server port not specified, so defaulting to", "ipc.config.networkPort", this.config.networkPort);
    port = this.config.networkPort;
  }
  if (typeof UDPType2 == "function") {
    callback = UDPType2;
    UDPType2 = false;
  }
  if (!callback) {
    callback = emptyCallback;
  }
  this.server = new Server(host, this.config, log, port);
  if (UDPType2) {
    this.server[UDPType2] = true;
    if (UDPType2 === "udp4" && host === "::1") {
      this.server.path = "127.0.0.1";
    }
  }
  this.server.on("start", callback);
}
function connect2(id, path, callback) {
  if (typeof path == "function") {
    callback = path;
    path = false;
  }
  if (!callback) {
    callback = emptyCallback;
  }
  if (!id) {
    this.log("Service id required", "Requested service connection without specifying service id. Aborting connection attempt");
    return;
  }
  if (!path) {
    this.log("Service path not specified, so defaulting to", "ipc.config.socketRoot + ipc.config.appspace + id", (this.config.socketRoot + this.config.appspace + id).data);
    path = this.config.socketRoot + this.config.appspace + id;
  }
  if (this.of[id]) {
    if (!this.of[id].socket.destroyed) {
      this.log("Already Connected to", id, "- So executing success without connection");
      callback();
      return;
    }
    this.of[id].socket.destroy();
  }
  this.of[id] = new Client(this.config, this.log);
  this.of[id].id = id;
  this.of[id].socket ? this.of[id].socket.id = id : null;
  this.of[id].path = path;
  this.of[id].connect();
  callback(this);
}
function connectNet(id, host, port, callback) {
  if (!id) {
    this.log("Service id required", "Requested service connection without specifying service id. Aborting connection attempt");
    return;
  }
  if (typeof host == "number") {
    callback = port;
    port = host;
    host = false;
  }
  if (typeof host == "function") {
    callback = host;
    host = false;
    port = false;
  }
  if (!host) {
    this.log("Server host not specified, so defaulting to", "ipc.config.networkHost", this.config.networkHost);
    host = this.config.networkHost;
  }
  if (typeof port == "function") {
    callback = port;
    port = false;
  }
  if (!port) {
    this.log("Server port not specified, so defaulting to", "ipc.config.networkPort", this.config.networkPort);
    port = this.config.networkPort;
  }
  if (typeof callback == "string") {
    UDPType = callback;
    callback = false;
  }
  if (!callback) {
    callback = emptyCallback;
  }
  if (this.of[id]) {
    if (!this.of[id].socket.destroyed) {
      this.log("Already Connected to", id, "- So executing success without connection");
      callback();
      return;
    }
    this.of[id].socket.destroy();
  }
  this.of[id] = new Client(this.config, this.log);
  this.of[id].id = id;
  this.of[id].socket ? this.of[id].socket.id = id : null;
  this.of[id].path = host;
  this.of[id].port = port;
  this.of[id].connect();
  callback(this);
}

// node-ipc.js
var IPCModule = class extends IPC {
  constructor() {
    super();
    __publicField(this, "IPC", IPC);
  }
};
var singleton = new IPCModule();
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/main.ts");
/******/ 	
/******/ })()
;