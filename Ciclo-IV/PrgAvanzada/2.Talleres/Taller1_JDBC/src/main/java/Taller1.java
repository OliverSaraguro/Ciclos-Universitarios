import java.sql.*;
import java.util.Scanner;
import java.util.Date;
import java.text.SimpleDateFormat;


public class Taller1 {
    static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {

        try (Connection conn = DriverManager.getConnection(
//                "jdbc:h2:~/test",
                "jdbc:h2:/Users/oliversaraguro/Documents/Ciclo4/Programacion_Avanzada/Taller_JDBC_01/bdh2/test",
                "sa",
                "")) {
//            creacionTablas(conn);
            obtenerDatos(conn);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void creacionTablas(Connection conn) throws SQLException {
        // Tabla
        String sqlCreateTable = """
                CREATE TABLE PERSONA(
                	cedula VARCHAR(20),
                    nombres VARCHAR(50),
                    apellidos VARCHAR(50),
                    telefono INTEGER,
                    email VARCHAR(100),
                    CONSTRAINT PERSONA_pkey PRIMARY KEY (cedula)
                 );
                                
                CREATE TABLE CATEGORIA(
                	idCategoria INTEGER auto_increment,
                	nombre VARCHAR(30),
                    fechaC DATE,
                	CONSTRAINT CATEGORIA_pkey PRIMARY KEY (idCategoria)
                );
                               
                 CREATE TABLE GASTO(
                	idGasto INTEGER auto_increment,
                	valor DOUBLE,
                	fechaHora DATETIME,
                	gravadoIva BOOLEAN,
                	cedPersona VARCHAR(20), -- FK
                	idCategoria INTEGER, --FK
                	CONSTRAINT GASTO_pkey PRIMARY KEY (idGasto),
                	FOREIGN KEY (cedPersona) references PERSONA(cedula),
                	FOREIGN KEY (idCategoria) references CATEGORIA(idCategoria)
                );
                """;

        Statement stmt = conn.createStatement();
        stmt.executeUpdate(sqlCreateTable);
        System.out.println("Tablas creadas");
    }

    public static void obtenerDatos(Connection conn) throws SQLException {
        Date fechaHoraActual = new Date();
        SimpleDateFormat formatoFechaHora = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        // Datos Persona
        String nombre, apellido, cedula, email;
        int tlf;
        System.out.print("BIENVENIDO\nReguisto de gastos mensuales\n" +
                "Ingrses sus datos Personales\n" +
                "- Nombre: ");
        nombre = scanner.nextLine();
        System.out.print("- Apellido: ");
        apellido = scanner.nextLine();
        System.out.print("- Cedula: ");
        cedula = scanner.nextLine();
        System.out.print("- Email: ");
        email = scanner.nextLine();
        System.out.print("- Telefono: ");
        tlf = scanner.nextInt();

        insertarPersona(conn, cedula, nombre, apellido, tlf, email);


        // Gastos
        String[] categorias = {"VIVIENDA", "EDUCACION, ARTE Y CULTURA", "SALUD", "VESTIMENTA", "ALIMENTACION", "TURISMO"};
        insertarCategoria(conn, categorias, null);

        double[] gastos = new double[categorias.length];
        String[] fechas = new String[categorias.length];
        Boolean[] iva = new Boolean[categorias.length];

        System.out.println("\nIngresar sus gastos en:");
        for (int i = 0; i < categorias.length; i++) {
            System.out.print("- " + categorias[i] + ": ");
            gastos[i] = scanner.nextDouble();
            iva[i] = obtenerGravadoIVA();
            fechas[i] = formatoFechaHora.format(fechaHoraActual);

            insertarGasto(conn, gastos[i], iva[i], cedula, categorias[i], fechas[i]);
        }

        System.out.print("\nDesea ingresar otro gasto 'SI' o 'NO': ");
//        scanner.nextLine();
        String vrf = scanner.nextLine();

        if (vrf.equalsIgnoreCase("SI")) {
            System.out.println("Ingrese cuantos gastos extra va a anadir: ");
            int cont = scanner.nextInt();

            String[] otrasCategorias = new String[cont];
            String[] otrasFechas = new String[cont];
            double[] otrosgastos = new double[cont];
            boolean[] otroIva = new boolean[cont];


            scanner.nextLine();
            for (int i = 0; i < cont; i++) {
                System.out.println("GASTO" + (i + 1));

                System.out.print("Nombre: ");
                otrasCategorias[i] = scanner.nextLine();

                System.out.print("Ingrese la fecha YYYY-MM-DD: ");
                otrasFechas[i] = scanner.nextLine();

                System.out.print("Valor: ");
                otrosgastos[i] = scanner.nextDouble();
                otroIva[i] = obtenerGravadoIVA();

                insertarCategoria(conn, otrasCategorias, otrasFechas[i]);
                insertarGasto(conn, otrosgastos[i], otroIva[i], cedula, otrasCategorias[i], otrasFechas[i]);

            }
            System.out.println("\nReguisto de gastos finalizado.");

        } else {
            System.out.println("Reguisto de gastos finalizado.");
        }
    }

    public static boolean obtenerGravadoIVA() {
        System.out.print("¿Está gravado con IVA? (SI/NO): ");
        scanner.nextLine();
        String rpta = scanner.nextLine();
        return rpta.equalsIgnoreCase("SI");
    }

    public static void insertarPersona(Connection conn, String cedula, String nombres, String apellidos, int telefono,
                                       String email) throws SQLException {

        String sqlInsert = """
                INSERT INTO PERSONA (cedula, nombres, apellidos, telefono, email)
                VALUES (?, ?, ?, ?, ?)
                """;

        try (PreparedStatement pstmt = conn.prepareStatement(sqlInsert)) {
            pstmt.setString(1, cedula);
            pstmt.setString(2, nombres);
            pstmt.setString(3, apellidos);
            pstmt.setInt(4, telefono);
            pstmt.setString(5, email);
            pstmt.executeUpdate();
            System.out.println("Datos de persona insertados correctamente.");
        }
    }


    public static void insertarCategoria(Connection conn, String[] categorias, String fecha) throws SQLException {
        String sqlSelect = "SELECT nombre FROM CATEGORIA WHERE nombre = ?";
        String sqlInsert = "INSERT INTO CATEGORIA (nombre, fechaC) VALUES (?, ?)";

        try (PreparedStatement pstmtSelect = conn.prepareStatement(sqlSelect);
             PreparedStatement pstmtInsert = conn.prepareStatement(sqlInsert)) {

            for (String categoria : categorias) {
                pstmtSelect.setString(1, categoria);
                ResultSet rs = pstmtSelect.executeQuery();

                if (!rs.next()) {
                    pstmtInsert.setString(1, categoria);
                    pstmtInsert.setString(2, fecha);
                    pstmtInsert.executeUpdate();
                    System.out.println("Categoría insertada.");
                }
            }
        }
    }

    public static void insertarGasto(Connection conn, double valor, boolean gravadoIva, String cedPersona,
                                     String nombreCategoria, String fechaHora) throws SQLException {

        String sqlSelectCategoria = "SELECT idCategoria FROM CATEGORIA WHERE nombre = ?";
        String sqlInsertGasto = "INSERT INTO GASTO (valor, fechaHora, gravadoIva, cedPersona, idCategoria) VALUES (?, ?, ?, ?, ?)";

        try (PreparedStatement pstmtSelect = conn.prepareStatement(sqlSelectCategoria);
             PreparedStatement pstmtInsert = conn.prepareStatement(sqlInsertGasto)) {

            pstmtSelect.setString(1, nombreCategoria);
            ResultSet rs = pstmtSelect.executeQuery();

            int idCategoria = 0;

            if (rs.next()) {
                idCategoria = rs.getInt("idCategoria");
            }
            pstmtInsert.setDouble(1, valor);
            pstmtInsert.setString(2, fechaHora);
            pstmtInsert.setBoolean(3, gravadoIva);
            pstmtInsert.setString(4, cedPersona);
            pstmtInsert.setInt(5, idCategoria);

            pstmtInsert.executeUpdate();
            System.out.println("Gasto insertado correctamente.");
        }
    }




}

