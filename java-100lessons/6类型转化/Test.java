/**
    类型之间的转化问题
    1同种数据类型之间是可以直接进行赋值操作；int a = 1; int b = a;
    2数据类型不同的空间 之间的赋值
        同种大数据类型之间才能发生转换
        基本类型---基本类型之间 可以直接转换（自动 强制）
        引用类型---引用类型之间 可以直接转换（自动 强制 -- 上转型 下转型）
        基本类型---引用类型之间 不可以直接转换（间接--包装类/封装类）
    3保证大数据类型益智的前提下
        基本类型
            小数据类型相同
                都是整型 都是浮点型
                大空间变量可以直接存储小空间的数据
                小空间变量不可以直接存储大空间的数据（需要强制类型转换）
                转换过程写法都好用 如果转换过程中数据范围超过边界 可能会有损失
                byte a = 1; int b = a; 自动转化就可以
                int a = 1; byte b = (byte)a; 需要强制类型转换
                如果发现强制转换之前的数据比较大 强制转化这件事可以
                int a = 1000; byte b = (byte)a; 编译好用 执行后 b 存放的值一定发生变化
            小数据类型不用
                整型和浮点型
                    两个比较精确程度 浮点型精确程度更高 可以直接存放整数
                    int a = 1; float b = a; ==> 1.0
                    float a = 1.9F; int b = a;  ==> 1
                整型和字符型
                    每一个字符都对应一个Unicode码 a --- 97
                    char x = 'a'; init y = x; 97
                    int x = 97; char y = (char)x; a 
                布尔型很特殊
                    不能与其他基本类型进行转换
 */

 public class Test {
     public static void main(String[] agrs) {
         byte a = 1;
         int b = a;
         System.out.println(b); // 1

         int aa = 1;
         byte bb = (byte)aa; // 强制转化成 byte 类型
         System.out.println(bb); // 1

         float x = 1.1F;
         double y = x;
         System.out.println(y); // 1.100000023841858

         double xx = 1.1;
         float yy = (float)xx;
         System.out.println(yy); // 1.1

         int c = 1;
         float d = c;
         System.out.println(d); // 1.0

         long cc = 1;
         float dd = cc;
         System.out.println(dd); // 1.0

         float ccc = 1.9F;
         int ddd = (int)ccc;
         System.out.println(ddd); // 1

         char e = 'e';
         int f = e;
         System.out.println(f); // 101

         int ee = 101;
         char ff = (char)ee;
         System.out.println(ff); // e
     }
 }
