import { defaultWindow, isClient } from './configurable'

export function isFileImage(file: File) {
  // 只接受一个参数，这个参数是一个File对象
  return file && file.type.split('/')[0] === 'image'
}

export function isFileVideo(file: File) {
  return file && file.type.split('/')[0] === 'video'
}

export function isFileImageByName(fileName: string) {
  return fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')
}

export function isPdf(file: File) {
  return file && file.type === 'application/pdf'
}

export function isPdfByName(fileName: string) {
  return fileName.endsWith('.pdf')
}

export function isPng(file: File) {
  return file && file.type === 'image/png'
}

export function isJpg(file: File) {
  return file && (file.type === 'image/jpeg' || file.type === 'image/jpg')
}

export function isHeic(file: File) {
  return file && (file.type === 'image/heic' || file.type === 'image/heif')
}

export function isDoc(file: File) {
  return (
    file &&
    (file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.oasis.opendocument.text' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' ||
      file.type === 'application/vnd.ms-word.document.macroEnabled.12' ||
      file.type === 'application/vnd.ms-word.template.macroEnabled.12')
  )
}

export function isExcel(file: File) {
  return (
    file &&
    (file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.oasis.opendocument.spreadsheet' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' ||
      file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12' ||
      file.type === 'application/vnd.ms-excel.template.macroEnabled.12' ||
      file.type === 'application/vnd.ms-excel.addin.macroEnabled.12' ||
      file.type === 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' ||
      // csv
      file.type === 'text/csv' ||
      file.type === 'application/csv')
  )
}

export function isCsv(file: File) {
  return file && (file.type === 'text/csv' || file.type === 'application/csv')
}

export function isZip(file: File) {
  return (
    file &&
    (file.type === 'application/zip' ||
      file.type === 'application/x-zip-compressed' ||
      file.type === 'application/x-7z-compressed' ||
      file.type === 'application/x-rar-compressed' ||
      file.type === 'application/x-tar' ||
      file.type === 'application/x-gzip')
  )
}

export const isWorker =
  typeof WorkerGlobalScope !== 'undefined' && globalThis instanceof WorkerGlobalScope
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const notNullish = <T = any>(val?: T | null | undefined): val is T => val != null
export const assert = (condition: boolean, ...infos: any[]) => {
  if (!condition) console.warn(...infos)
}
const toString = Object.prototype.toString
export const isObject = (val: any): val is object => toString.call(val) === '[object Object]'
export const now = () => Date.now()
export const timestamp = () => +Date.now()
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
export const noop = () => {}
export const rand = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export const hasOwn = <T extends object, K extends keyof T>(val: T, key: K): key is K =>
  Object.prototype.hasOwnProperty.call(val, key)

export const isIOS = /* #__PURE__ */ getIsIOS()

function getIsIOS() {
  return (
    isClient() &&
    defaultWindow()?.navigator?.userAgent &&
    (/iP(ad|hone|od)/.test(defaultWindow()!.navigator?.userAgent) ||
      // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
      // https://github.com/vueuse/vueuse/issues/3577
      (defaultWindow()!.navigator?.maxTouchPoints > 2 &&
        /iPad|Macintosh/.test(defaultWindow()!.navigator?.userAgent)))
  )
}
