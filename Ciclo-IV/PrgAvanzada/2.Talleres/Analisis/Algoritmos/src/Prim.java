import java.io.*;
import java.util.*;

public class Prim {

    public static void main(String[] args) {
        Grafo grafo = leerGrafoDesdeArchivo("/Users/oliversaraguro/Downloads/GrafoNoDirigido.txt");
        List<Arista> arbolExpansionMinima = prim(grafo);
        guardarResultadoEnArchivo(arbolExpansionMinima, "/Users/oliversaraguro/Downloads/resultado_prim.txt");
    }

    // METODO
    public static Grafo leerGrafoDesdeArchivo(String rutaArchivo) {
        Grafo grafo = new Grafo();

        try (BufferedReader br = new BufferedReader(new FileReader(rutaArchivo))) {
            String linea;
            while ((linea = br.readLine()) != null) {
                String[] partes = linea.split(",");
                int origen = Integer.parseInt(partes[0].trim());
                int destino = Integer.parseInt(partes[1].trim());
                int peso = Integer.parseInt(partes[2].trim());
                grafo.agregarArista(origen, destino, peso);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return grafo;
    }

    // METODO
    public static void guardarResultadoEnArchivo(List<Arista> arbolExpansionMinima, String nombreArchivo) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(nombreArchivo))) {
            writer.println("Árbol de Expansión Mínima (Algoritmo de Prim):");
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
    public static List<Arista> prim (Grafo grafo) {
        Set<Integer> visitado = new HashSet<>();
        List<Arista> resultado = new ArrayList<>();
        PriorityQueue<Arista> colaPrioridad = new PriorityQueue<>();

        // Empezar con el primer nodo del grafo
        int nodoInicial = grafo.adyacencias.keySet().iterator().next();
        visitado.add(nodoInicial);
        colaPrioridad.addAll(grafo.adyacencias.get(nodoInicial));

        while (!colaPrioridad.isEmpty()) {
            Arista arista = colaPrioridad.poll();
            if (visitado.contains(arista.destino)) continue;

            visitado.add(arista.destino);
            resultado.add(arista);

            for (Arista adyacente : grafo.adyacencias.get(arista.destino)) {
                if (!visitado.contains(adyacente.destino)) {
                    colaPrioridad.add(adyacente);
                }
            }
        }

        return resultado;
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
    public static class Grafo {
        Map<Integer, List<Arista>> adyacencias;

        Grafo() {
            adyacencias = new HashMap<>();
        }

        void agregarArista(int origen, int destino, int peso) {
            adyacencias.putIfAbsent(origen, new ArrayList<>());
            adyacencias.putIfAbsent(destino, new ArrayList<>());
            adyacencias.get(origen).add(new Arista(origen, destino, peso));
            adyacencias.get(destino).add(new Arista(destino, origen, peso));
        }
    }

}