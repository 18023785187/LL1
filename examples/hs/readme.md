# hs 语言

#### 特性

1. 目前支持数字和字母类型，字母类型用双引号包裹，支持换行
2. def 用于声明变量
3. read 声明常量
4. func 定义方法，方法体由 begin ... end; 包裹
5. begin ... end; 具有块级作用域
6. 每个语句需以分号结尾
7. print 方法用于打印变量值
8. eval 作用类似 js 的 eval
9. 注释语法为开头结尾 #，中间注释

#### 使用

命令行执行 `npm link`，后执行 `hs <filename>` 即可。

或直接执行 `node index.js`，此方法只会运行 `input.hs` 文件。

#### 例子

###### 声明

```javascript
#
  hs 语言 语法注释
#

def a = 1 + (6 - 1);

read b = 10;

print(a + b); # 16 #

func sum(num1, num2):
begin
  return num1 + num2;
end;

print(sum, print); # <Function sum> <SystemFunction print> #
print(sum(1, 2)); # 3 #

read str = "
  hello h
";
```

###### 块作用域

```javascript
def c = 2;

begin
  def c = 1;

  print(c); # 1 #
end;

print(c); # 2 #
```

###### 块作用域返回值

```javascript
def a =
begin
  def b = 12;
  return b;
end;

print(a); # 12 #
```