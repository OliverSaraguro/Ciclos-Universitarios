package Hilos;

// Alternativa 1: Herencia de la clase Threas

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;


// Clase Thread es propia de java
public class ThDoWork extends Thread{
    /*
     Dentro de este metodo se ejecuta tod el hilo
     Este metodo no devulve nada
     */
    private static TimeUnit time = TimeUnit.SECONDS;
    private int id;

    public ThDoWork(int id) {
        this.id = id;
    }

    public void run() {
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