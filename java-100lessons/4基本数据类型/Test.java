// 基本数据8个
    // 整型 4
        // byte 字节型 -- 8个bit 敏感单元位 
            // 1byte === 8bit 00000000 256种组合
            // 用第一个bit位置记录符号 0正数 1负数
            // 数值范围 -2的7次方 ～ 2的7次方-1 （-128 ～ 127）
        // short
            // 2字节 === 16bit 65526种
            // -32768 ～ 32767
        // int 
            // 4字节 === 32bit
            // -2147483648 ～ 2147483647
        // long
            // 8字节 === 64bit
    // 浮点型2 
        // float 32bit 4字节
        // double 64bit 8字节
    // 字符型 1
        // char 2字节 16bit Unicode编码
    // 布尔型 1
        // boolean 1bit true false

// 引用数据类型
    // 数组 []
    // 类 class（抽象类abstract class）
    // 借口 interface
    // 枚举 enum
    // 注解 @interface


public class Test {
    public static void main(String[] args) {
        System.out.println(5);
    }
}