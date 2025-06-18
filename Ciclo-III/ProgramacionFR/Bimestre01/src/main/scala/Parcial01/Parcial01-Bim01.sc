def derivada (func: Double => Double, a: Int): Double =
  val h = 0.0001
  (func(a + h) - func(a))/h

val f = (x: Double) => 3.0 * x
def f1(x: Double) = Math.pow(x, 3)

val result = derivada(f, 3)
println("Resultado: " + result)