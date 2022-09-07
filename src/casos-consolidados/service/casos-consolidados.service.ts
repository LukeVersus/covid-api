import { Injectable } from '@nestjs/common';
import { CreateCasosConsolidadoDto } from '../dto/create-casos-consolidado.dto';
import { UpdateCasosConsolidadoDto } from '../dto/update-casos-consolidado.dto';

@Injectable()
export class CasosConsolidadosService {
  create(createCasosConsolidadoDto: CreateCasosConsolidadoDto) {
    return 'This action adds a new casosConsolidado';
  }

  findAll() {
    return `This action returns all casosConsolidados`;
  }

  findOne(id: number) {
    return `This action returns a #${id} casosConsolidado`;
  }

  update(id: number, updateCasosConsolidadoDto: UpdateCasosConsolidadoDto) {
    return `This action updates a #${id} casosConsolidado`;
  }

  remove(id: number) {
    return `This action removes a #${id} casosConsolidado`;
  }
}
