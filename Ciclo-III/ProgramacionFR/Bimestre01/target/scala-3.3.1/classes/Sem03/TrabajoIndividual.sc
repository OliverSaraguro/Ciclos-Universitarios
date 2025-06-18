// 1. Implemente en Scala lo siguiente:
// - La expresión:

(1 to 10).sum

// - Defina la función:
def f(n: Int): Int = ((((1 to n).sum) * math.pow(n, n - 1)) - 1).toInt
f(5)

// Mapee la siguiente

// (n: Int) => math.pow((1 to n).sum, 2) - (2 * n)

// 2. Implemente la función isPrime, definida así:
def isPrime(n: Int): Boolean = (2 to (n-1)).forall(k => n % k != 0)
isPrime(5)

/*
3. Usted ha sido contratado en una veterinaria para realizar algunos reportes
que pueden incluir información de las mascotas o del propietario o de ambos.
La información se ha estructurado de la siguiente manera:
*/

// 1. Cree las estructra de clases (case) para representar la estructra de los datos.

case class Propietario(nombre: String, edad: Int, genero: String)
case class Mascota(tipo: String, nombre: String, raza: String, edad: Int,
                   propietario: Propietario)

// 2. Asigne la lista a un valor (val), pero, debe especificar el tipo de dato de ese valor.

val lista: List[Mascota] = List(
  Mascota("Gato", "Michi", "Siames", 4, Propietario("María", 18, "F")),
  Mascota("Tortuga", "Rafael", "Terrestre", 80, Propietario("Marco", 45, "M")),
  Mascota("Perro", "Gaudí", "Huski", 5, Propietario("Miguel", 33, "M")),
  Mascota("Perro", "Toby", "Boxer", 7, Propietario("Mirta", 51, "F")),
  Mascota("Gato", "Frufru", "Siberiano", 2, Propietario("Manuel", 23, "M")),
)

// 3. Defina una función que permite obtener la mascota de mayor edad.

def maxEdadMas(mascotas: List[Mascota]): Mascota = mascotas.maxBy(m => m.edad)
maxEdadMas(lista)

// 4. Cree una función sin nombre que permite obtener la mascota de menor edad. Utilice minBy

val minEdadMas = (mascotas: List[Mascota]) => mascotas.minBy(m => m.edad)
minEdadMas(lista)

// 5. Defina una función que permite obtener la mascota que tiene al propietario de mayor edad.

def maxEdadProp(mascotas: List[Mascota]): Mascota = mascotas.maxBy(m => m.propietario.edad)
maxEdadProp(lista)

// 6. Cree una función sin nombre que permite obtener la mascota que tiene al propietario de menor edad.

val minEdadProp = (mascotas: List[Mascota]) => mascotas.minBy(m => m.propietario.edad)
minEdadProp(lista)

// 7. Defina una función que responda a la pregunta ¿Todos las mascotas tiene un propietario cuyo nombre inicia con M?

def propietariosInicialM(mascotas: List[Mascota]): Boolean = mascotas.forall(m => m.propietario.nombre.startsWith("M"))
propietariosInicialM(lista)

// 8. Cree una función sin nombre que permita ordenar (sortBy) las lista de mascotas por el nombre de la mascota.

val ordenPorNombreMas = (mascotas: List[Mascota]) => mascotas.sortBy(m => m.nombre)
ordenPorNombreMas(lista)

// 9. Defina una función que permita ordenar (sortBy) las lista de mascotas por la edad del propietario.

def ordenPorEdadProp(mascotas: List[Mascota]): List[Mascota] = mascotas.sortBy(m => m.propietario.edad)
ordenPorEdadProp(lista)

//10. Cree una función sin nombre que ordene la lista de mascotas por el nombre del propietario

val ordenPorNombreProp = (mascotas: List[Mascota]) => mascotas.sortBy(m => m.propietario.nombre)
ordenPorNombreProp(lista)