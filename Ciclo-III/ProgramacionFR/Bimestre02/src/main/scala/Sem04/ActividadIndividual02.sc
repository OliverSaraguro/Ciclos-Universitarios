val students: List[(String, Int, Double, Char)] = List(
  ("Andrés", 10, 20, 'M'),
  ("Ana", 11, 19, 'F'),
  ("Luis", 9, 18, 'M'),
  ("Cecilia", 9, 18, 'F'),
  ("Katy", 11, 15, 'F'),
  ("Jorge", 8, 17, 'M'),
  ("Rosario", 11, 18, 'F'),
  ("Nieves", 10, 20, 'F'),
  ("Pablo", 9, 19, 'M'),
  ("Daniel", 10, 20, 'M')
)
// 1.
students.groupBy(_._2).takeWhile(e => e._2.length == students.groupBy(_._2).maxBy(_._2.length)._2.length).map(e => (e._1, e._2.map(_._1)))

// 2.
students.groupBy(_._3).filter(e => e._2.length == students.groupBy(_._3).maxBy(_._2.length)._2.length).map(e => (e._1, e._2.map(_._4)))

// 3.
students.groupBy(_._4).map(e => (e._1, e._2.map(_._1)))
