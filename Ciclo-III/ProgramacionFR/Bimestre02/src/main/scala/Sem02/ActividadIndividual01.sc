val lista: List[Tuple3[String, Int, Int]] = List(
  ("Zapatos", 10, 50),
  ("Camisas", 20, 30),
  ("Pantalones", 15, 40),
  ("Gorras", 18, 15),
  ("Calcetines", 50, 5)
)

// 1. Filtrar Productos Caros: Usa filter para encontrar productos
// cuyo precio por unidad sea mayor a 35.0.
val prodCaros: List[Tuple3[String, Int, Int]] = lista.filter(e => e._3 > 35.0)

// 2. Calcular Ventas Totales: Utiliza map para transformar la lista
// en una lista de ingresos por producto (cantidad vendida * precio por unidad).
val ventasTotales: List[Int] = lista.map(e => e._2 * e._3)

// 3. Lista Detallada de Precios: Emplea flatMap para crear una lista detallada de precios,
// repitiendo el precio de cada producto tantas veces como unidades se vendieron.
// Para resolver esta tarea busque información sobre la función fill. Ejemplo: List.fill(4)(3)
val detallePrecios: List[Int] = lista.flatMap(e => List.fill(e._2)(e._3))

// 4. Ingresos Totales: Usa foldLeft para calcular el ingreso total de todas las ventas.
val ingresosTotales: Int  = lista.foldLeft(0)((acum, e) => acum + (e._2 * e._3))

// 5. Precio Promedio: Aplica reduce para calcular el precio promedio de los productos.
val precioProm: Double = lista.map(e => e._3).reduce((acum, sum) => acum + sum) / lista.length.toDouble