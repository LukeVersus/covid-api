import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from '../service/permission.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import PermissionsPermission from '../enums/permissionsPermission.enum';
import PermissionGuard from 'src/auth/guards/permission.guard';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Permission } from '../entities/permission.entity';
import { FindOneParams } from 'src/utils/findOne.params';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(PermissionsPermission.LER_PERMISSIONS))
  async findAll(): Promise<ResponseGeneric<Permission[]>> {
    // Chama método de listagem de todas as funcionalidades
    return await this.permissionService.findAll();
  }

  @Get(':idPublic')
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(PermissionsPermission.LER_PERMISSIONS))
  async findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Permission>> {
    // Chama método que busca funcionalidade por idPublic
    return await this.permissionService.findOne(idPublic);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
