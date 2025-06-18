// 1
val nums: List[Int] = List(1, 2, 3, 2, 1, 1, 4, 3, 2, 4, 1, 3, 2)
nums.groupBy(identity).maxBy(e => e._2.length)

// 2
val names: List[String] = List(
  "JHORDY",
  "JEAN",
  "SEBASTIAN",
  "JHON",
  "EDISSON",
  "PAUL",
  "FRANKLIN",
  "IAM",
  "JUAN",
  "LENIN",
  "WILLIAM",
  "CARLOS",
  "SEBASTIAN",
  "MARIA",
  "LUIS",
  "LUIS",
  "DANIEL",
  "RAMIRO",
  "ALEX",
  "JOSEPH",
  "SANTIAGO",
  "RENATO",
  "JUAN",
  "EDUARDO",
  "KELVIN",
  "DARA",
  "JEAN",
  "PAOLA",
  "MATEO"
)

names.map(_.charAt(0)).groupBy(identity).maxBy(e => e._2.length)
