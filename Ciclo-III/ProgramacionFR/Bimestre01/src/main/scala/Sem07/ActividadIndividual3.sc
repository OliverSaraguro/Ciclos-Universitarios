case class Goleador(nombreJugador: String, posicion: String, nacionalidad: String, edad: Int,
                     partidosJugados: Int, golesMarcados: Int, club: String,
                      ciudadClub: String, fundacionClub: Int)

val lista: List[Goleador] = List(
  Goleador("Damián Díaz","Mediocentro ofensivo","Ecuador/Argentina",37,15,9,"Barcelona SC Guayaquil","Guayaquil",1925),
  Goleador("Janner Corozo","Extremo izquierdo","Ecuador",27,13,3,"Barcelona SC Guayaquil","Guayaquil",1925),
Goleador("Ronie Carrillo","Delantero centro","Ecuador",26,15,9,"CD El Nacional","Quito",1960),
Goleador("Byron Palacios","Delantero centro","Ecuador",28,14,6,"CD El Nacional","Quito",1960),
Goleador("Maicon Solís","Extremo derecho","Ecuador",29,14,4,"CD El Nacional","Quito",1960),
Goleador("Jorge Ordóñez","Extremo derecho","Ecuador",27,11,4,"CD El Nacional","Quito",1960),
Goleador("Mauro Díaz","Mediocentro ofensivo","Argentina",32,13,6,"CD Universidad Católica","Quito",1963),
Goleador("Aron Rodríguez","Extremo izquierdo","Ecuador",23,13,4,"CD Universidad Católica","Quito",1963),
Goleador("Miler Bolaños","Mediocentro ofensivo","Ecuador",33,10,7,"CS Emelec","Guayaquil",1929),
Goleador("Alejandro Cabeza","Delantero centro","Ecuador",26,15,3,"CS Emelec","Guayaquil",1929),
Goleador("Brian Oyola","Extremo izquierdo","Argentina",27,15,3,"Delfín SC","Manta",1981),
Goleador("Raúl Becerra","Delantero centro","Argentina/Chile",35,15,8,"Deportivo Cuenca","Cuenca",1971),
Goleador("Joaquín Vergés","Mediocentro ofensivo","Uruguay",31,15,4,"Gualaceo SC","Gualaceo",2000),
Goleador("Miguel Parrales","Delantero centro","Ecuador",27,14,13,"Guayaquil City FC","Guayaquil",2007),
Goleador("Michael Hoyos","Extremo derecho","Argentina/Ecuador",31,13,10,"Independiente del Valle","Sangolquí",1958),
Goleador("Alexander Alvarado","Extremo izquierdo","Ecuador",24,15,9,"LDU Quito","Quito",1918),
Goleador("José Angulo","Delantero centro","Ecuador",28,12,3,"LDU Quito","Quito",1918),
Goleador("Roberto Garcés","Pivote","Ecuador",30,15,5,"Libertad FC","Loja",2017),
Goleador("Renny Simisterra","Delantero centro","Ecuador",25,13,4,"Libertad FC","Loja",2017),
Goleador("Anderson Naula","Delantero centro","Ecuador",24,15,3,"Libertad FC","Loja",2017),
Goleador("Cristhian Solano","Extremo izquierdo","Ecuador",24,15,3,"Orense SC","Machala",2009),
Goleador("Jhon Cifuente","Delantero centro","Ecuador",30,14,7,"SD Aucas","Quito",1945),
Goleador("Jean Carlos Blanco","Delantero centro","Colombia",31,8,7,"Técnico Universitario","Ambato",1971),
Goleador("Alexander Bolaños","Delantero centro","Ecuador",23,13,4,"Técnico Universitario","Ambato",1971),
Goleador("Luis Estupiñán","Extremo derecho","Ecuador",24,12,3,"Técnico Universitario","Ambato",1971))

// 1. Calcular promedio de: Goles Marcados
def promGoles(ls: List[Goleador]): Double =
  ls.map(e => e.golesMarcados).sum.toDouble / ls.length

promGoles(lista)

// 1. Calcular promedio de: Edad Goleador
def promEdad(ls: List[Goleador]): Double =
  ls.map(e => e.edad).sum.toDouble / ls.length

