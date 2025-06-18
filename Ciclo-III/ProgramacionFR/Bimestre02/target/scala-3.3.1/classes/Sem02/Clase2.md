<h2>Tuplas</h2>

Las tuplas son una estructura de datos que almacenan un conjunto de 
valores relacionados, es como un reemplazo a las case class Ej:

````scala 3
case class Persona (nombre: String, edad: Int)
val p1: Persona = Persona("Luis", 19)

// Con tuplas:
val p2: Tuple2[String, Int] = ("Luis", 19)

// Para llamar a los valores existen 2 formas:
p._1 // "Luis"
p._2 // 19

p.get(1) // "Luis"
p.get(2) // 19
````

La utilidad principal de las tuplas es para representación de datos:

````scala 3
val people: List[Tuple3[String, Double, Int]] = List(("a", 1.2, 5))
````