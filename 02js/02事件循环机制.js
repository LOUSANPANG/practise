/**
 * js 是一门单线程语言，它运行在浏览器的渲染主线程中，而浏览器主线程只有一个。
 * 而主线程承担着诸多的工作，渲染页面、执行js等都在其中。
 * 如果使用同步，极有可能导致主线程产生堵塞，从而导致消息队列中的其他任务无法得到执行。这样的话一方面导致繁忙的主线程白白的浪费时间，另一方面导致页面无法及时更新，给用户一种页面卡死的现象。
 * 所以浏览器采用异步的方式来避免，具体做法是当某些任务发生时，比如计时器、网络、事件监听。主线程交给其他线程来处理，自身立即结束任务的执行，转而执行后续的代码。当其他线程完成时，将事先传递的回调函数包装成任务，加入到消息队列的末尾排队，等待主线程调度执行。
 * 这种异步模式下，浏览器用不阻塞，从而最大限度的保证了单线程的流畅运行。
 * 
 * 渲染主线程 -> 微队列(promise) -> 交互队列(事件点击、浏览器滚动) -> 延时队列(定时器)
 * 
 * 
 * 时间循环又叫消息循环，是浏览器渲染主线程的工作方式。
 * 在 Chrome 的源码中，它开启一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其他线程只需要在合适的时候将任务加入到队列末尾即可。
 * 过去把消息队列简单分为宏队列和微队列，这种说法目前已无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式。
 * 根据 W3C 官方的解释，每个任务有不同的类型，同类型的任务必须在同一个队列，不同的任务可以属于不同的队列。不同人物队列有不同的优先级，再一次时间循环中，由浏览器自行决定取那一个队列的任务。
 * 但浏览器必须有一个微队列，微队列的任务一定具有最高的优先级，必须优先调度执行。
 * 
 * 
 * js 中的计时器能做到精确计时吗？为什么？
 * 1. 计算机硬件没有原子钟，无法做到精确计时
 * 2. 操作系统的计时函数本身就有少量偏差，由于 js 的计时器最终调用的是操作系统的函数，也就携带了这些偏差
 * 3. 按照 W3C 的标准，浏览器实现计时器时，如果嵌套层级超过 5 层，并且有延时小于 4ms，那么延时会被设置为 4ms。
 * 4. 受事件循环的影响，计时器的回调函数只能在主线程空闲时运行，因此又带来了偏差。
*/
