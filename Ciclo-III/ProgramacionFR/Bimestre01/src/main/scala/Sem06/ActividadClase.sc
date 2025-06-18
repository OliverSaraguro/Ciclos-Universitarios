val lista = List(5, 6, 7, 8, 9)
val func = (l: List[Int]) => l.count(k => k % 2 == 0)
func(lista)