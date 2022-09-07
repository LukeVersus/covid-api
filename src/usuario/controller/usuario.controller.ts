import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuarioService } from '../service/usuario.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { IdDto } from 'src/utils/id.dto';
import PermissionGuard from 'src/auth/guards/permission.guard';
import UsuarioPermission from '../enums/usuarioPermission.enum';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Usuario } from '../entities/usuario.entity';
import { FindOneParams } from 'src/utils/findOne.params';
import { UpdateUsuarioSelfDto } from '../dto/update-usuario-self.dto';
import { UpdatePassDto } from '../dto/update-pass.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access_token')
@ApiTags('Usuário')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO, false))
  async create(@Body() body: CreateUsuarioDto): Promise<ResponseGeneric<Usuario>> {
    // Chama método de cadastro de novo usuário
    return await this.usuarioService.create(body);
  }

  @Get()
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(UsuarioPermission.LER_USUARIO, false))
  async findAll(): Promise<ResponseGeneric<Usuario[]>> {
    // Chama método de listagem de todos os usuários que sejam do perfil 'ADMIN'
    return await this.usuarioService.findAll();
  }

  @Get(':idPublic')
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(UsuarioPermission.LER_USUARIO, true))
  findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Usuario>> {
    // Chama método que busca usuário por idPublic que seja do perfil 'ADMIN'
    return this.usuarioService.findOne(idPublic);
  }

  @Patch(':idPublic')
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO, false))
  async update(@Param() {idPublic}: FindOneParams, @Body() body: UpdateUsuarioDto, @Body('userToken') userToken: IdDto): Promise<ResponseGeneric<Usuario>> {
    // Chama método que atualiza dados de usuário com o idPublic que seja do perfil 'ADMIN'
    return await this.usuarioService.update(idPublic, body, userToken);
  }

  @Patch(':idPublic/context')
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO, true))
  async updateSelf(@Param() {idPublic}: FindOneParams, @Body() body: UpdateUsuarioSelfDto, @Body('userToken') userToken: IdDto): Promise<ResponseGeneric<Usuario>> {
    // Chama método que atualiza dados de usuário com o idPublic que seja do perfil 'ADMIN'
    return await this.usuarioService.updateSelf(idPublic, body, userToken);
  }

  @Patch('pass/:idPublic')
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO, true))
  async updatePass(@Param() {idPublic}: FindOneParams, @Body() body: UpdatePassDto): Promise<ResponseGeneric<any>> {
    // Chama método que atualiza senha de usuário como idPublico
    return await this.usuarioService.updatePass(idPublic, body);
  }

  @Delete(':idPublic')
  // Verifica autenticidade do token informado e se o usuário tem permissão para realizar a ação
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO, false))
  remove(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Usuario>> {
    // Chama método que deleta usuário por idPublic que não seja do perfil 'RESPONSAVEL'
    return this.usuarioService.remove(idPublic);
  }
}
