package DataRaceCondition;

public class Counter{
    private int count;
    public synchronized void increment(){
        try{
            Thread.sleep(100);
        } catch (InterruptedException ie){}
        //Esta es la que es compartida y la que causa erro ya que todos la sobreescriben
        count ++;
    }

    public int getCount(){
        return count;
    }
}