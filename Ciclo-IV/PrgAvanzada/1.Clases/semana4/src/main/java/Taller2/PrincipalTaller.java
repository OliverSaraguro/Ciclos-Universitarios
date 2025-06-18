package Clases.semana4.src.main.java.Taller2.ClasificaNums;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class PrincipalTaller {

    public static void main(String[] args) throws InterruptedException {
//        List<Integer> nums = List.of(1, 6, 10561, 13, 28, 100, 496, 1800, 2000, 17, 101, 202, 2804, 2928,
//                31, 63, 18, 12, 12002, 35553, 8228);

        List<Integer> nums = IntStream.generate(() -> ThreadLocalRandom.current().nextInt(1_000_000, 100_000_000))
                .limit(24)
                .boxed()
                .toList();



        // Crear instancia de NumDeficiente
        ClasificaNums numDeficiente = new NumDeficiente(nums);
        // Crear hilo para los números deficientes
        Thread hiloDeficiente = new Thread(numDeficiente);
        hiloDeficiente.setName("Deficientes-Thread");
        hiloDeficiente.start();

        // Crear instancia de numAbundante
        ClasificaNums numAbundante = new NumAbundante(nums);
        // Crear hilo para los NumDeficientes
        Thread hiloAbundante = new Thread(numAbundante);
        hiloAbundante.setName("Abundante-Thread");
        hiloAbundante.start();

        // Crear instancia de numPerfecto
        ClasificaNums numPerfecto = new NumPerfecto(nums);
        // Crear hilo para los NumPerfectos
        Thread hiloPerfecto = new Thread(numPerfecto);
        hiloPerfecto.setName("Perfecto-Thread");
        hiloPerfecto.start();


    }
}
