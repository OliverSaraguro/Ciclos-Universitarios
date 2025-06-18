import java.util.List;

public class ClasificacionNumeros implements Runnable {

    private final List<Integer> nums;
    private int perfecto, abundante, deficiente;

    public ClasificacionNumeros(List<Integer> nums) {
        this.nums = nums;
    }

    @Override
    public void run() {
        for (int num : nums) {
            String tipo = clasificarTipo(num);
            contador(tipo);
        }

        System.out.printf("Perfecto: %d\nAbundante: %d\nDeficiente: %d\n",
                perfecto, abundante, deficiente);
    }

    public void contador(String tipo) {
        switch (tipo) {
            case "Perfecto":
                perfecto++;
                break;
            case "Abundante":
                abundante++;
                break;
            case "Deficiente":
                deficiente++;
                break;
        }
    }

    public static String clasificarTipo(int num) {
        int suma = clasificarNumeros(num);
        if (suma == num) {
            return "Perfecto";
        } else if (suma > num) {
            return "Abundante";
        } else {
            return "Deficiente";
        }
    }

    public static int clasificarNumeros(int num) {
        int suma = 0;
        for (int i = 1; i < num; i++) {
            if (num % i == 0) {
                suma += i;
            }
        }
        return suma;
    }
}