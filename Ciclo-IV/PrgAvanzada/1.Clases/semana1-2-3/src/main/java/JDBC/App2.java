package JDBC;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class App2 {
    public static void main(String[] args) throws Exception {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
             Statement stmt = conn.createStatement()
        ) {

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

            stmt.executeUpdate(sqlCreateTable);
            System.out.println("Tabla creada");

            String sqlInsert = """
                    INSERT INTO REGISTRATION VALUES (6, 'JORGE', 'LÓPEZ', 45);
                    INSERT INTO REGISTRATION VALUES (7, 'JUAN', 'MOROCHO', 47);
                    INSERT INTO REGISTRATION VALUES (8, 'RENÉ', 'ELIZALDE', 40);
                    INSERT INTO REGISTRATION VALUES (9, 'AUDREY', 'ROMERO', 44);
                    INSERT INTO REGISTRATION VALUES (10, 'ELIZABETH', 'CADME', 45);
                    """;

            stmt.executeUpdate(sqlInsert);
            System.out.println("Datos agregados");

            String sqlSelect = "SELECT ID, FIRST_NAME, LAST_NAME, AGE FROM REGISTRATION";
            ResultSet rs = stmt.executeQuery(sqlSelect);

            while (rs.next()) {
                System.out.printf("%d - %s %s (%d)\n",
                        rs.getInt("ID"),
                        rs.getString("FIRST_NAME"),
                        rs.getString("LAST_NAME"),
                        rs.getInt("AGE")
                );
            }
            rs.close();


            // Sacar el promedio de edades de los reguistros de la base
            String sqlSelect2 = "SELECT AVG(AGE) AS PromedioEdades FROM REGISTRATION";
            ResultSet rs2 = stmt.executeQuery(sqlSelect2);
            rs2.next();
            System.out.printf("El promedio de edades es: %.2f\n", rs2.getDouble("PromedioEdades"));
            rs2.close();


            // Sacar los nombres que empiezen con J
            String sqlSelect3 = "SELECT FIRST_NAME FROM REGISTRATION WHERE FIRST_NAME LIKE 'J%'";
            try(ResultSet rs3 = stmt.executeQuery(sqlSelect3); ) {
                while (rs3.next()) {
                    System.out.printf("Los nombres que inician con J son: %s\n",rs3.getString("FIRST_NAME"));
                }
            }

        }
    }
}

