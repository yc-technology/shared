import { Fn } from './type'

export class EventBus {
  private cache: Map<string | symbol, Array<(...data: any) => void>>

  constructor(all = []) {
    this.cache = new Map(all)
  }

  once(type: string | symbol, handler: Fn) {
    const decor = (...args: any[]) => {
      handler && handler.apply(this.cache, args)
      this.off(type, decor)
    }

    this.on(type, decor)
    return this
  }

  on(type: string | symbol, handler: Fn) {
    const handlers = this.cache?.get(type)
    const added = handlers && handlers.push(handler)
    if (!added) this.cache.set(type, [handler])
  }

  off(type: string | symbol, handler: Fn) {
    const handlers = this.cache.get(type)
    if (handlers) handlers.splice(handlers.indexOf(handler) >>> 0, 1)
  }

  emit(type: string | symbol, ...evt: any) {
    for (const handler of (this.cache.get(type) || []).slice()) handler(...evt)

    for (const handler of (this.cache.get('*') || []).slice()) handler(type, ...evt)
  }

  clear() {
    this.cache.clear()
  }
}

// 全局事件总线单例
export const globalEventBus = new EventBus()
