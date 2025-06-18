case class Persona (nombre: String, edad: Int)
val p1: Persona = Persona("Luis", 19)

// Con tuplas:
val p2: Tuple2[String, Int] = ("Luis", 19)

// Para llamar a los valores existen 2 formas:
p2._1 // "Luis"
p2._2 // 19