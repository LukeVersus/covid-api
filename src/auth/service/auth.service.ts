import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './../../usuario/entities/usuario.entity';

import { LoginUsuarioDto } from './../../usuario/dto/login-usuario.dto';

@Injectable()
export class AuthService {
	constructor(
    private jwtService: JwtService,
    private dataSource: DataSource
	) {}

	async validateUser(email: string, senha: string): Promise<any> {
		const usuario = await this.dataSource.getRepository(Usuario).findOne({
			where: {
				email
			},
			select: ['id', 'idPublic', 'nome', 'email', 'cpf', 'senha', 'ativo', 'redefinirPass', 'firstAccess', 'lastAccess', 'perfil', 'createdAt', 'updatedAt'],
			relations: {
				perfil: {
					permission: true
				}
			},
			loadEagerRelations: false
		});
    
		if (!usuario) {
		throw new UnauthorizedException('E-mail e/ou senha incorretos.');
		}

		var body = {
			firstAccess: usuario.firstAccess || new Date(new Date().setHours(new Date().getHours() - 3)),
			lastAccess: new Date(new Date().setHours(new Date().getHours() - 3)),
			updatedAt: usuario.updatedAt
		}

		const usuarioReturn = await bcrypt.compare(senha, usuario.senha).then(async (result) => {
				if (result) {				
					await this.dataSource.getRepository(Usuario).update({ id: usuario.id }, body)

					const user = await this.dataSource.getRepository(Usuario).findOne({
						loadEagerRelations: false,
						where: {
							id: usuario.id
						},
						relations: {
							perfil: {
								permission: true
							}
						}
					});

					return user;
				}
				
			throw new UnauthorizedException('E-mail e/ou senha incorretos.');
		});

		if (!usuario.ativo) {
			throw new UnauthorizedException('Seu usuário está inativo.');
		}
		
		return usuarioReturn;
	}
  
	async login(usuario: LoginUsuarioDto) {
		const usuarioReturn: Usuario = await this.dataSource.getRepository(Usuario).findOne({
			loadEagerRelations: false,
			where: {
				email: usuario.email
			},
			relations: {
				perfil: {
					permission: true
				}
			}
		});

		const payload = { userId: usuarioReturn.id, email: usuario.email };
		
		const token = this.jwtService.sign(payload);
		
		return {
			access_token: token,
			usuario: usuarioReturn
		};
  }
}