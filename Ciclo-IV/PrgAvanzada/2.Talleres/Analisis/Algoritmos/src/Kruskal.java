import java.io.*;
import java.util.*;

public class Kruskal {

    public static void main(String[] args) {
        List<Arista> aristas = leerGrafoDesdeArchivo("/Users/oliversaraguro/Downloads/GrafoNoDirigido.txt");
        List<Arista> arbolExpansionMinima = kruskal(aristas);
        guardarResultadoEnArchivo(arbolExpansionMinima, "/Users/oliversaraguro/Downloads/resultado_kruskal.txt");
    }

    // METODO
    public static List<Arista> leerGrafoDesdeArchivo(String rutaArchivo) {
        List<Arista> aristas = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(rutaArchivo))) {
            String linea;
            while ((linea = br.readLine()) != null) {
                String[] partes = linea.split(",");
                int origen = Integer.parseInt(partes[0].trim());
                int destino = Integer.parseInt(partes[1].trim());
                int peso = Integer.parseInt(partes[2].trim());
                aristas.add(new Arista(origen, destino, peso));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return aristas;
    }

    // METODO
    public static void guardarResultadoEnArchivo(List<Arista> arbolExpansionMinima, String nombreArchivo) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(nombreArchivo))) {
            writer.println("Árbol de Expansión Mínima (Algoritmo de Kruskal):");
            int costoTotal = 0;
            for (Arista arista : arbolExpansionMinima) {
                writer.printf("Arista: %d - %d, Peso: %d%n", arista.origen, arista.destino, arista.peso);
                costoTotal += arista.peso;
            }
            writer.printf("Costo total del árbol de expansión mínima: %d%n", costoTotal);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // METODO
    public static List<Arista> kruskal(List<Arista> aristas) {
        Collections.sort(aristas);
        ConjuntoDisjunto conjuntos = new ConjuntoDisjunto();
        List<Arista> arbolExpansionMinima = new ArrayList<>();

        for (Arista arista : aristas) {
            int compuOrigen = conjuntos.buscar(arista.origen);
            int compvDestino = conjuntos.buscar(arista.destino);

            if (compuOrigen != compvDestino) {
                arbolExpansionMinima.add(arista);
                conjuntos.unir(compuOrigen, compvDestino);
            }
        }

        return arbolExpansionMinima;
    }

    // CLASE
    public static class Arista implements Comparable<Arista> {
        int origen, destino, peso;

        Arista(int origen, int destino, int peso) {
            this.origen = origen;
            this.destino = destino;
            this.peso = peso;
        }

        @Override
        public int compareTo(Arista otra) {
            return this.peso - otra.peso;
        }
    }

    // CLASE
    public static class ConjuntoDisjunto {
        Map<Integer, Integer> padre;
        Map<Integer, Integer> rango;

        ConjuntoDisjunto() {
            padre = new HashMap<>();
            rango = new HashMap<>();
        }

        void makeSet(int i) {
            if (!padre.containsKey(i)) {
                padre.put(i, i);
                rango.put(i, 0);
            }
        }

        int buscar(int i) {
            if (!padre.containsKey(i)) {
                makeSet(i);
            }
            if (padre.get(i) != i) {
                padre.put(i, buscar(padre.get(i)));
            }
            return padre.get(i);
        }

        void unir(int x, int y) {
            int raizX = buscar(x);
            int raizY = buscar(y);

            if (raizX != raizY) {
                if (rango.get(raizX) < rango.get(raizY)) {
                    padre.put(raizX, raizY);
                } else if (rango.get(raizX) > rango.get(raizY)) {
                    padre.put(raizY, raizX);
                } else {
                    padre.put(raizY, raizX);
                    rango.put(raizX, rango.get(raizX) + 1);
                }
            }
        }
    }
}