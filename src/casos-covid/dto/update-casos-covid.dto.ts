import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateCasosCovidDto } from './create-casos-covid.dto';

export class UpdateCasosCovidDto extends PartialType(CreateCasosCovidDto) {
    @IsOptional()
    @IsString({ message: "O 'createBy' deve ser uma string." })
    updatedBy: string;
}
