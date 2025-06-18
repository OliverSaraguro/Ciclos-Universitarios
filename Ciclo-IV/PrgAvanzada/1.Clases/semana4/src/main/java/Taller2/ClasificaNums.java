package Clases.semana4.src.main.java.Taller2;

import java.util.List;
import java.util.stream.IntStream;

public abstract class ClasificaNums implements Runnable{

    private final List<Integer> nums;
    public long counter;

    public ClasificaNums(List<Integer> nums) {
        this.nums = nums;
    }

    private static IntStream getDivPropios(Integer num){
        return IntStream.range(1,num)
                .filter(div -> num % div == 0);
    }

    public static long SumDivPropios(Integer num){
        return getDivPropios(num).sum();
    }

    public List<Integer> getNums() {
        return nums;
    }

    public long getCounter() {
        return counter;
    }
}
