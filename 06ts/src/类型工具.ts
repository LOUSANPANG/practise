interface C {
  x: number;
  y: number;
}

type Aw = Awaited<Promise<string>> // string

type Cp = ConstructorParameters<new (x: string, y: number) => object> // [string, number]
type Par = Parameters<(x:{ a: number; b: string }) => void> // [x: { a: number, b: string }]
type Ret = ReturnType<(s:string) => void> // void

type Ins = InstanceType<new () => object> // object

type Non = NonNullable<string | number | undefined> // string | number

type Exc = Exclude<'a' | 'b', 'a'> // b
type Ex = Extract<'a' | 'b', 'a'> // a

type Om = Omit<C, 'x'> // { y: number }
type Pi = Pick<C, 'x'> // { x: number }

type Pa = Partial<C> // { x?: number, y?: number }
type Req = Required<C> // { x: number, y: number }
type Rea = Readonly<C> // { readonly x: number, readonly y: number }

type Rec = Record<'a'|'b', number> // { a: number, b: number }

type Str = 'hello'
type Str1 = 'HELLO'
type B = Uppercase<Str> // HELLO
type B1 = Lowercase<Str1> // hello
type B2 = Capitalize<Str> // Hello
type B3 = Uncapitalize<Str1> // hELLO
