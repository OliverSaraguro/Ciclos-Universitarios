package Ejercicio2;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class RunApp2 {

    private static long numInteraction = 1_000_000_000L;
    private static int nmroThread = 8;

    public static void main(String[] args) throws IOException {
        org.openjdk.jmh.Main.main(args);
    }

    public static void executorApp2() throws ExecutionException, InterruptedException {
        long nmroPartes = numInteraction / nmroThread;

        ExecutorService executorService = Executors.newFixedThreadPool(nmroThread);
        List<Future<Double>> futures = new ArrayList<>();

        for (int i = 0; i < nmroThread; i++) {
            futures.add(executorService.submit(new App2(nmroPartes)));
        }

        for (Future<Double> future : futures) {
            System.out.println(future.get());
        }
        executorService.shutdown();
    }


}
