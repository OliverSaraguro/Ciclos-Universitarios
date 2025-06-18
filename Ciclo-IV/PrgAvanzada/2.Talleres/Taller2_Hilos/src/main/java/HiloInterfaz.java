import java.util.Arrays;

public class HiloInterfaz implements Runnable {
    private int[] fila;
    private int suma = 0;
    private String nombre;

    public HiloInterfaz(int[] fila) {
        this.fila = fila;

    }

    @Override
    public void run() {
        nombre = Thread.currentThread().getName();
        for (int i = 0; i < fila.length; i++) {
            suma += fila[i];
        }
//        System.out.printf("Hilo: %s, Suma de los filas: %d\n", nombre, suma);


        // Usando Prg. Func.
//        suma = Arrays.stream(fila).sum();
//        System.out.printf("%d generate by %s \n", suma, Thread.currentThread().getName());
    }

    public int getSuma() {
        return suma;
    }

    public String getNombre() {
        return nombre;
    }
}
