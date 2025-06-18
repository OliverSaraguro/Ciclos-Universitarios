package Hilos;

public class ExactThDoWork {

    public static void main(String[] args) {
        // Imprimir el nombre del hilo.
        System.out.println(Thread.currentThread().getName());
        for (int id = 0; id < 5; id++) {
            ThDoWork thDoWork = new ThDoWork(id);
//            thDoWork.run(); --> Secuencialt
            thDoWork.start(); // paralelo

        }
    }
}
