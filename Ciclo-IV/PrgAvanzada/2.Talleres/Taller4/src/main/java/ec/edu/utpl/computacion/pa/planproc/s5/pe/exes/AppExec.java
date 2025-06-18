package ec.edu.utpl.computacion.pa.planproc.s5.pe.exes;

import ec.edu.utpl.computacion.pa.planproc.s5.pe.tasks.TaskCountPrime;
import ec.edu.utpl.computacion.pa.planproc.s5.pe.util.DataGenerator;

import org.springframework.util.StopWatch;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class AppExec {

    public static void main(String[] args) throws IOException, URISyntaxException {
        ExecutorService executorService;
//        List<Integer> data = DataGenerator.generateTestData();
        List<Integer> data = DataGenerator.loadFromFile();

        var numHilos = 1024;
        executorService = severalThreads(numHilos);
        StopWatch cronometer = new StopWatch();
        for(var i = 0; i < 3; i ++) {
            cronometer.start(STR."\{i + 1}.- \{numHilos} hilos \{data.size()} nums");
            action(data, executorService);
            cronometer.stop();
        }
        System.out.println(cronometer.prettyPrint());
        executorService.shutdown();
    }

    private static void action(List<Integer> data, ExecutorService executorService) {
        execWorkSeveralThreadsListNums(data, executorService);
    }

    private static void execWorkSeveralThreadsListNums(List<Integer> nums, ExecutorService executorService) {

        List<Future<Boolean>> futures = new ArrayList<>();
        for (var num : nums) {
            TaskCountPrime taskCountPrime = new TaskCountPrime(num);
            futures.add(executorService.submit(taskCountPrime));
        }
        try {
            for(Future<Boolean> future : futures) {
                future.get();
            }
        } catch (InterruptedException | ExecutionException _) {

        }
    }

    private static ExecutorService severalThreads(int numThreads) {
        return Executors.newFixedThreadPool(numThreads);
    }
}