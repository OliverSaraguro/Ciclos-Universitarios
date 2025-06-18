package Hilos;

public class ExectDoWork {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getName());

        for (int i = 0; i < 5; i++) {

            // Una manera de ejcutar el hilo
//            RunDoWork runDoWork = new RunDoWork(i);
//            // Creamos un hilo
//            Thread thread = new Thread(runDoWork);
//            //
//            thread.start();

            // Segunda manera de ejecutar el hilo
            new Thread(new DoWork(i)).start();
        }
    }
}
