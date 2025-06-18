import java.util.Arrays;
import java.util.concurrent.TimeUnit;

public class RunHiloInterfaz {
    private static TimeUnit time = TimeUnit.MILLISECONDS;

    public static void main(String[] args) throws InterruptedException {
        int [][] matriz = {{3, 8, 7, 2},{5, 6, 9, 1},{5, 0, 7, 4}};

        HiloInterfaz [] runs = new HiloInterfaz[matriz.length];


        for(int i = 0; i < matriz.length; i++){
            runs[i]= new HiloInterfaz(matriz[i]);
            Thread thread = new Thread(runs[i]);

            thread.start();

        }

//        var sum = Arrays.stream(runs).mapToInt(hiloInterfaz -> hiloInterfaz.getSuma()).sum();
        var sum = Arrays.stream(runs).mapToInt(HiloInterfaz::getSuma).sum(); //referencia de metodos


        System.out.printf("Suma total: %d", sum);

//        for(int i = 0; i < runs.length; i++){
//            System.out.printf("%d generate by %s.\n",
//                    runs[i].getSuma(),
//                    runs[i].getNombre());
//        }
    }
}
