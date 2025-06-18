package DataRaceCondition;

import java.util.concurrent.atomic.AtomicInteger;

public class Counter3 {
    private final AtomicInteger count;

    public Counter3() {
        this.count = new AtomicInteger(0);
    }

    public int increment(){
        try{
            Thread.sleep(100);
        } catch (InterruptedException ie){}
        // Incrementa el valor y devuelve
        return count.incrementAndGet();
    }

}
