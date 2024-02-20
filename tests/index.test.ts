import { describe, it, expect } from 'vitest'
import { division, plus } from '~/math'

describe('简单测试', () => {
  it('测试sum', () => {
    expect(plus(1, 2)).toBe(3)
  })
  it('看看helloworld', () => {
    expect(division(0, 100)).toBe(0)
  })
})
