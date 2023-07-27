// const p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         if (Date.now % 2 == 0) {
//             resolve('success')
//         } else {
//             reject('fail')
//         }
//     }, 1000)
// })

// one
// p.then(
//     res => console.log(res),
//     err => console.log(err)
// )

// two
// p.then(res => console.log(res))
// p.catch(err => console.log(err))





// const p1 = Promise.reject('err1')
// const p2 = Promise.reject('err2')
// const p3 = Promise.resolve('success1')

// 返回正确的 promise 数组
// Promise.all([p1, p2])
//     .then(res => console.log(1111, res))
//     .catch(err => console.log(2222, err)) // err1

// 返回最先结束的promise
// Promise.race([p1, p2])
//     .then(res => console.log(1111, res)) // err1
//     .catch(err => console.log(2222, err))





// new Promise((resolve, reject) => {
//     reject(1)
// })
//     .then(res => {
//         console.log('success1', res)
//     })
//     .catch(err => {
//         console.log('fail1', err) // 1
//     })
//         .then(res => {
//             console.log('success2', res) // undefined
//         })
//         .catch(err => {
//             console.log('fail2', err)
//         })





