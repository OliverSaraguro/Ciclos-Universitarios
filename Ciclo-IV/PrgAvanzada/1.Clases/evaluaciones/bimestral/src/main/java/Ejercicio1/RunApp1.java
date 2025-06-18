package Ejercicio1;

import org.openjdk.jmh.annotations.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class RunApp1 {
    private static Long intervals = 1_000_000_000L;
    private static int  nmrThread = 8;

    public static void main(String[] args) throws IOException {
        org.openjdk.jmh.Main.main(args);
    }


    @Benchmark
    @BenchmarkMode(Mode.AverageTime)
    @Warmup(iterations = 5, time = 10,timeUnit = TimeUnit.MILLISECONDS)
    @Measurement(iterations = 5, time = 10,timeUnit = TimeUnit.MILLISECONDS)
    @OutputTimeUnit(TimeUnit.SECONDS)
    public static void ececutorsCalcularPI() throws ExecutionException, InterruptedException {
        long nmroPartes = intervals / nmrThread;

        ExecutorService executorService = Executors.newFixedThreadPool(nmrThread);
        List<Future<Double>> futures = new ArrayList<>();
        for (int i = 1; i < nmrThread; i++) {
            futures.add(executorService.submit(new App1(nmroPartes)));
        }

        for (Future<Double> future : futures) {
            System.out.println(future.get());
        }

        executorService.shutdown();
    }

}
