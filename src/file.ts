import CryptoJs from 'crypto-js'
import { Deferred } from './deferred'

export enum ByteSymbolName {
  B = 'Bytes',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
  PB = 'PB',
  EB = 'EB',
  ZB = 'ZB',
  YB = 'YB'
}

export interface LocalFileInfo {
  digest: string
  fileSize: number
  fileName: string
  fileType: string
  file: File
}

export function downloadByBlob(blob: Blob, filename: string) {
  // @ts-expect-error: ignore
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // @ts-expect-error: ignore
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') tempLink.setAttribute('target', '_blank')

    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}

/**
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })
  downloadByBlob(blob, filename)
}

export async function downloadByUrl(url: string, fetchApi: (url: string) => Promise<Blob>) {
  const res = await fetchApi(url)
  downloadByBlob(res, url.split('/').pop()!)
}

export async function compressImage(
  file: File,
  options?: { download?: boolean; maxSize?: number; quality?: number }
): Promise<File>
export async function compressImage(
  file: File,
  options?: { download?: boolean; maxSize?: number; quality?: number },
  base64?: boolean
): Promise<string>
/**
 * 压缩图片
 * @param file
 */
export async function compressImage(
  file: File,
  options: { download?: boolean; maxSize?: number; quality?: number } = {},
  base64?: boolean
): Promise<File | string> {
  const reader = new FileReader()
  const img = new Image()

  reader.readAsDataURL(file)

  // 缩放图片需要的canvas
  const canvas = document.createElement('canvas')
  const canvasContext = canvas.getContext('2d')

  return new Promise((resolve, reject) => {
    img.onload = function () {
      // @ts-expect-error: ignore
      const originWidth = this.width
      // @ts-expect-error: ignore
      const originHeight = this.height

      // 最大尺寸限制
      let maxWidth, maxHeight
      if (originHeight > originWidth) maxWidth = options.maxSize || 800
      else maxHeight = options.maxSize || 800

      let targetWidth = originWidth
      let targetHeight = originHeight

      if ((maxWidth && originWidth > maxWidth) || (maxHeight && originHeight > maxHeight)) {
        // 限宽
        if (maxWidth) {
          targetWidth = maxWidth
          targetHeight = Math.round(maxWidth * (originHeight / originWidth))
        } else {
          targetHeight = maxHeight
          // @ts-expect-error: ignore
          targetWidth = Math.round(maxHeight * (originWidth / originHeight))
        }
      }

      // canvas对图片进行缩放
      canvas.width = targetWidth
      canvas.height = targetHeight
      // 清除画布
      canvasContext?.clearRect(0, 0, targetWidth, targetHeight)
      // 图片压缩
      canvasContext?.drawImage(img, 0, 0, targetWidth, targetHeight)
      canvas.toBlob(
        (blob: Blob | null) => {
          if (options.download) downloadByData(blob as Blob, file.name, file.type)
          const oFileReader = new FileReader()

          if (base64) {
            oFileReader.onloadend = (e: any) => {
              const res = e.target.result
              resolve(res)
            }

            oFileReader.onerror = (e) => {
              reject(e)
            }

            if (blob) oFileReader.readAsDataURL(blob)
          } else {
            const f = new File([blob as Blob], file.name, { type: file.type })
            resolve(f)
          }
        },
        file.type || 'image/png',
        options.quality || 0.8
      )
    }

    // 获取图片原始尺寸
    reader.onload = function (e) {
      img.src = e.target?.result as string
    }
  })
}

/**
 * 用于计算文件的hash值，包括sha256值和md5值
 */
export async function calculateFile(file: any, sha256 = true) {
  // 抽样 准确性有可能会不准
  function sample(file: File) {
    const offset = 2 * 1024 * 1024
    const chunks = [file.slice(0, offset)]
    let cur = offset
    const size = file.size
    while (cur < size) {
      if (cur + offset >= size) {
        chunks.push(file.slice(cur, cur + offset))
      } else {
        const mid = cur + offset / 2
        const end = cur + offset
        chunks.push(file.slice(cur, cur + 2))
        chunks.push(file.slice(mid, mid + 2))
        chunks.push(file.slice(end - 2, end))
      }
      cur += offset
    }
    return chunks
  }

  /**
   * 使用指定的算法计算hash值
   */
  async function hashFileInternal(file: File, alog: any) {
    let promise = Promise.resolve()
    // 使用promise来串联hash计算的顺序。因为FileReader是在事件中处理文件内容的，必须要通过某种机制来保证update的顺序是文件正确的顺序
    // for (let index = 0; index < file.size; index += chunkSize) {
    // }
    const chunks = sample(file)
    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index]
      promise = promise.then(() => hashBlob(chunk))
    }

    /**
     * 更新文件块的hash值
     */
    function hashBlob(blob: Blob): Promise<void> {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = ({ target }) => {
          // @ts-expect-error: ignore
          const wordArray = CryptoJs.lib.WordArray.create(target.result)
          // 增量更新计算结果
          alog.update(wordArray)
          resolve()
        }
        reader.readAsArrayBuffer(blob)
      })
    }

    // 使用promise返回最终的计算结果
    await promise
    return CryptoJs.enc.Hex.stringify(alog.finalize())
  }

  if (sha256) return await hashFileInternal(file, CryptoJs.algo.SHA256.create())

  return await hashFileInternal(file, CryptoJs.algo.MD5.create())
}

