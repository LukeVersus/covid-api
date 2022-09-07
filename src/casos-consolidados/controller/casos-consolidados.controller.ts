import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CasosConsolidadosService } from '../service/casos-consolidados.service';
import { CreateCasosConsolidadoDto } from '../dto/create-casos-consolidado.dto';
import { UpdateCasosConsolidadoDto } from '../dto/update-casos-consolidado.dto';

@Controller('casos-consolidados')
export class CasosConsolidadosController {
  constructor(private readonly casosConsolidadosService: CasosConsolidadosService) {}

  @Post()
  create(@Body() createCasosConsolidadoDto: CreateCasosConsolidadoDto) {
    return this.casosConsolidadosService.create(createCasosConsolidadoDto);
  }

  @Get()
  findAll() {
    return this.casosConsolidadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casosConsolidadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCasosConsolidadoDto: UpdateCasosConsolidadoDto) {
    return this.casosConsolidadosService.update(+id, updateCasosConsolidadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.casosConsolidadosService.remove(+id);
  }
}
