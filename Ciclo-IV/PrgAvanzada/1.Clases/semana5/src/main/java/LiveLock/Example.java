package Clases.semana5.src.main.java.LiveLock;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Example {

    private Lock lock1 = new ReentrantLock(true);
    private Lock lock2 = new ReentrantLock(true);

    public static void main(String[] args) {
        Example livelock = new Example();
        new Thread(livelock::operation1, "T1").start();
        new Thread(livelock::operation2, "T2").start();
    }

    public void operation1() {
        while (true){
            tryLock(lock2, 50);
            print("Lock2 adquirido, intentando adquirir Lock1");
            sleep(50);

            if(tryLock(lock1, 50)){ //tryLock(lock1)
                print("Lock2 adquirido");
            }else{
                print("No puedo adquirir Lock2, liberando Lock1");
                lock2.unlock();
                continue;
            }

            print("Ejecutando tarea.");
            break;
        }
        lock2.unlock();
        lock1.unlock();
    }

    public void operation2() {
        while (true){
            tryLock(lock2, 50);
            print("Lock2 adquirido, intentando adquirir Lock1");
            sleep(50);

            if(tryLock(lock1, 50)){ // tryLock(lock1)
                print("Lock1 adquirido");
            }else{
                print("No puedo adquirir Lock1, liberando Lock2");
                lock2.unlock();
                continue;
            }

            print("Ejecutando tarea.");
            break;
        }
        lock1.unlock();
        lock2.unlock();
    }

    public void print(String message){
        System.out.printf("Thread %s: %s\n",
                Thread.currentThread().getName(),
                message);
    }

    public void sleep(long milis){
        try{
            TimeUnit.MILLISECONDS.sleep(milis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    public boolean tryLock(Lock lock, long timeout) {
        try {
            return lock.tryLock(timeout, TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }
}
