export type UnionBasis = NonNullable<unknown> | string | number | boolean

export type Maybe<T> = T | undefined

export type MaybeFunc<T extends UnionBasis = UnionBasis, R = T> = Maybe<((args?: T) => R) | R>

export type MaybeArray<T> = T | T[]

function call(funcs: MaybeArray<() => void>): void
function call<A1>(funcs: MaybeArray<(a1: A1) => void>, a1: A1): void
function call<A1, A2>(funcs: MaybeArray<(a1: A1, a2: A2) => void>, a1: A1, a2: A2): void
function call<A1, A2, A3>(funcs: MaybeArray<(a1: A1, a2: A2, a3: A3) => void>, a1: A1, a2: A2, a3: A3): void
function call<A1, A2, A3, A4>(
  funcs: MaybeArray<(a1: A1, a2: A2, a3: A3, a4: A4) => void>,
  a1: A1,
  a2: A2,
  a3: A3,
  a4: A4,
): void
function call<A extends any[]>(funcs: Function[] | Function, ...args: A): void {
  if (Array.isArray(funcs)) funcs.forEach((func) => (call as any)(func, ...args))
  else return funcs(...args)
}

function maybeFuncCall<T extends UnionBasis, R = T>(func: MaybeFunc<T, R>, args?: T) {
  if (func instanceof Function) return func(args)
  return func
}

function maybePromiseFuncCall<T extends UnionBasis, R = T>(func: ((...args: T[]) => Promise<R>) | T, ...args: T[]) {
  if (func instanceof Function) return func(...args) as Promise<R>
  return Promise.resolve(func as T)
}

export { call, maybeFuncCall, maybePromiseFuncCall }
