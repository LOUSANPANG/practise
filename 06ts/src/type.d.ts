/// <reference path="./基本语法.ts" />
/// <reference lib="es2017.string" />
// /// <reference types="" />


export const a: number

declare module 'test' {
  function test(): void
  export = test
}

// 找不到类型声明文件，需要自己写
declare var $:any
// 或者是
declare module 'xxx'
