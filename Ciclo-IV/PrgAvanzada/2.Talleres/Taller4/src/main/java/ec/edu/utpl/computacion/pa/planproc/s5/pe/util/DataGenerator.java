package ec.edu.utpl.computacion.pa.planproc.s5.pe.util;

import org.springframework.util.ResourceUtils;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class DataGenerator {

    public static List<Integer> loadFromFile() throws IOException, URISyntaxException {
        var resources = ResourceUtils.getURL("classpath:5milNums.txt");
        return Files.readAllLines(Paths.get(resources.toURI()))
                .stream()
                .map(Integer::parseInt)
                .toList();
    }

    public static List<Integer> generateTestData() {
        return List.of(1, 6, 10561, 13, 28, 100, 496, 1000, 2000, 17,
                       101, 202, 1804, 1928, 31, 63, 10, 12, 12001, 33333, 8128);
    } 
    
}