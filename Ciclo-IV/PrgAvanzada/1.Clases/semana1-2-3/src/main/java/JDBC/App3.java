package JDBC;

import java.sql.*;
import java.util.Scanner;

public class App3 {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        String id;
        System.out.println("Ingrese el ID: ");
        id = entrada.nextLine();

        try(Connection conn = DriverManager.getConnection(
                "jdbc:h2:~/test",
                "sa",
                "")){
//            searchById(id,conn);
            searchById2(id,conn);

        }catch (SQLException e){
            e.printStackTrace();
        }
    }

    private static void searchById(String id, Connection conn) throws SQLException {
        var selectBase = """
                SELECT ID, FIRST_NAME, LAST_NAME, AGE
                FROM REGISTRATION
                WHERE id = %s;
                """;
        var select = String.format(selectBase, id);
        System.out.println(select);
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(select) ) {

            while (rs.next()) {
                System.out.printf("%d - %s %s (%d)\n",
                        rs.getInt("ID"),
                        rs.getString("LAST_NAME"),
                        rs.getString("FIRST_NAME"),
                        rs.getInt("AGE"));
            }
        }
    }

    private static void searchById2(String id, Connection conn) throws SQLException {
        var selectBase = """
                SELECT ID, FIRST_NAME, LAST_NAME, AGE
                FROM REGISTRATION
                WHERE id = ?;
                """;

        PreparedStatement pStmt = conn.prepareStatement(selectBase);
        pStmt.setString(1, id);
        System.out.println(pStmt);
        try (ResultSet rs = pStmt.executeQuery()) {
            while (rs.next()) {
                System.out.printf("%d - %s %s (%d)\n",
                        rs.getInt("ID"),
                        rs.getString("LAST_NAME"),
                        rs.getString("FIRST_NAME"),
                        rs.getInt("AGE"));
            }
        }
    }
}

