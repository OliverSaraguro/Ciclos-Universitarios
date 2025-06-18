package JDBC;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class App1 {
    public static void main( String[] args ) throws Exception {
        Connection conn = DriverManager.getConnection(
                "jdbc:h2:~/test",
                "sa",
                "");


        String sqlCreateTable = """
                CREATE TABLE IF NOT EXISTS REGISTRATION
                (
                ID INTEGER NOT NULL,
                FIRST_NAME VARCHAR(255),
                LAST_NAME VARCHAR(255),
                AGE INTEGER,
                CONSTRAINT REGISTRATION_pkey PRIMARY KEY (ID)
                );
                """;
        Statement stmt = conn.createStatement();

        stmt.executeUpdate(sqlCreateTable);
        System.out.println("Tabla creada");

        String sqlInsert = """
                INSERT INTO REGISTRATION VALUES (1, 'JORGE', 'LÓPEZ', 45);
                INSERT INTO REGISTRATION VALUES (2, 'JUAN', 'MOROCHO', 47);
                INSERT INTO REGISTRATION VALUES (3, 'RENÉ', 'ELIZALDE', 40);
                INSERT INTO REGISTRATION VALUES (4, 'AUDREY', 'ROMERO', 44);
                INSERT INTO REGISTRATION VALUES (5, 'ELIZABETH', 'CADME', 45);
                """;

        stmt.executeUpdate(sqlInsert);
        System.out.println("Datos agregados");

        String sqlSelect = "SELECT * FROM REGISTRATION";
        ResultSet rs = stmt.executeQuery(sqlSelect);

        while(rs.next()) {
            System.out.printf("%d - %s %s (%d)\n",
                    rs.getInt(1),
                    rs.getString(2),
                    rs.getString(3),
                    rs.getInt(4)
            );
        }

        rs.close();
        stmt.close();
        conn.close();
    }
}
