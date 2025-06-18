
// Ejecicio 1:
// ¿Se puede especificar el tipo de dato que devuelve la función sin nombre? Muestre ejemplos de los intentos realizados

/*
def funcion (a: Int, b: Int): Int  => if (a >= b) a else b <- Incorrecto

(a: Int, b: Int) => if (a >= b) a else b: Int <- Correcto
|
(a: Int, b: Int): Int  => if (a >= b) a else b <- Incorrecto
*/




// Ejercicio 1:
// Asigne la función sin nombre a un valor (val) e invoque a la misma.
/*
var ejemplo = (a: Int, b: Int) => if (a >= b) a else b
ejemplo(6,4)
*/


// Ejercicio 1:
// ¿Se puede asignar una función sin nombre a una variable (var)?
// Muestre los ejemplos de sus intentos.

/*
def countWithoutOpenVowels(word : String) : Int =
         word.toLowerCase.replaceAll("a", "").replaceAll("e", "").replaceAll("o", "").length
def countWithoutOpenVowels(word: String): Int
*/


// Ejecicio 2F
/*
def countWithoutOpenVowels(word : String) : Int = {
  word.toLowerCase.replaceAll("a", "").replaceAll("e", "").replaceAll("o", "").length
}

countWithoutOpenVowels("Loja")

def countWithoutOpenVowels(word : String) : Int = {
  word.toLowerCase.replaceAll("a", "").replaceAll("e", "").replaceAll("o", "").length
}

countWithoutOpenVowels("Universidad")

def countWithoutOpenVowels(word : String) : Int = {
   word.toLowerCase.replaceAll("a", "").replaceAll("e", "").replaceAll("o", "").length
}

countWithoutOpenVowels("Particular")
*/

// Ejercicio 2.3
/*
def countWithoutOpenVowels(word : String) : String = {
  word.toLowerCase.replaceAll("i", "").replaceAll("u", "")
}

countWithoutOpenVowels("Universidad")
*/

// Ejecicio 2.4-5
/*
val func01 = (word : String) => {
  word.toLowerCase.replaceAll("a", "").replaceAll("e", "").replaceAll("o", "").length
}

val func02 = (word : String) => {
  word.toLowerCase.replaceAll("i", "").replaceAll("u", "")
}

println(func01("Loja"))
println(func01("Universidad"))
println(func01("Particular"))

println(func02("Loja"))
println(func02("Universidad"))
println(func02("Particular"))
*/

// Ejercicio 2.6-7
/*
val palabra = (word : String) =>   {
  word.toLowerCase.replaceAll("a", "").replaceAll("e", "").replaceAll("o", "").length
}
palabra("Loja")


val palabra2 = (word : String) =>   {
  word.toLowerCase.replaceAll("i", "").replaceAll("u", "")
}
palabra2("Universidad")





val palabra3 = (word : String , word2 : String) => {
  if(word.toLowerCase.replaceAll(word2, "").length %2 == 0) true else false
}
palabra3("Loja", "a")
 */

// Ejercio 2.8
/*
val nums = List(1, 2, 3, 4, 5)
nums.map(n => (n, n * n))
nums.filter(n => n % 2 == 0)
nums.reduce((n1, n2) => n1 * n2)
 */

//Ejercicio 2.9

case class Estudiante(nombre: String, edad: Int)
val estudiantes = List(Estudiante("Daniel", 21), Estudiante("Janneth", 23), Estudiante("Verónica", 22), Estudiante("Ramiro", 24))

estudiantes.max

estudiantes.maxBy(e => e.edad)

def maximoPor (estudiantes: List[Estudiante]): Estudiante = {
  estudiantes.maxBy(e => e.edad)
}

maximoPor(estudiantes)
