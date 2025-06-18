package Ejercicio2;

import java.util.concurrent.Callable;

public class App2 implements Callable<Double> {

    private long numInteraction;

    public App2(Long numInteraction) {
        this.numInteraction = numInteraction;
    }

    @Override
    public Double call() {
        double pi = 0.0;
        boolean add = true;

        for (int i = 0; i < numInteraction; i++) {
            double term = 1.0 / (2 * i + 1);
            if (add) {
                pi += term;
            }else{
                pi -= term;
            }
            add = !add;
        }
        return pi * 4;
    }
}
