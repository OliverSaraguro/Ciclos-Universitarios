package ec.edu.utpl.computacion.pa.planproc.s5.pe.exes;

import ec.edu.utpl.computacion.pa.planproc.s5.pe.tasks.TaskCountPrime;
import ec.edu.utpl.computacion.pa.planproc.s5.pe.util.DataGenerator;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.RunnerException;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class AppExec {
    // Número de hilos igual al número de procesadores disponibles
    private static int numHilos = Runtime.getRuntime().availableProcessors();
    // Lista de números cargados desde un archivo
    private static List<Integer> dato;

    // Bloque estático para inicializar la lista 'dato' desde un archivo
    static {
        try{
            dato = DataGenerator.loadFromFile();
        }catch (IOException e){
            throw new RuntimeException(e);
        }
    }

    // Método principal para ejecutar el benchmark
    public static void main(String[] args) throws RunnerException {
        // Configuración de opciones para JMH
        Options opt = new OptionsBuilder()
                .include(AppExec.class.getSimpleName()) // Incluir esta clase en el benchmark
                .forks(1) // Limpiar el proceso de benchmark
                .build(); // Finalizar la configuración
        new Runner(opt).run(); // Ejecutar los benchmarks configurados
    }

    @Benchmark
    @BenchmarkMode(Mode.AverageTime)
    @Warmup(iterations = 5, time = 10, timeUnit = TimeUnit.SECONDS) // Calentamiento
    @Measurement(iterations = 5, time = 10, timeUnit = TimeUnit.SECONDS) // Inicio o prueba
    @OutputTimeUnit(TimeUnit.MICROSECONDS)
    public static void execWorkSeveralThreadsListNums() {
        ExecutorService executorService = Executors.newFixedThreadPool(numHilos);
        List<Future<Boolean>> futures = new ArrayList<>();
        for (var num : dato) {
            TaskCountPrime taskCountPrime = new TaskCountPrime(num);
            futures.add(executorService.submit(taskCountPrime));
        }

        try {
            for(Future<Boolean> future : futures) {
                future.get();
            }
        } catch (InterruptedException | ExecutionException _) {
        }
        executorService.shutdown();
    }

}