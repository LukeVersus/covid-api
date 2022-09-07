import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsCPF } from 'brazilian-class-validator';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioSelfDto extends OmitType(CreateUsuarioDto, ['senha', 'createBy', 'cpf', 'perfil'] as const) {
  @IsNotEmpty({ message: "O 'updateBy' deve ser informado." })
  @IsString({ message: "O 'updateBy' deve ser uma string." })
  updateBy: string;
}
