import BigNumber from 'bignumber.js'

export function bignumber(v?: number | string | null | BigNumber) {
  return BigNumber(v || 0)
}

export function plus(...args: Array<number | string | BigNumber | undefined | null>) {
  return args.reduce(
    (sum, current) => (sum as BigNumber).plus(new BigNumber(current || 0)),
    new BigNumber(0)
  ) as BigNumber
}

export function minus(...args: Array<number | string | BigNumber | undefined | null>) {
  return args.reduce(
    (sum, current) => (sum as BigNumber).minus(new BigNumber(current || 0)),
    new BigNumber(0)
  ) as BigNumber
}

export function division(...args: Array<number | string | BigNumber | undefined | null>) {
  return args.reduce(
    (sum, current) => (sum as BigNumber).div(new BigNumber(current || 0)),
    new BigNumber(0)
  ) as BigNumber
}

export function multiplied(...args: Array<number | string | BigNumber | undefined | null>) {
  return args.reduce(
    (sum, current) => (sum as BigNumber).times(new BigNumber(current || 0)),
    new BigNumber(0)
  ) as BigNumber
}

export function fixed(a: number | string, decimalPlaces = 0) {
  const _a = new BigNumber(a || 0)
  _a.toFixed(decimalPlaces)
}

type ParseNumber = number | null | undefined

export function parseNumber<T extends ParseNumber = number>(
  label?: string | number | null,
  defaultValue?: T
) {
  if (!defaultValue) defaultValue = 0 as T
  return isNaN(Number(label)) ? defaultValue : bignumber(label!).toNumber()
}

export function toFixed(label?: string | number | null, decimalPlaces = 0) {
  return bignumber(label).toFixed(decimalPlaces)
}

/**
 * 计算字典数组中的和同 key 的值
 * @param dicts
 * @returns
 */
export function plusDicts(dicts: Record<string, number>[]) {
  const result = new Map()
  for (const dict of dicts) {
    for (const [key, value] of Object.entries(dict)) {
      if (result.has(key)) result.set(key, plus(result.get(key), value))
      else result.set(key, value)
    }
  }
  return result
}

/**
 * 计算数字的平均值，返回最高位整数
 * 例如： 123456789 => 100000000 123456 => 100000 123 => 100
 * @param n
 * @param split
 * @returns
 */
export function averageInteger(n?: number | string | BigNumber, split = 2, decimalPlaces = 1) {
  if (!n) return 0
  const average = division(n, split).abs()

  if (average.toNumber() < 1) {
    return bignumber(average.toFixed(decimalPlaces)).toNumber()
  }
  const splitNumbers = average.toFixed(0).split('')
  const newNumber = splitNumbers
    .map((e, i) => {
      if (i === 0) {
        if (splitNumbers.length > 1) {
          if (bignumber(splitNumbers[i + 1]).toNumber() >= 1) return plus(e, 1).toString()
        }
        return e
      }
      return '0'
    })
    .join('')

  return bignumber(newNumber).toNumber()
}
