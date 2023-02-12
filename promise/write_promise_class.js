// write promise

(function (window) {
    class Promise {
        constructor (excutor) {
            // 防止内部新建函数的this变为window
            const self = this
            self.status = 'padding'
            self.data = undefined
            // 回调队列[{ onResolved() {}, onRejected() {} }]
            self.callbacks = []

            function resolve(value) {
                if (self.status !== 'padding') return
                self.status = 'resolved'
                self.data = value
                if (self.callbacks.length) {
                    // 将回调放到异步队列中执行所有成功回调
                    setTimeout(() => {
                        self.callbacks.forEach(item => {
                            item.onResolved(value)
                        })
                    })
                }
            }

            function reject(reason) {
                if (self.status !== 'padding') return
                self.status = 'rejected'
                self.data = reason
                if (self.callbacks.length) {
                    // 将回调放到异步队列中执行所有失败回调
                    setTimeout(() => {
                        self.callbacks.forEach(item => {
                            item.onRejected(reason)
                        })
                    })
                }
            }

            try {
                excutor(resolve, reject)
            } catch (error) {
                reject(error)
            }
        }
        
        then = function (onResolved, onRejected) {
            // 判断参数类型
            onResolved = 
                typeof onResolved === 'function'
                    ? onResolved
                    : value => value

            onRejected = 
                typeof onRejected === 'function'
                    ? onRejected
                    : reason => { throw reason }
    
            const self = this
            return new Promise((resolve, reject) => {

                // 改变promise状态
                function handle(callback) {
                    try {
                        const result = callback(self.data)
                        // 判断回调函数是否是promise
                        if (result instanceof Promise) {
                            // result.then(resolve, reject)
                            result.then(
                                value => resolve(value),
                                reason => reject(reason)
                            )
                        } else {
                            resolve(result)
                        }
                    } catch (error) {
                        reject(error)
                    }
                }

                if (self.status === 'pedding') {
                    // 保存起来
                    self.callbacks.push({
                        onResolved() {
                            handle(onResolved)
                        },
                        onRejected() {
                            handle(onRejected)
                        }
                    })
                } else if (self.status === 'resolved') {
                    // 异步执行onResolved 并改变return promise状态
                    setTimeout(() => {
                        handle(onResolved)
                    })
                } else if (self.status === 'rejected')  {
                    setTimeout(() => {
                        handle(onRejected)
                    })
                }
            })
        }

        catch (onRejected) {
            return this.then(undefined, onRejected)
        }

        static resolve = function (value) {
            return new Promise((resolve, reject) => {
                if (value instanceof Promise) {
                    value.then(resolve, reject)
                } else {
                    resolve(value)
                }
            })
        } 

        static reject = function (reason) {
            return new Promise((resolve, reject) => reject(reason))
        }

        static all = function (promises) {
            return new Promise((resolve, reject) => {
                const values = new Array(promises.length)
                let resolvedCount = 0

                promises.forEach((p, index) => {
                    // 避免p不是promise，需要再包一层promise
                    Promise.resolve(p).then(
                        value => {
                            resolvedCount++
                            values[index] = value

                            if (resolvedCount === promises.length) {
                                resolve(values)
                            }
                        },
                        reason => reject(reason)
                    )
                })
            })
        }

        static race = function (promises) {
            return new Promise((resolve, reject) => {
                promises.forEach((p, index) => {
                    // 避免p不是promise，需要再包一层promise
                    Promise.resolve(p).then(
                        value => resolve(value),
                        reason => reject(reason)
                    )
                })
            })
        }
    }

})(window)