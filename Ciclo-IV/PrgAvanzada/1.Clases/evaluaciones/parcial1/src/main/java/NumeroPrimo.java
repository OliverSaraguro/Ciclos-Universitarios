public class NumeroPrimo extends Thread {

    int [] fila;
    int contador;

    public NumeroPrimo(int [] fila) {
        this.fila = fila;
    }

    public void run() {
        for (int i = 0; i < fila.length; i++) {
            esPrimoSophieGermain(fila[i]);
        }
    }

    public boolean esPrimo(int num){
        if (num <= 1){
            return false;
        }
        for (int i = 2; i < num; i++){
            if (num % i == 0){
                return false;
            }
        }
        return true;
    }

    public void esPrimoSophieGermain(int n) {
        if (esPrimo(n)) {
            int primoSeguro = 2 * n + 1;
            if (esPrimo(primoSeguro)) {
                contador ++;
            }
        }
    }

    public int getContador() {
        return contador;
    }

}



