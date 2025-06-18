package DataRaceCondition;

public class RunCounter{
    public static void main(String[] args){
        var counter = new Counter();

        for(var i = 0; i < 10; i++){
            new Thread(() -> {
                counter.increment();
                System.out.printf("valor para %s - %d\n",
                        Thread.currentThread().getName(),
                        counter.getCount()
                );
            }).start();
        }
    }
}
