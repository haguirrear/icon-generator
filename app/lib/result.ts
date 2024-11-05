

export type Result<T, E> = {
  type: "error",
  error: E
} | {
  type: "success"
  result: T
}

export function hasError<T, E>(r: Result<T, E>): r is { type: "error", error: E } {
  return r.type === "error"
}

export function error<E>(e: E): { type: "error", error: E } {
  return {
    type: "error",
    error: e
  }
}


export function success<T>(r: T): { type: "success", result: T } {
  return {
    type: "success",
    result: r
  }
}
