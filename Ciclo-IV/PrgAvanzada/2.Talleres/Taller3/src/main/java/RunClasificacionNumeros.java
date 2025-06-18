import java.util.List;

public class RunClasificacionNumeros {
    public static void main(String[] args) {

        List<Integer> nums = List.of(1, 6, 10561, 13, 28, 100, 496, 1000, 2000, 17, 101, 202,
                1804, 1928, 31, 63, 10, 12, 12001, 33333, 8128);


//        List<Integer> nums2 = IntStream.generate(() -> ThreadLocalRandom.current().nextInt(1, 100_000))
//                .limit(24)
//                .boxed()
//                .toList();


        ClasificacionNumeros app = new ClasificacionNumeros(nums);
        new Thread(app).start();
    }
}
