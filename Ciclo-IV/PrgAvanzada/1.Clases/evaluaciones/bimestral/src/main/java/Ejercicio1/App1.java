package Ejercicio1;

import java.util.concurrent.Callable;

public class App1 implements Callable<Double> {

    private long intervals;

    public App1(long intervals) {
        this.intervals = intervals;
    }

    @Override
    public Double call() throws Exception {

        if(intervals % 2 != 0){
            throw new IllegalArgumentException("El # debe ser par.");
        }

        double a = 0.0;
        double b = 1.0;
        double h = (b - a) / intervals;
        double sum = f(a) + f(b);

        for(int i = 1; i <= intervals; i++){
            sum += 4 * f(a + i * h);
        }

        for(int i = 2; i < intervals-1; i+=2){
            sum += 2 * f(a + i * h);
        }

        return (h / 3) * sum;
    }

    public static double f(double x){
        return 4.0 / (1 + x + x);
    }
}
