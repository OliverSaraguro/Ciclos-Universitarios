package Hilos;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

// Alternativa 2: Implementar la interfaz Runnable
public class DoWork implements Runnable{
    private static TimeUnit time = TimeUnit.SECONDS;
    private int id;

    public DoWork(int id) {
        this.id = id;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());

        System.out.printf("Work %s started at %s\n",
                id,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));

        try {
            time.sleep(1);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        System.out.printf("Work %s started at %s\n",
                id,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
    }
}
