import java.util.List;
import java.util.concurrent.Callable;
import java.util.stream.IntStream;

public class TaskParNumerosAmigos implements Callable<Integer> {
    private Tuple2[] rowPares;

    public TaskParNumerosAmigos(Tuple2[] rowPares) {
        this.rowPares = rowPares;
    }

    @Override
    public Integer call() throws IllegalArgumentException {
        var result = 0;
        for (var par : rowPares) {
            if(par.numA() > 0 && par.numB() > 0){
                if(par.numA() == sumDivPropios(par.numB()) &&
                        par.numB() == sumDivPropios(par.numA())){
                    result ++;
                }
            }else{
                throw new IllegalArgumentException("Amigos no pueden ser cero");
            }
        }
        return result;
    }

    private int sumDivPropios(int num){
        return IntStream.range(1,num)
                .filter(div -> num % div == 0)
                .sum();
    }

}
