import java.util.concurrent.*;

public class ExecTaskParAmigos {
    public static void main(String[] args) {
        Tuple2[] rowDemo = {
                new Tuple2(220, 284),
                new Tuple2(1184, 1210),
                new Tuple2(2620, 2924)
        };


        TaskParNumerosAmigos task = new TaskParNumerosAmigos(rowDemo);
        // Creamos el hilo
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        // Esperamos que todos los hilos terminen el future se encarga de preguntar
        Future<Integer> future = executorService.submit(task);

        try {
            System.out.printf("Existen %d amigos.\n", future.get());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }

        executorService.shutdown();
    }

}
