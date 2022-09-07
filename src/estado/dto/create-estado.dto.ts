import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEstadoDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @IsString({ message: "O 'nome' deve ser um texto." })
    nome: string;

    @IsNotEmpty({ message: "A 'sigla' deve ser informada." })
    @IsString({ message: "A 'sigla' deve ser um texto." })
    sigla: string;

    @IsNotEmpty({ message: "A 'população' deve ser informada." })
    @IsNumber({allowInfinity: false, maxDecimalPlaces: 0},{ message: "A 'população' deve ser um número inteiro. "})
    populacao: number;
}
