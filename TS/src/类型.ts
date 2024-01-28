// 基本类型 8 + 7
type u = undefined
type n1 = null
type s = string
type n = number
type b = boolean
type s1 = symbol
type b1 = bigint

type o = object // Array Date RegExp Function Error

type a = any
type v = void
type n2 = never
type u1 = unknown
type emu = enum
// type interface


// ==================== 使用
// 以下两种写法表达一致
type A1 = {
  [k: string]: number
}
type A2 = Record<string, number>


// 数组
type arr1 = Array<string>
type arr2 = string[]
type arr3 = [string, number, boolean]


// 函数对象
type fn1 = () => void
type fn2 = (a: string, b: string) => string

type fnWithThis= (this: Person, name: string) => string
type Person = {
  name: string,
  sayHi: fnWithThis
}

const p: Person = {
  name: 'p',
  sayHi: function() {
    return this.name
  }
}

p.sayHi('LGH')


// 对象
type d = Date
type re = RegExp


// never unknown
type unk = unknown;
const unkk: unk = 1;
(unkk as number).toFixed();

// never 只用来判断


// enum 枚举
enum Enu {
  a = 0,
  b,
  c
}


// type 都可描述 不可改变
// interface 只能描述对象 可覆盖合并
type FnWithFn = {
  (): void
}

interface FnWithFn1 extends Array<string> {
  (): void
}