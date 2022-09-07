import { IsCPF } from "brazilian-class-validator";
import { Type } from "class-transformer";
import { ArrayMinSize, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { Perfil } from "src/perfil/entities/perfil.entity";
import { IdDto } from "src/utils/id.dto";

export class CreateUsuarioDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @MinLength(4, { message: "O 'nome' deve ser valido." })
    nome: string;

    @IsNotEmpty({ message: "O 'e-mail' deve ser informado." })
    @IsEmail({}, { message: "O 'e-mail' deve ser valido." })
    email: string;

    @IsNotEmpty({ message: "O 'CPF' deve ser informado." })
    @IsCPF({ message: "O 'CPF' deve ser valido." })
    cpf: string;

    @IsNotEmpty({ message: "A 'senha' deve ser informada." })
    @IsString({ message: "A 'senha' deve ser uma string." })
    senha: string;

    @IsOptional()
    @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
    ativo: boolean;

    @IsNotEmpty({ message: "O 'perfil' deve ser informado." })
    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'perfil' deve ser informado." })
    perfil: Perfil;

    @IsString({ message: "O 'createBy' deve ser uma string." })
    @IsNotEmpty({ message: "O 'createBy' deve ser informado." })
    createBy: string;

    @IsOptional()
    updateBy: string;
}
