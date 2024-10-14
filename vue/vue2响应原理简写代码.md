## vue2 响应原理简单代码

```js
function observe(obj) {
  for (const key in obj) {
    let internalValue = obj[key]
    let funcs = new Set()
    Object.defineProperty(obj, key, {
      get() {
        if (window.__func) {
          funcs.push(window.__func)
        }
        return internalValue
      },

      set() {
        internalValue = val
        for (let i = 0; i < funcs.length; i++) {
          funcs[i]()
        }
      }
    })
  }
}

function autorun(fn) {
  window.__func = fn
  fn()
  window.__func = null
}

// 使用
let user = {
  name: 'L H'
}
function showFirstName() {}
function showLastName() {}

observe(user) // 观察它
autorun(showFirstName) // 收集 - 执行
autorun(showLastName) // 收集 - 执行
user.name = 'H L' // 测试
```
