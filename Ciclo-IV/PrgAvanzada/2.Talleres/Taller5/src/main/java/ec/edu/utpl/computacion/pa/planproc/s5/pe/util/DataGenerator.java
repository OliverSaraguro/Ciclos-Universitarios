package ec.edu.utpl.computacion.pa.planproc.s5.pe.util;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class DataGenerator {

    public static List<Integer> loadFromFile() throws IOException {
        try(InputStream resource = DataGenerator.class.getClassLoader().getResourceAsStream("5milNums.txt");
            InputStreamReader ioStreamReader = new InputStreamReader(resource, StandardCharsets.UTF_8);
            BufferedReader bufferedReader = new BufferedReader(ioStreamReader)
        ) {
            return bufferedReader.lines()
                    .map(Integer::parseInt)
                    .toList();
        }
    }

//    public static List<Integer> generateTestData() {
//        return List.of(1, 6, 10561, 13, 28, 100, 496, 1000, 2000, 17,
//                       101, 202, 1804, 1928, 31, 63, 10, 12, 12001, 33333, 8128);
//    }
    
}