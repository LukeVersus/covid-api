import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EstadoService } from '../service/estado.service';
import { CreateEstadoDto } from '../dto/create-estado.dto';
import { UpdateEstadoDto } from '../dto/update-estado.dto';
import EstadoPermission from '../enums/estadoPermission.enum';
import PermissionGuard from 'src/auth/guards/permission.guard';

@Controller('estado')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @UseGuards(PermissionGuard(EstadoPermission.MODIFICAR_ESTADO))
  @Post()
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadoService.create(createEstadoDto);
  }

  @Get()
  findAll() {
    return this.estadoService.findAll();
  }

  @Get('sigla/:sigla')
  async findBySigla(@Param('sigla') sigla: string) {
    return await this.estadoService.findBySigla(sigla);
  }

  @Get(':idPublic')
  findOne(@Param('idPublic') idPublic: string) {
    return this.estadoService.findOne(idPublic);
  }

  @UseGuards(PermissionGuard(EstadoPermission.MODIFICAR_ESTADO))
  @Patch(':idPublic')
  update(@Param('idPublic') idPublic: string, @Body() updateEstadoDto: UpdateEstadoDto) {
    return this.estadoService.update(idPublic, updateEstadoDto);
  }

  @UseGuards(PermissionGuard(EstadoPermission.MODIFICAR_ESTADO))
  @Delete(':idPublic')
  remove(@Param('idPublic') idPublic: string) {
    return this.estadoService.remove(idPublic);
  }
}
