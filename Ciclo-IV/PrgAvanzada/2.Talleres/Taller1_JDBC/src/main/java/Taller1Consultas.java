import java.sql.*;

public class Taller1Consultas {

    public static void main(String[] args) {
        try (
                Connection conn = DriverManager.getConnection(
//                        "jdbc:h2:~/test",
                        "jdbc:h2:/Users/oliversaraguro/Documents/Programacion_Avanzada/Taller_JDBC_01/bdh2/test",
                        "sa",
                        "")) {
//            consulta1(conn);
//            consulta2(conn);
//            consulta3(conn);
//            consulta4(conn);
//            consulta5(conn);
        } catch (
                SQLException e) {
            e.printStackTrace();
        }
    }

//    ¿Cuál es la categoría en la que más gastos se han registrado?
    public static void consulta1(Connection conn) throws SQLException {
        var select = """
                SELECT nombre AS categoria, COUNT(idGasto) AS vecesGastos
                FROM CATEGORIA c
                JOIN GASTO g ON c.idCategoria = g.idCategoria
                GROUP BY nombre
                ORDER BY vecesGastos DESC
                LIMIT 1                       
                """;

        PreparedStatement pStmt = conn.prepareStatement(select);
        System.out.println(pStmt);
        try (ResultSet rs = pStmt.executeQuery()) {
            while (rs.next()) {
                System.out.printf("- Categoria: %s - Mas reguistrado: %.0f veces\n",
                        rs.getString("categoria"),
                        rs.getDouble("vecesGastos"));
            }
        }

    }

//    ¿Cuál es la categoría en dónde está el gasto más elevado?
    public static void consulta2(Connection conn) throws SQLException {
        var select = """
                SELECT nombre AS categoria, sum(valor) AS MayorGasto
                FROM CATEGORIA c
                JOIN GASTO g ON c.idCategoria = g.idCategoria
                GROUP BY nombre
                ORDER BY MayorGasto DESC
                LIMIT 1                       
                """;

        PreparedStatement pStmt = conn.prepareStatement(select);
        System.out.println(pStmt);
        try (ResultSet rs = pStmt.executeQuery()) {
            while (rs.next()) {
                System.out.printf("- Categoria: %s - Mayor Gasto: $ %.0f \n",
                        rs.getString("categoria"),
                        rs.getDouble("MayorGasto"));
            }
        }

    }

//    ¿Cuál es la categoría que tiene el mayor promedio de gastos?
    public static void consulta3(Connection conn) throws SQLException {
        var select = """
                SELECT nombre AS categoria, avg(valor) AS PromedioGastos
                FROM CATEGORIA c
                JOIN GASTO g ON c.idCategoria = g.idCategoria
                GROUP BY nombre
                ORDER BY PromedioGastos DESC
                LIMIT 1                       
                """;

        PreparedStatement pStmt = conn.prepareStatement(select);
        System.out.println(pStmt);
        try (ResultSet rs = pStmt.executeQuery()) {
            while (rs.next()) {
                System.out.printf("- Categoria: %s - Mayor Promedio: %.2f \n",
                        rs.getString("categoria"),
                        rs.getDouble("PromedioGastos"));
            }
        }

    }

//    ¿Cuál es la categoría que tiene el menor número de gastos gravados por IVA?
    public static void consulta4(Connection conn) throws SQLException {
        var select = """
                SELECT nombre AS categoria, Min(idGasto) AS menorNumero
                FROM CATEGORIA c
                JOIN GASTO g ON c.idCategoria = g.idCategoria
                WHERE g.gravadoIva = TRUE
                GROUP BY nombre              
                ORDER BY menorNumero ASC
                LIMIT 1                       
                """;

        PreparedStatement pStmt = conn.prepareStatement(select);
        System.out.println(pStmt);
        try (ResultSet rs = pStmt.executeQuery()) {
            while (rs.next()) {
                System.out.printf("- Categoria: %s - Menor número de gastos gravados por IVA: %.0f \n",
                        rs.getString("categoria"),
                        rs.getDouble("menorNumero"));
            }
        }

    }

//    Presente las categorías ordenadas por el número de gastos en forma
//    descendente (el que tiene más gastos primero)
    public static void consulta5(Connection conn) throws SQLException {
        var select = """
                SELECT nombre AS categoria, sum(valor) AS GastoTotal
                FROM CATEGORIA c
                JOIN GASTO g ON c.idCategoria = g.idCategoria
                GROUP BY nombre
                ORDER BY GastoTotal DESC                
                """;

        PreparedStatement pStmt = conn.prepareStatement(select);
        System.out.println(pStmt);
        try (ResultSet rs = pStmt.executeQuery()) {
            while (rs.next()) {
                System.out.printf("- Categoria: %s - Gasto Total: $ %.2f \n",
                        rs.getString("categoria"),
                        rs.getDouble("GastoTotal"));
            }
        }

    }
}