/**
 * 获取图片长高
 * @param data
 * @returns
 */
export async function getImgInfo(data: string | File | Blob) {
  const image = new Image()
  const url = typeof data === 'string' ? data : URL.createObjectURL(data)
  image.src = url
  return new Promise<{
    width: number
    height: number
    url: string
    image: HTMLImageElement
    error?: any
  }>((resolve) => {
    image.onload = () => {
      if (image.width > 0 || image.height > 0)
        resolve({ width: image.width, height: image.height, url, image })

      resolve({ width: image.width, height: image.height, url, image })
    }
    image.onerror = (error) => {
      resolve({ width: 0, height: 0, url, image, error })
    }
  })
}

export async function getMediaInfo(data: string | File) {
  // const audio = new Audio(typeof data === 'string' ? data : URL.createObjectURL(data));

  return new Promise<number>((resolve) => {
    const audio = document.createElement('audio') // 生成一个audio元素
    audio.src = typeof data === 'string' ? data : URL.createObjectURL(data)
    audio.addEventListener('canplay', () => {
      resolve(audio.duration)
    })
  })
}

export function fileToArrayBuffer(file: File) {
  return new Promise<string | ArrayBuffer | null | undefined>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = function onerror(ev) {
      reject(ev.target?.error)
    }

    reader.onload = function onload(ev) {
      resolve(ev.target?.result)
    }

    reader.readAsArrayBuffer(file)
  })
}

export async function getFileInfo(file: File, prefix?: string): Promise<LocalFileInfo> {
  // 摘要
  let digest = await calculateFile(file)
  const fileName = file.name
  const fileType = file.type
  const fileSize = file.size

  digest = prefix ? `${prefix}_${digest}` : digest

  return { digest, fileSize, fileName, fileType, file }
}

export function formatBytes(bytes: number, unit?: ByteSymbolName, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  let i = Math.floor(Math.log(bytes) / Math.log(k))

  if (unit) i = units.indexOf(unit)

  if (i === -1) return 'Unknown unit'

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${units[i]}`
}

// 将base64转换为blob
export function dataURLtoBlob(dataUrl: string) {
  const arr = dataUrl.split(',')
  const mime = arr[0]!.match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)

  return new Blob([u8arr], { type: mime })
}

// 将blob转换为file
export function blobToFile(theBlob: Blob, fileName: string, mimeType?: string) {
  const file = new File([theBlob], fileName, {
    type: mimeType
  })

  return file
}

export function dataURLtoFile(dataUrl: string, filename: string) {
  const arr = dataUrl.split(',')
  const mime = arr[0]!.match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) u8arr[n] = bstr.charCodeAt(n)

  return new File([u8arr], filename, { type: mime })
}

export function scanFiles(entry: any, filesList: any[]) {
  return new Promise((resolve, reject) => {
    if (entry.isDirectory) {
      const directoryReader = entry.createReader()
      const promiseList: Promise<any>[] = []
      const deferred = new Deferred()
      directoryReader.readEntries(
        async (entries: any[]) => {
          entries.forEach(async (entry: any, index: number) => {
            // 将每次遍历的 promise 放入数组
            const p = scanFiles(entry, filesList)
            promiseList.push(p)
            if (entries.length - 1 === index) deferred.resolve('')
          })

          // 如果目录为空，直接resolve
          if (entries.length === 0) deferred.resolve('')
        },
        (e: any) => {
          reject(e)
        }
      )
      // 等待本次循环文件夹扫描完毕
      deferred.promise.then(() => {
        // 等待所有递归的promise执行完毕
        Promise.all(promiseList).then(() => {
          resolve(true)
        })
      })
    } else {
      entry.file(
        async (file: any) => {
          const path = entry.fullPath.substring(1)
          /** 修改webkitRelativePath 是核心操作，原因是拖拽会的事件体中webkitRelativePath是空的，而且webkitRelativePath 是只读属性，普通赋值是不行的。所以目前只能使用这种方法将entry.fullPath 赋值给webkitRelativePath */
          const newFile = Object.defineProperty(file, 'webkitRelativePath', {
            value: path
          })
          filesList.push(newFile)
          resolve(true)
        },
        (e: any) => {
          reject(e)
        }
      )
    }
  })
}

/**
 * 计算是定宽还是定高，并返回新的长宽
 * @param originHeight
 * @param originWidth
 * @param options
 * @returns
 */
export function fitShapeWidthHeight(
  originWidth: number,
  originHeight: number,
  options: { maxHeight: number; maxWidth: number }
) {
  const { maxHeight, maxWidth } = options

  let width = originWidth
  let height = originHeight

  if (originWidth > maxWidth) {
    // 限宽
    width = maxWidth
    height = Math.round(maxWidth * (originHeight / originWidth))
  } else if (originHeight > maxHeight) {
    // 限高
    height = maxHeight
    width = Math.round(maxHeight * (originWidth / originHeight))
  }

  return { width, height }
}

export function textToFile(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain' })
  const file = new File([blob], filename)
  return file
}

export async function compressImageTo2M(
  file: File,
  options: { download?: boolean; maxSize?: number; quality?: number } = {
    maxSize: 1400,
    quality: 0.8
  }
) {
  const res = await compressImage(file, options)
  if (res.size > 1024 * 1024 * 4)
    return compressImageTo2M(res, { ...options, maxSize: options.maxSize! * 0.8 })
  else return res
}
