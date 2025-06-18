
package prueba;
import org.openjdk.jmh.annotations.Benchmark;

import java.io.IOException;

public class App {
    public static void main(String[] args) throws IOException {
        org.openjdk.jmh.Main.main(args);
    }

    @Benchmark
    public void doSomething() {

    }
}
