import java.util.concurrent.TimeUnit;

public class RunHiloHerencia {
    private static TimeUnit time = TimeUnit.MILLISECONDS;

    public static void main(String[] args) throws InterruptedException {

        int[][] matriz = {{3, 8, 7, 2}, {5, 6, 9, 1}, {5, 0, 7, 4}};

        for (int i = 0; i < matriz.length; i++) {
            HiloHerencia hiloHerencia = new HiloHerencia(matriz[i]);
//            hiloHerencia.run();
            hiloHerencia.start();

            try {
                time.sleep(1);
                System.out.printf("Hilo: %s, Suma de los filas: %d\n",
                        hiloHerencia.getNombre(),
                        hiloHerencia.getSuma());
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

        }
    }
}