promEdad(lista)

// 1. Calcular promedio de: Partidos Jugados
def promPartidos(ls: List[Goleador]): Double =
  ls.map(e => e.partidosJugados).sum.toDouble / ls.length

promPartidos(lista)

// 1. Calcular promedio de: Años fundación
def promFundacion(ls: List[Goleador]): Double =
  ls.map(e => e.fundacionClub).distinct.sum.toDouble / ls.map(e => e.fundacionClub).distinct.length

promFundacion(lista)


// 2. ¿Cuáles son las nacionalidades a las que pertenecen los Goleador?
def nacionalidades(ls: List[Goleador]): List[String] = ls.map(e => e.nacionalidad)
nacionalidades(lista)

// 3. ¿Cuántos jugadores tienen más de una nacionalidad?
def jugadoresConMasNacionalidad (ls: List[Goleador]): Int =
  ls.count(e => e.nacionalidad.contains('/'))

jugadoresConMasNacionalidad(lista)

// 4. ¿Cuáles son las posiciones en las que juegan los Goleador?
def posiciones (ls: List[Goleador]): List[String] =
  ls.map(e => e.posicion)

posiciones(lista)

// 5. De los jugadores ecuatorianos ¿cuál ha marcado la mayor cantidad de goles?
def ecuatorianosConMasGoles(ls: List[Goleador]): List[Goleador] =
  ls.filter(e => e.nacionalidad.contains("Ecuador") && e.golesMarcados == ls.map(_.golesMarcados).max)

ecuatorianosConMasGoles(lista)

// 6. De los jugadores ecuatorianos ¿cuál o cuáles han marcado la menor cantidad de goles?
def ecuatorianosConMenosGoles(ls: List[Goleador]): List[Goleador] =
  ls.filter(e => e.nacionalidad.contains("Ecuador") && e.golesMarcados == ls.map(_.golesMarcados).min)

ecuatorianosConMenosGoles(lista)

// 7. ¿Cuál es el goleador más joven?
def goleadorMasJoven(ls: List[Goleador]): List[Goleador] =
  ls.filter(e => e.edad == ls.map(_.edad).min)

goleadorMasJoven(lista)

// 8. ¿Cuál es el goleador de mayor edad?
def goleadorMasViejo(ls: List[Goleador]): List[Goleador] =
  ls.filter(e => e.edad == ls.map(_.edad).max)

goleadorMasViejo(lista)

// 9. ¿Cuál es la nacionalidad, posición y nombre del goleador que menos partidos ha jugado?
def goleadorMenosPartidos(ls: List[Goleador]) =
  ls.filter(e => e.partidosJugados == ls.map(_.partidosJugados).min).map(e => e.nacionalidad + " | " +
    e.posicion + " | " + e.nombreJugador)

goleadorMenosPartidos(lista)

// 10. ¿Cuáles son los nombres de los equipos a los que pertenecen los Goleador?
def equipos(ls: List[Goleador]): List[String] = ls.map(e => e.club)
equipos(lista)

// 11. Calcule la efectividad de los Goleador, relación entre goles y el número de partidos jugados.
def efectividad(ls: List[Goleador]): List[Double] =
  ls.map(e => e.golesMarcados.toDouble / e.partidosJugados)

efectividad(lista)

// 12. ¿Cuál es la efectividad promedio de los 25 Goleador?
def efectividadPromedio(ls: List[Goleador]): Double =
  ls.map(e => e.golesMarcados.toDouble / e.partidosJugados).sum / ls.length

efectividadPromedio(lista)

// 13. ¿Cuál es el club con más años de fundación?
def clubMasAntiguo (ls: List[Goleador]) =
  ls.minBy(_.fundacionClub).club

clubMasAntiguo(lista)

// 14. ¿Cuál es el club con menos años de fundación?
def clubMenosAntiguo (ls: List[Goleador]) =
  ls.maxBy(_.fundacionClub).club

clubMenosAntiguo(lista)

// 15. Liste las ciudades de los clubes.
def ciudadesClubes(ls: List[Goleador]): List[String] =
  ls.map(e => e.ciudadClub)

ciudadesClubes(lista)