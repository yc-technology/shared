export class Deferred<T = any> {
  promise: Promise<T>
  status: 'pending' | 'resolved' | 'rejected' = 'pending'
  resolve!: (value?: T | PromiseLike<T>) => void

  reject!: (reason?: any) => void

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = (args) => {
        this.status = 'resolved'
        resolve(args as T)
      }
      this.reject = (args) => {
        this.status = 'rejected'
        reject(args)
      }
    })
  }
}
