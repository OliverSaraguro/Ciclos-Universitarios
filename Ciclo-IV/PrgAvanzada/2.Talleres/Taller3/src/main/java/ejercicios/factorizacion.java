package ejercicios;

public class factorizacion implements Runnable {

    private int count = 0;
    private int[] row;


    public factorizacion(int[] row) {
        this.row = row;
    }

    @Override
    public void run() {
        for (int i = 1; i < row.length; i++) {
            int multiplicidad = 0;
                while (row[i] % i == 0) {
                    row[i] /= i;
                    multiplicidad++;
                }
                if (multiplicidad == 1) {
                    count++;
                }
            }
        }
    }


    public int getCount() {
        return count;
    }
}

