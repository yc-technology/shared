import { Fn } from '~/type'
import { useEffect, useRef } from 'react'
type IEventBus = {
  once(type: string | symbol, handler: Fn): any
  on(type: string | symbol, handler: Fn): void
  off(type: string | symbol, handler: Fn): void
  emit(type: string | symbol, ...evt: any): void
}

export function useBaseEventBus(eventBus: IEventBus) {
  const cacheHandler = useRef(new Map<string, (...data: any) => void>())

  const on = (option: { event: string; handler: (...data: any) => void }, dependencies?: any[]) => {
    const { event, handler } = option
    useEffect(() => {
      const oldHandler = cacheHandler.current.get(event)
      const added = !!oldHandler
      if (added) {
        eventBus.off(event, oldHandler)
      }
      cacheHandler.current.set(event, handler)
      eventBus.on(event, handler)
    }, dependencies)
  }

  const off = (event: string) => {
    const oldHandler = cacheHandler.current.get(event)
    if (oldHandler) {
      eventBus.off(event, oldHandler)
    }
  }

  const clear = () => {
    cacheHandler.current.forEach((handler, event) => {
      eventBus.off(event, handler)
    })
    cacheHandler.current.clear()
  }

  useEffect(() => {
    return () => {
      clear()
    }
  }, [])

  const once = eventBus.once

  return {
    on,
    off,
    once
  }
}

/**
 * 全局事件总线
 * @returns
 */
export function useGlobalEventBus(globalEventBus: IEventBus) {
  return useBaseEventBus(globalEventBus)
}
