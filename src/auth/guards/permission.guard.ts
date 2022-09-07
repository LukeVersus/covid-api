import { CanActivate, ExecutionContext, mixin, Type, UnauthorizedException } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Permission } from 'src/permission/entities/permission.entity';
 
const PermissionGuard = (permission: any, allowContext: boolean = false): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<any> {
      const returnData = await super.canActivate(context);

      if (!returnData) {
        throw new UnauthorizedException('Não foi possível verificar autorização do Usuário.');        
      }
      
      // Armazena dados da requisição
      const request = context.switchToHttp().getRequest();
      // Armazena dados do usuario da requisição
      const usuario: Usuario = request.user;
      // Armazena parametros enviados na rota da requisição
      const params = request.params;
      // Armazena lista de permissões do usuário
      const permissions: Permission[] = usuario?.perfil.permission;

      // Verifica se o usuario tem permissão para acessar a rota
			if (!(permissions.some(p => p.nome == permission)) && !(allowContext == true && params?.idPublic == usuario.idPublic)) {
        // Retorna mensagem de erro
        throw new UnauthorizedException('Usuário sem autorização.');
      }
      
      // Retorna true para sucesso
      return returnData;
    }
  }
	
  return mixin(PermissionGuardMixin);
}
 
export default PermissionGuard;