import java.util.Arrays;

public class Principal {
    public static void main(String[] args) throws InterruptedException {
        int[][] matriz = {{2, 8, 21, 33},
                {53, 77, 101, 117},
                {419, 477, 503, 601}};

        NumeroPrimo [] contador = new NumeroPrimo[matriz.length];

        for (int row = 0; row < matriz.length; row++) {
            contador[row] = new NumeroPrimo(matriz[row]);
            System.out.println(Thread.currentThread().getName() + ": " + contador[row]);
            contador[row].start();
        }

        int suma = 0;
        for (int i = 0; i < contador.length; i++) {
            contador[i].join();
            suma = suma + contador[i].getContador();
        }

        System.out.println("Salida: " + suma);
    }
}




