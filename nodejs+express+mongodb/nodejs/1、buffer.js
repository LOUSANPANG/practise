// 创建
Buffer.alloc(10);
Buffer.allocUnsafe(10);
Buffer.from([1, 2, 3]);

// buffer转换
const buf1 = Buffer.from([105,108,111,118,101,121,111,117]);
buf1.toString()  // i love you
