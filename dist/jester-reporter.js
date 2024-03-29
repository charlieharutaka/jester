/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/renderer/redux/actions/ResultActions.ts":
/*!*****************************************************!*\
  !*** ./src/renderer/redux/actions/ResultActions.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearResult = exports.updateResult = exports.setResult = void 0;
var ResultTypes_1 = __webpack_require__(/*! ../types/ResultTypes */ "./src/renderer/redux/types/ResultTypes.ts");
function setResult(project, aggregatedResult) {
    return {
        type: ResultTypes_1.SET_RESULT,
        payload: {
            project: project,
            aggregatedResult: aggregatedResult,
        },
    };
}
exports.setResult = setResult;
function updateResult(project, test, result) {
    return {
        type: ResultTypes_1.UPDATE_RESULT,
        payload: {
            project: project,
            test: test,
            result: result,
        },
    };
}
exports.updateResult = updateResult;
function clearResult(project) {
    return {
        type: ResultTypes_1.CLEAR_RESULT,
        payload: {
            project: project,
        },
    };
}
exports.clearResult = clearResult;


/***/ }),

/***/ "./src/renderer/redux/types/ResultTypes.ts":
/*!*************************************************!*\
  !*** ./src/renderer/redux/types/ResultTypes.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CLEAR_RESULT = exports.UPDATE_RESULT = exports.SET_RESULT = void 0;
exports.SET_RESULT = 'SET_RESULT';
exports.UPDATE_RESULT = 'UPDATE_RESULT';
exports.CLEAR_RESULT = 'CLEAR_RESULT';


/***/ }),

/***/ "./src/reporter/Dispatch.ts":
/*!**********************************!*\
  !*** ./src/reporter/Dispatch.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var node_ipc_1 = __importDefault(__webpack_require__(/*! node-ipc */ "./node_modules/node-ipc/node-ipc.cjs"));
var Macros_1 = __webpack_require__(/*! ../common/Macros */ "./src/common/Macros.ts");
node_ipc_1.default.config.id = Macros_1.SOCKET_ID;
node_ipc_1.default.config.networkPort = Macros_1.SOCKET_PORT;
node_ipc_1.default.config.maxRetries = 0;
node_ipc_1.default.config.silent = true;
exports["default"] = (function (action) {
    node_ipc_1.default.connectToNet(Macros_1.SOCKET_ID, function () {
        console.log('Attempting to connect to Jester Frontend...');
        node_ipc_1.default.of[Macros_1.SOCKET_ID].on('connect', function () {
            console.log('connected');
            node_ipc_1.default.of[Macros_1.SOCKET_ID].emit('message', action);
            node_ipc_1.default.disconnect(Macros_1.SOCKET_ID);
        });
        node_ipc_1.default.of[Macros_1.SOCKET_ID].on('error', function () {
            console.error('Could not connect! Are you running the Jester Frontend?');
        });
    });
});


/***/ }),

/***/ "./src/reporter/JesterReporter.ts":
/*!****************************************!*\
  !*** ./src/reporter/JesterReporter.ts ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ResultActions_1 = __webpack_require__(/*! ../renderer/redux/actions/ResultActions */ "./src/renderer/redux/actions/ResultActions.ts");
var Dispatch_1 = __importDefault(__webpack_require__(/*! ./Dispatch */ "./src/reporter/Dispatch.ts"));
var JesterReporter = /** @class */ (function () {
    function JesterReporter(globalConfig, options) {
        this.globalConfig = globalConfig;
        this.options = options;
    }
    JesterReporter.prototype.onTestResult = function (test, testResult, aggregatedResult) {
        console.log("Test ".concat(test.path, " completed, ").concat(testResult.numFailingTests === 0 ? 'passed' : 'failed'));
    };
    JesterReporter.prototype.onRunStart = function (results, options) {
        console.log('Run Started');
    };
    JesterReporter.prototype.onTestStart = function (test) {
        console.log("Test ".concat(test.path, " started"));
    };
    JesterReporter.prototype.onRunComplete = function (contexts, results) {
        console.log('Run Complete');
        (0, Dispatch_1.default)((0, ResultActions_1.setResult)(this.globalConfig.rootDir, results));
    };
    JesterReporter.prototype.getLastError = function () { };
    return JesterReporter;
}());
module.exports = JesterReporter;


/***/ }),

/***/ "dgram":
/*!************************!*\
  !*** external "dgram" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("dgram");

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

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/reporter/JesterReporter.ts");
/******/ 	module.exports.reporter = __webpack_exports__;
/******/ 	
/******/ })()
;