import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CasosCovidService } from '../service/casos-covid.service';
import { CreateCasosCovidDto } from '../dto/create-casos-covid.dto';
import { UpdateCasosCovidDto } from '../dto/update-casos-covid.dto';
import CasosCovidPermission from '../enums/casosCovidPermission.enum';
import PermissionGuard from 'src/auth/guards/permission.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Casos-Covid')
@Controller('casos-covid')
export class CasosCovidController {
  constructor(private readonly casosCovidService: CasosCovidService) {}

  @ApiBearerAuth('access_token')
  @Post()
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(CasosCovidPermission.MODIFICAR_CASOS))
  create(@Body() body: CreateCasosCovidDto) {
    return this.casosCovidService.create(body);
  }

  @Get('page/:page/size/:size')
  findAll(@Param('page') page: number, @Param('size') size: number) {
    return this.casosCovidService.findAll(page, size);
  }

  @Get('estado/:idPublic/page/:page/size/:size')
  findAllByEstado(@Param('idPublic') idPublic: string, @Param('page') page: number, @Param('size') size: number) {
    return this.casosCovidService.findAllByEstado(idPublic, page, size);
  }

  @Get(':idPublic')
  findOne(@Param('idPublic') idPublic: string) {
    return this.casosCovidService.findOne(idPublic);
  }

  @Get('estado/:idPublic')
  findLastOneByEstado(@Param('idPublic') idPublic: string) {
    return this.casosCovidService.findLastOneByEstado(idPublic);
  }

  @ApiBearerAuth('access_token')
  @Patch(':idPublic')
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(CasosCovidPermission.MODIFICAR_CASOS))
  update(@Param('idPublic') idPublic: string, @Body() updateCasosCovidDto: UpdateCasosCovidDto) {
    return this.casosCovidService.update(idPublic, updateCasosCovidDto);
  }

  @ApiBearerAuth('access_token')
  @Delete(':idPublic')
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(CasosCovidPermission.MODIFICAR_CASOS))
  remove(@Param('idPublic') idPublic: string) {
    return this.casosCovidService.remove(idPublic);
  }
}
