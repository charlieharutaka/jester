interface ReduxActionWithPayload<T extends string, P> {
  type: T
  payload: P
}

interface ReduxActionWithoutPayload<T extends string> {
  type: T
}

export type ReduxAction<T extends string, P = undefined> = P extends undefined
  ? ReduxActionWithoutPayload<T>
  : ReduxActionWithPayload<T, P>
