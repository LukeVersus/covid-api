import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class UpdateStatusUsuarioDto {
  @IsNotEmpty({ message: "O 'ativo' deve ser informado." })
  @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
  ativo: boolean;

  @IsNotEmpty({ message: "O 'updateBy' deve ser informado." })
  @IsString({ message: "O 'updateBy' deve ser uma string." })
  updateBy: string;
}