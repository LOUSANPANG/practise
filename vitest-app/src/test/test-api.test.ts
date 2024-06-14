import {
  test,
  expect,
  assert,
  describe
} from 'vitest'
import { sum } from '@/utils/test-api'


// ================================================test
// 封装自己的test
export const myTest = test.extend({
  sum: async () => {}
})

// toBe期望
test('sum', () => {
  expect(sum(1,2)).toBe(3)
})

// assert.equal期望
test('sum', () => {
  assert.equal(sum(1,2), 3)
})

// test.skipIf 跳过
const isDev = process.env.NODE_ENV === 'development'
test.skipIf(isDev)('prod only test', () => {})

// test.runIf 仅运行
const isProd = process.env.NODE_ENV === 'production'
test.skipIf(isProd)('dev only test', () => {})

// 标记并行运行的连续测试
describe('并行套装测试', () => {
  test.concurrent('concurrent test 1', () => {})
  test.concurrent('concurrent test 2', () => {})
})

// 按顺序运行测试
describe.concurrent('顺序套装测试', () => {
  test('test1', async () => {})
  test.sequential('sequential test 1', async () => {})
  test.sequential('sequential test 2', async () => {})
})

// 存根测试
test.todo('todo test 1')

// 明确表示断言将失败
// test.fails('fail test 1', async () => {
//   await expect(Promise.reject(1)).rejects.toBe(1)
// })
test('test expect resolves', async () => {
  await expect(Promise.resolve(1)).resolves.toBe(1)
})

// 变量测试
test.each([ [1,1,2], [2,2,4] ])('each test', (a, b, expected) => {
  expect(a + b).toBe(expected)
})




// ================================================describe
