let a: string = 's'

let b = null
let c = undefined

let o: Object // Object === {}
let o1: {}
o = 's'
o1 = 1
let o2: object
o2 = {name: 's'}

// 数组
const arr: readonly number[] = [0, 1]
const arr1: ReadonlyArray<number> = [0, 1]
const arr2: Readonly<number[]> = [0, 1]

// 元组
const y: [number, number?] = [1,2]
type y1 = Array<[number]>

const sy: unique symbol = Symbol()

let foo: (text: string) => void = function (text: string) {}
let add: { (x: number): void }
add = function (x: number) {}

class Animal {}
type AnimalConstructor = new () => Animal

type MyObj = {
  x: number;
  y: string;
}

class classA {
  x!: number;
  y: string = 's';
}
// 属性索引
class classB {
  [s: string]: boolean | (() => boolean); // 必须包括下边函数的类型
  f () {
    return false
  }
}
// implements
interface MotorVehicle {}
interface Flyable {}
interface Swimmable {}
interface SuperCar extends MotorVehicle,Flyable, Swimmable {}
class SecretCar implements SuperCar {}
class A {
  #name: string = 'x'
}
class MyClass {
  private static x: string = 'x'
  static #c: string = 'c'
}
// 抽象类
abstract class AA {
  abstract foo:string;
  bar:string = '';
}
class BB extends AA {
  foo = 'b'; // 父类声明抽象变量，子类必须声明
}

// 范型
function fistA<T>(arr: T[]): T {
  return arr[0]
}
fistA<number>([1,2])

interface Fn {
  <T>(t: T): T
}
let fn1: Fn = function <T>(t: T): T {
  return t
}
let arr11: ReadonlyArray<number> = [1,2]

// 枚举
enum Color {
  Red,
  Green
}
Color.Red
let co:Color = Color.Green
function getColor(c: Color) {
  return c
}
getColor(1)

enum e1 {
  A
}
enum e1 {
  B = 1
}

// 断言
const num11 = [1,2] // 被认为 number[]
const num22 = [2,3] as const // 被认为 [2,3]
// ...num11 可能被认为有无数个 number
// ..num22 被认为有两个值 2和3
class Cla0 {
  x!: number // 非空断言
  constructor(x: number) {}
}

function isString(
  value:unknown
):value is string {
  return typeof value === 'string';
}

// 模块
export type bool = true | false
type str = string
export { type str }

class Name {
  n: string = 's'
}
export type { Name }

// import= === require
// export= === module.exports


// 命名空间
namespace A {
  export class B {}
  function C() {}
}
A.B

// 装饰器
function simpleDecorator(
  value:any,
  context:any
) {
  console.log(`hi, this is ${context.kind} ${context.name}`);
  return value;
}
@simpleDecorator
class Z {}

