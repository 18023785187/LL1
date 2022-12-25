#
  这里是注释！！！
#

#
func sum(num1, num2):
begin
  print(num1, num2);

  func log(fn):
  begin
    fn(print);

    def num3 = 6;

    read num4 = 6 + num3;

    print(sum, print(1), num4, fn);
  end;

  log(print);

  return log;
end;

sum(1,2);
#

def num = 2;

func changeNum():
begin
  num = num + 2;
  return num;
end;
#
def a = begin
  def b = 12;
  return b;
end;

print(a);
#
eval(
  "
    def c = 12;
    print(c);
  "
);