// 常量 (程序运行过程中 不能再次改变的值)
    // 1固定不变的值
    // 2特殊的常量
        // "abc" --- String 一个引用数据类型，它的值很特殊 可以简单的视为常量
    // 3自己创建的空间 存储一个值 让它固定起来 不可改变
        // final int UP = 1;

// 变量（程序执行过程中可以改变的）
    // 变量是一个内存空间（小容器）
    // 变量空间在创建（声明）的时候 必须指定数据类型 变量空间的名字
    // 变量空间 里面只能存储一个内容（值 引用）
    // 变量空间内的内容可以改变
    // 变量是一个空间 可以只创建空间 里边不存放内容；创建后是没有默认的内容 空的；
    // int a; String b; 
    // byte x; x = 1; byte x = 1;

public class Test {
    public static void main(String[] args) {
        byte x = 1;
        short y = 2;
        int z = 3;
        long a = 2147483648L;
        float b = 1.1F;
        double c = 1.2;
        char d = 'd'; // 字符 单引号 有且只有一个
        boolean e = true;

        String f = "abc"; // 字符串 双引号
        String g = null;
        /*
            命名创建变量后计算机做了哪些事情：
            1硬盘上创建了一个文件 Test.java
            2文件中的内容是我们编写的源代码 pubulic class Test {}
            3JVM将Test.java源文件 --- 编译 ---- 字节码文件Test.class
            4执行 --- 内容中执行
            5先将硬盘上的Test.class内容 加载 到内存里。
            6根据我们写好的指令 执行内容的空间 赋值 变化。。。
        */
        /*
            从栈内存开辟了内存空间存入x
            从常量缓冲区放入1
            将1复制给x
        */
    }
}