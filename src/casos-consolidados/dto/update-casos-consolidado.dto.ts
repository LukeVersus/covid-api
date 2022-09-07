import { PartialType } from '@nestjs/swagger';
import { CreateCasosConsolidadoDto } from './create-casos-consolidado.dto';

export class UpdateCasosConsolidadoDto extends PartialType(CreateCasosConsolidadoDto) {}
