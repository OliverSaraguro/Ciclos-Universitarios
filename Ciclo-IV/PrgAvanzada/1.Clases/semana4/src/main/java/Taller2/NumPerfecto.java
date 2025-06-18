package Clases.semana4.src.main.java.Taller2;

import java.util.List;

public class NumPerfecto extends ClasificaNums {

    public NumPerfecto(List<Integer> nums) {
        super(nums);
    }

    @Override
    public void run() {
        System.out.println(
                Thread.currentThread().getName() + " " + getNums().stream()
                        .filter(num -> num == SumDivPropios(num))
                        .count()
        );
    }
}
