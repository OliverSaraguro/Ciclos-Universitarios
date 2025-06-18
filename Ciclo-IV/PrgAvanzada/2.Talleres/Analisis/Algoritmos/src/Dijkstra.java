import java.io.*;
import java.util.*;

public class Dijkstra {
    public static void main(String[] args) {
        Grafo grafo = leerGrafoDesdeArchivo("/Users/oliversaraguro/Downloads/GrafoDirigido.txt");
        int nodoInicial = obtenerNodoInicial(grafo);
        Map<Integer, Integer> distancias = dijkstra(grafo, nodoInicial);
        guardarResultadoEnArchivo(distancias, nodoInicial, "/Users/oliversaraguro/Downloads/resultado_dijkstra.txt");
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
    public static void guardarResultadoEnArchivo(Map<Integer, Integer> distancias, int nodoInicial, String nombreArchivo) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(nombreArchivo))) {
            writer.println("Resultados del algoritmo de Dijkstra:");
            writer.printf("Nodo inicial: %d%n%n", nodoInicial);
            writer.println("Distancias más cortas desde el nodo inicial a cada nodo:");
            for (Map.Entry<Integer, Integer> entrada : distancias.entrySet()) {
                int nodo = entrada.getKey();
                int distancia = entrada.getValue();
                if (distancia == Integer.MAX_VALUE) {
                    writer.printf("Nodo %d: No alcanzable%n", nodo);
                } else {
                    writer.printf("Nodo %d: %d%n", nodo, distancia);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // METODO
    public static Map<Integer, Integer> dijkstra(Grafo grafo, int nodoInicial) {
        Map<Integer, Integer> distancias = new HashMap<>();
        PriorityQueue<Nodo> cola = new PriorityQueue<>();

        for (int nodo : grafo.adyacencias.keySet()) {
            distancias.put(nodo, Integer.MAX_VALUE);
        }
        distancias.put(nodoInicial, 0);
        cola.offer(new Nodo(nodoInicial, 0));

        while (!cola.isEmpty()) {
            Nodo nodoActual = cola.poll();
            int id = nodoActual.id;
            int distancia = nodoActual.distancia;

            if (distancia > distancias.get(id)) {
                continue;
            }

            for (Map.Entry<Integer, Integer> vecino : grafo.adyacencias.get(id).entrySet()) {
                int idVecino = vecino.getKey();
                int pesoArista = vecino.getValue();
                int nuevaDistancia = distancia + pesoArista;

                if (nuevaDistancia < distancias.get(idVecino)) {
                    distancias.put(idVecino, nuevaDistancia);
                    cola.offer(new Nodo(idVecino, nuevaDistancia));
                }
            }
        }

        return distancias;
    }

    // CLASE
    public static class Grafo {
        Map<Integer, Map<Integer, Integer>> adyacencias;

        Grafo() {
            adyacencias = new HashMap<>();
        }

        void agregarArista(int origen, int destino, int peso) {
            adyacencias.putIfAbsent(origen, new HashMap<>());
            adyacencias.putIfAbsent(destino, new HashMap<>());
            adyacencias.get(origen).put(destino, peso);
        }
    }

    // CLASE
    public static class Nodo implements Comparable<Nodo> {
        int id;
        int distancia;

        Nodo(int id, int distancia) {
            this.id = id;
            this.distancia = distancia;
        }

        @Override
        public int compareTo(Nodo otro) {
            return Integer.compare(this.distancia, otro.distancia);
        }
    }

    // METODO para obtener nodo inicial del grafo
    public static int obtenerNodoInicial(Grafo grafo) {
        return grafo.adyacencias.keySet().iterator().next();
    }
}