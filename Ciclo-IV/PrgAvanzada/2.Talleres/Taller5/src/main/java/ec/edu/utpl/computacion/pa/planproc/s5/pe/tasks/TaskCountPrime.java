package ec.edu.utpl.computacion.pa.planproc.s5.pe.tasks;

import java.util.concurrent.Callable;
import java.util.stream.IntStream;

public class TaskCountPrime implements Callable<Boolean> {
//    private List<Integer> nums;
    private int num;

    public TaskCountPrime(int num) {
        this.num = num;
    }

    @Override
    public Boolean call() throws IllegalArgumentException {
        if (
//                algoritmo1(num)
//                algoritmo2(num)
                algoritmo3(num)
        ) {
            return true;
        }
        return false;
    }

    public boolean algoritmo1(int num) {
        return !IntStream.range(2, num).anyMatch(div -> num % div == 0);
    }

    public boolean algoritmo2(int num) {
        return !IntStream.rangeClosed(2, num / 2).anyMatch(div -> num % div == 0);
    }

    public boolean algoritmo3(int num) {
        if (num <= 1) {
            return false;
        }
        for (int i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0) {
                return false;
            }
        }
        return true;
    }
}