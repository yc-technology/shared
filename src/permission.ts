import { Deferred } from './deferred'

type DescriptorNamePolyfill =
  | 'accelerometer'
  | 'accessibility-events'
  | 'ambient-light-sensor'
  | 'background-sync'
  | 'camera'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'gyroscope'
  | 'magnetometer'
  | 'microphone'
  | 'notifications'
  | 'payment-handler'
  | 'persistent-storage'
  | 'push'
  | 'speaker'

export type GeneralPermissionDescriptor = PermissionDescriptor | { name: DescriptorNamePolyfill }

export async function queryPermissions(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name']
) {
  const isSupported = navigator && 'permissions' in navigator
  let state: PermissionState
  let permissionStatus: PermissionStatus | undefined
  const desc =
    typeof permissionDesc === 'string'
      ? ({ name: permissionDesc } as PermissionDescriptor)
      : (permissionDesc as PermissionDescriptor)

  const deferred = new Deferred<PermissionState>()

  const onChange = () => {
    if (permissionStatus) {
      state = permissionStatus.state
      deferred.resolve(state)
    }
  }

  const query = createSingletonPromise(async () => {
    if (!isSupported) return
    if (!permissionStatus) {
      try {
        permissionStatus = await navigator!.permissions.query(desc)
        permissionStatus.addEventListener('change', onChange)
        onChange()
      } catch {
        state = 'prompt'
        deferred.resolve(state)
      }
    }
    return permissionStatus
  })

  query()

  return deferred.promise
}

export interface SingletonPromiseReturn<T> {
  (): Promise<T>
  /**
   * Reset current staled promise.
   * await it to have proper shutdown.
   */
  reset: () => Promise<void>
}

export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
  let _promise: Promise<T> | undefined

  function wrapper() {
    if (!_promise) _promise = fn()
    return _promise
  }
  wrapper.reset = async () => {
    const _prev = _promise
    _promise = undefined
    if (_prev) await _prev
  }

  return wrapper
}
