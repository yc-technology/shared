/**
 * @author django
 * @description 获取url参数
 * @returns
 */
export function formatQueryParams() {
  const queryParams = new URLSearchParams(location.search)
  return queryParams
}

export const stopPropagation = (event: Event) => event.stopPropagation()

export function preventDefault(event: Event, isStopPropagation?: boolean) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) event.preventDefault()

  if (isStopPropagation) stopPropagation(event)
}
