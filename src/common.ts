export function nextTick(callback?: any) {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      callback?.()
      resolve()
    })
  })
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function findDeep<T extends Record<string, any>>(
  arr: T[],
  predicate: (item: T) => boolean,
  childrenKey?: string
): T | undefined {
  for (const item of arr) {
    if (predicate(item)) {
      return item
    }

    let children: T[] = []

    if (Array.isArray(item)) {
      children = item
    }

    if (childrenKey) {
      children = item[childrenKey] as T[]
    }

    if (Array.isArray(children)) {
      const result = findDeep(children, predicate)
      if (result) {
        return result
      }
    }
  }
}

export function assign<T extends object, U>(target: T, source: U): T & U {
  return Object.assign(target, source)
}

export function deepReduce<T extends Record<string, any>, U>(
  arr: T[],
  reducer: (acc: U, item: T) => U,
  initialValue: U,
  childrenKey?: string
): U {
  return arr.reduce((acc, item) => {
    const children = childrenKey ? item[childrenKey] : item
    const result = reducer(acc, item)

    if (Array.isArray(children)) {
      return deepReduce(children, reducer, result, childrenKey)
    }

    return result
  }, initialValue)
}
