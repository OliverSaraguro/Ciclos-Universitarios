public class HiloHerencia extends Thread{

    private int [] fila;
    private String nombre;
    private int suma;

    public HiloHerencia(int [] fila) {
        this.fila = fila;

    }

    @Override
    public void run() {
//        int suma = 0;
        nombre = getName(); // Cuando se aplica de esta manera se puede llamar al metodo getName() directo
        for (int i = 0; i < fila.length; i++) {
           suma += fila[i];
        }
//        System.out.printf("Hilo: %s, Suma de los filas: %d\n", nombre, suma);
    }

    public int getSuma() {
        return suma;
    }

    public String getNombre() {
        return nombre;
    }


}
