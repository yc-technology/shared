import { queryPermissions } from './permission'

type CopyOptions = {
  legacy?: boolean
}

export async function copy(value: string, { legacy = false }: CopyOptions = {}) {
  const isClipboardApiSupported = navigator && 'clipboard' in navigator
  const isSupported = isClipboardApiSupported || legacy
  const permissionRead = await queryPermissions('clipboard-read')
  const permissionWrite = await queryPermissions('clipboard-write')
  let text: string | undefined
  let copied: boolean | undefined
  if (isSupported && value != null) {
    if (isClipboardApiSupported && permissionWrite !== 'denied')
      await navigator!.clipboard.writeText(value)
    else legacyCopy(value)

    text = value
    copied = true
  }

  return { text, copied }
}

function legacyCopy(value: string) {
  const ta = document.createElement('textarea')
  ta.value = value ?? ''
  ta.style.position = 'absolute'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  ta.remove()
}

function legacyRead() {
  return document?.getSelection?.()?.toString() ?? ''
}
