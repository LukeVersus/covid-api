import { PickType } from '@nestjs/swagger';
import { IsCPF } from 'brazilian-class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';

export class CpfDto {
	@IsNotEmpty({ message: "O 'cpf' deve ser informada." })
	@IsCPF({ message: "O 'cpf' deve ser valido." })
	cpf: string;
}
