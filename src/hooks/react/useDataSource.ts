import { useEffect, useState } from 'react'

type UseDataSourceOptions<T = any> = {
  defaultValue?: T
  immediate?: boolean
  initFn?: () => Promise<T> | T
}
export function useDataSource<T = any>({
  defaultValue,
  immediate = true,
  initFn
}: UseDataSourceOptions<T> = {}) {
  const [dataSource, setDataSource] = useState<T>(defaultValue as T)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await initFn?.()
      setDataSource(res as T)
    } catch (error) {
      setError(true)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchData()
  }

  useEffect(() => {
    if (immediate) fetchData()
  }, [])

  return {
    error,
    loading,
    refresh,
    dataSource,
    setDataSource
  }
}
