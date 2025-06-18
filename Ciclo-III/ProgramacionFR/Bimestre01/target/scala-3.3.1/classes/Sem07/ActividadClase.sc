val lista = List("Jose", "Luis", "Maria", "Andres")
lista.map(e => e.length)

val esPrimo = (x: Int) => (2 until x).forall(k => x % k != 0)
val lista2 = List(5, 4, 3, 8, 9)
lista2.map(esPrimo).map(e => if e then 1 else 0).sum
// Otra forma con el match
lista2.map(esPrimo).map(e => e match {case true => 1 case false => 0}).sum

// Contar los nros perfectos de la lista
val nums = List(4,5,6,10,12,15,28)
def contarPerfectos(num: List[Int]): Int =
  val sumPropios = (x: Int) => (1 until x).filter(x % _ == 0).sum
  num.filter(e => e == sumPropios(e)).length

contarPerfectos(nums)