package ejercicios;

public class principal {
    public static void main(String[] args) {

        int[][] matriz = {
                {60, 100, 6, 8},
                {4, 100, 60, 5},
                {60, 100, 16, 601}
        };



        int totalNumbers = matriz.length * matriz[0].length;
        int count = 0;

        ExecutorService executor = Executors.newFixedThreadPool(matriz.length);

        for (int i = 0; i < matriz.length; i++) {
            executor.execute(new FactorizationTask(matriz[i]));
        }

        executor.shutdown();

        while (!executor.isTerminated()) {
            // Espera a que todos los hilos terminen
        }

        count = FactorizationTask.getCount();

        System.out.println("Total de números en la matriz: " + totalNumbers);
        System.out.println("Total de números con factores primos de multiplicidad uno: " + count);
    }
}
