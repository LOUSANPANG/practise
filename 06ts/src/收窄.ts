// typeof instanceof in 来做类型收窄
type Foo = {
  name: string
}
type Bar = {
  age: number
}
const foo = (a: Foo | Bar) => {
  if ('name' in a) {
    console.log(a.name)
  }
  if (a instanceof Object) {
  }
  if (typeof a === 'string') {
  }
}

// is
function isString(a: unknown): a is string {
  return typeof a === 'string'
}

// 可辨别联合 kind
// kind 只能是简单类型
type A = { kind: 'string', value: string }
type B = { kind: 'number', value: number }
const f1 = (a: A | B) => {
  if (a.kind === 'string') {
    console.log(a.value)
  }
}

// 断言 as