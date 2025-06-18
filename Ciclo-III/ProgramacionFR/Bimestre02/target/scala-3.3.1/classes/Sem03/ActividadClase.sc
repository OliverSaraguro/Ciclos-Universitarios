val lista: List[Tuple3[String, Int, Int]] = List(
  ("Zapatos", 10, 50),
  ("Camisas", 20, 30),
  ("Pantalones", 15, 40),
  ("Gorras", 18, 15),
  ("Calcetines", 50, 5)
)

def filtrar (p: Tuple3[String, Int, Int]): Boolean =
  p._3 > 35.0

def mapear (p: Tuple3[String, Int, Int]): Double =
  p._2 * p._3

def aplanarMapear (p: Tuple3[String, Int, Int]): List[Double] =
  List.fill(p._2)(p._3)

def acumula (sum: Double, tuple: Tuple3[String, Int, Int]): Double =
  sum + (tuple._2 * tuple._3)

def mapear2 (p: Tuple3[String, Int, Int]): Double =
  p._3

def reducir (acum: Double, sum: Double): Double =
  acum + sum


lista.filter(filtrar)

lista.map(mapear)

lista.flatMap(aplanarMapear)

lista.foldLeft(0.0)(acumula)

lista.map(mapear2).reduce(reducir) / lista.length.toDouble


val l = List("Lusi", "Lusi", "Emu", "Jose", "San", "Emu", "Ryan")
l.groupBy(identity)