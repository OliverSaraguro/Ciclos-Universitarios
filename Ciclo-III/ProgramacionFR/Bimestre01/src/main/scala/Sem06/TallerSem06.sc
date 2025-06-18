case class InfoContacto(direccion: String, email: String, telefono:String)
case class Representante(nombre: String, apellido: String, infoContacto: InfoContacto)
case class Asignatura(nombre: String, ciclo: Int, acd: Double, aa: Double, ape: Double, notaFinal: Double)
case class Alumno(cedula: String, apellido: String, nombre: String, representante: Representante,
                  asignaturas: List[Asignatura])

val rep1 = Representante("Jose", "Armijos", InfoContacto("DH-88", "josea2024@gmail.com", "09987646"))
val rep2 = Representante("Maria", "Nader", InfoContacto("LAJ-8", "MARI4@gmail.com", "0686486"))
val rep3 = Representante("Daniel", "Montaño", InfoContacto("LH-456", "danmon56@gmail.com", "09998784"))

val asig1 = List(Asignatura("Ecuaciones", 3, 2.5, 3.5, 2, 8), Asignatura("Programacion", 2, 2.5, 1.5, 3, 7))
val asig2 = List(Asignatura("Algebra", 1, 2.5, 0.5, 2.5, 5.5), Asignatura("Quimica", 3, 3, 3, 3, 9))
val asig3 = List(Asignatura("Fisica", 7, 2, 3, 1, 6), Asignatura("Calculo", 5, 2.5, 2.5, 3.5, 8.5))

val al1 = Alumno("1165468", "Montaño", "Alejandra", rep3, asig3)
val al2= Alumno("11033789", "Nader", "Francisco", rep2, asig2)
val al3 = Alumno("0578966", "Armijos", "Matias", rep1, asig1)

val listaAlumnos = List(al1, al2, al3)

listaAlumnos.map(alumno => alumno.asignaturas.map(_.nombre))