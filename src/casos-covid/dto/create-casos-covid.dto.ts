import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CasosConsolidado } from "src/casos-consolidados/entities/casos-consolidado.entity";
import { Estado } from "src/estado/entities/estado.entity";
import { IdDto } from "src/utils/id.dto";

export class CreateCasosCovidDto {
    
    @IsNotEmpty({ message: "Os 'novos casos' devem ser informados." })
    @IsNumber({allowInfinity: false, maxDecimalPlaces: 0},{ message: "Os 'novos casos' devem ser um número inteiro. "})
    novosCasos: number;
    
    @IsNotEmpty({ message: "Os 'casos recuperados' devem ser informados." })
    @IsNumber({allowInfinity: false, maxDecimalPlaces: 0},{ message: "Os 'casos recuperados' devem ser um número inteiro. "})
    recuperados: number;

    @IsNotEmpty({ message: "Os 'casos de morte' devem ser informados." })
    @IsNumber({allowInfinity: false, maxDecimalPlaces: 0},{ message: "Os 'casos de morte' devem ser um número inteiro. "})
    mortes: number;
    
    @IsOptional()
    @Type(() => IdDto)
    consolidados: CasosConsolidado;

    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'estado' deve ser informado." })
    estado: Estado;

    @IsOptional()
    @IsString({ message: "O 'createBy' deve ser uma string." })
    createdBy: string;
}
