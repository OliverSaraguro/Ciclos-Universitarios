def integracion(func: Double => Double, a: Int, b: Int): Double =
  val funcX = (a: Int, b: Int) => (a + b).toDouble / 2
  (b - a) * ((func(a) + (4 * func(funcX(a, b))) + func(b)) / 6)

val func = (x: Double) => -Math.pow(x, 2) + (8 * x) -12
// val func = (x: Double) => 3 * Math.pow(x, 2)
// val func = (x: Double) => x + 2 * math.pow(x, 2) - math.pow(x, 3) + 5 * math.pow(x, 4)
// val func = (x: Double) => ((2 * x) + 1) / (Math.pow(x, 2) + x)
// val func = (x: Double) => Math.pow(math.E, x)
// val func = (x: Double) => 1 / (Math.sqrt(x - 1))
// val func = (x: Double) => 1 / (1 + Math.pow(x, 2))

val result = integracion(func, 3, 5)

val errorFunc = (valEsp: Double, valObt: Double) => math.abs(valEsp - valObt)
errorFunc(7.33, result)