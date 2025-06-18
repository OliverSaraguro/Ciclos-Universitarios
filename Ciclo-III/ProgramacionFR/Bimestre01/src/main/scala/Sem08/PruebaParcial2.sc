// Creamos una case class denominada Data con sus atributos: text, likes, retweets, comments, date y client
case class Data (text: String, likes: Int, retweets: Int, comments: Int, date: String, client: String)

// Almacenamos en una lista llamada "tweets" varios objetos del tipo Data
val tweets: List[Data] = List(
  Data("Lorem ipsum dolor sit amet consectetur adipiscing elit.",6315358,2169804,9852220,"01-12-2023","iOS"),
  Data("Pellentesque a ligula at dui posuere malesuada quis vel neque.",9517223,3589030,3752037,"02-12-2023","Android"),
  Data("Nullam scelerisque orci a libero eleifend sit amet ultrices tortor ornare.",5951335,3810426,6561066,"03-12-2023","iOS"),
  Data("Aliquam ullamcorper sapien eget aliquam laoreet.",3503900,7420140,4940107,"04-12-2023","BlackBerry"),
  Data("Sed egestas elit ut enim lacinia vulputate.",6899408,2453887,8035530,"05-12-2023","Android"),
  Data("Proin ut nunc eget ex euismod dapibus sed vitae est.",4412721,252510,7835585,"06-12-2023","BlackBerry"),
  Data("Phasellus et augue ut lorem interdum tincidunt nec quis nisl.",1768109,3697856,3275678,"01-12-2023","iOS"),
  Data("Proin volutpat metus non ex rutrum sed tincidunt turpis auctor.",15715,6390688,8423496,"02-12-2023","Android"),
  Data("Fusce accumsan ante quis fermentum consectetur.",781427,539841,6580551,"03-12-2023","iOS"),
  Data("Duis sollicitudin augue non maximus faucibus.",4312183,4076007,2385356,"04-12-2023","BlackBerry"),
  Data("Proin ut leo ac lorem ornare lobortis vitae in lacus.",5145292,116560,5750496,"05-12-2023","Android"),
  Data("Suspendisse eget lectus eget massa tempus suscipit sed in lectus.",3410099,1483841,213055,"06-12-2023","BlackBerry"),
  Data("Nunc sed purus ac arcu condimentum tincidunt.",7150699,8908733,5778897,"01-12-2023","iOS")
)


// Definimos una funcion llamada "coeficienteVariacion" que calcula el coeficiente de variacion y recibe como parametros
// el valor de la desviacion y una lista de tipo "Data" que representará a la lista de tweets
def coeficienteVariacion (desviacion: Double, lista: List[Data]): Double =
  val media: Double = lista.map(_.likes).sum / lista.length.toDouble // Obtenemos el valor del promedio de likes en los tweets
  desviacion / media // Aplicamos la formula del coeficiente de variacion dividiendo el valor de la desviacion entre la media

// Definimos una funcion llamada "desviacionEstandar" que calculará la desviación estándar de los likes y recibe como
// parámetro una lista de tipo "Data" que representará a la lista de tweets
def desviacionEstandar (lista: List[Data]): Double =
  val media: Double = lista.map(_.likes).sum / lista.length.toDouble // Obtenemos el valor del promedio de likes en los tweets
  val n: Int = lista.length // Obtenemos el valor del tamaño de los datos
  math.sqrt( // Obtenemos la raiz cuadrada
    (lista.map // Mapeamos la lista de tweets
  (e => math.pow(e.likes - media, 2)) // Por cada elemento de la lista de tweets elevamos al cuadrado
                                        // la resta de los likes de cada tweet con la media de likes
    .sum) / n) // Sumamos todos los elementos de la nueva lista obtenida a partir del mapeo y dividimos
               // ese valor para el tamaño de los datos


coeficienteVariacion(desviacionEstandar(tweets), tweets) // Llamamos a la funcion "coeficienteVariacion" y le enviamos como parametro
                                           // el valor obtenido a partir de la funcion "desviacionEstandar"