package Clases.semana5.src.main.java.DeadLock;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

// Este programa no se va a ejecutar, este es un problema deadLock
// que nunca se va a terminar ya que son dos operaciones que quieren pasar
// al mismo tiempo pero no se ponen de acuerdo.

public class  Example {
    private Lock lock1 = new ReentrantLock(true);
    private Lock lock2 = new ReentrantLock(true);

    public static void main(String[] args) {
        Example deadLock = new Example();
        new Thread(deadLock::operation1,"T1").start();
        new Thread(deadLock::operation2,"T1").start();
    }


    public void operation1(){
        lock1.lock();
        print("Lock 1 adquirido, esperando adquirir lock2");
        sleep(50);

        lock2.lock();
        print("Lock 2 adquirido.");

        print("Ejecutando primera operacion.");
        
        lock2.unlock();
        lock1.unlock();
    }

    public void operation2(){
        lock2.lock();
        print("Lock 2 adquirido, esperando adquirir lock1.");
        sleep(50);

        lock1.lock();

        System.out.println("Ejecutanfo segunda operacion.");

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

}
