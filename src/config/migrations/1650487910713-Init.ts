import {MigrationInterface, QueryRunner} from "typeorm";
import * as bcrypt from 'bcrypt';
import PerfilEnum from "src/perfil/enums/perfil.enum";
import PerfilPermission from "src/perfil/enums/perfilPermission.enum";
import PermissionsPermission from "src/permission/enums/permissionsPermission.enum";
import EstadoPermission from "src/estado/enums/estadoPermission.enum";
import CasosCovidPermission from "src/casos-covid/enums/casosCovidPermission.enum";
import UsuarioPermission from "src/usuario/enums/usuarioPermission.enum";

export class Init1650487910713 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		/** --------------
		@ESTADO
		-------------- */
		// INSERÇÃO DE ESTADOS NA TABELA ESTADO
		await queryRunner.query(`
			INSERT INTO estado (nome, sigla, populacao) VALUES
				('Rondônia', 'RO', 1815278), 
				('Acre', 'AC', 906876), 
				('Amazonas', 'AM', 4269995), 
				('Roraima', 'RR', 652713), 
				('Pará', 'PA', 8777124), 
				('Amapá', 'AP', 877613), 
				('Tocantins', 'TO', 1607363), 
				('Maranhão', 'MA', 7153262), 
				('Piauí', 'PI', 3289290), 
				('Ceará', 'CE', 9240580), 
				('Rio Grande do Norte', 'RN', 3560903), 
				('Paraíba', 'PB', 4059905), 
				('Pernambuco', 'PE', 9674793), 
				('Alagoas', 'AL', 3365351), 
				('Sergipe', 'SE', 2338474), 
				('Bahia', 'BA', 14985284), 
				('Minas Gerais', 'MG', 21411923), 
				('Espirito Santo', 'ES', 4108508), 
				('Rio de Janeiro', 'RJ', 17463349), 
				('São Paulo', 'SP', 46649132), 
				('Paraná', 'PR', 11597484), 
				('Santa Catarina', 'SC', 7338473), 
				('Rio Grande do Sul', 'RS', 11466630), 
				('Mato Grosso do Sul', 'MS', 2839188), 
				('Mato Grosso', 'MT', 3567234), 
				('Goiás', 'GO', 7206589), 
				('Distrito Federal', 'DF', 3094325), 
				('Brasil', 'BR', 213317639)
		`)
			
		/** --------------
		@PERFIL
		-------------- */
		// INSERÇÃO DE PERFIS NA TABELA PERFIL
		await queryRunner.query(`
        INSERT INTO security.perfil (nome, ativo, created_by) VALUES
					('${PerfilEnum.ADMIN}', 'true', 'Lucas Ramos')
		`)


		/** --------------
		@USUÁRIO
		-------------- */
		// CRIA SENHA CRIPTOGRAFADA
		var senha = await bcrypt.hash('@dm1n1str@dor', 12);
		// INSERÇÃO DE USUÁRIO NA TABELA USUARIO
		await queryRunner.query(`
				INSERT INTO security.usuario (nome, email, cpf, senha, fk_perfil, ativo, redefinir_pass, created_by) VALUES
						('Lucas Ramos', 'lvcramos@hotmail.com', '09654744457', '${senha}', (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}'), 'true', 'false', 'Lucas Ramos')
		`)
		
		/** --------------
		@PERMISSION
		-------------- */
		// INSERÇÃO DE PERMISSÕES NA TABELA PERMISSIONS
		await queryRunner.query(`
			INSERT INTO security.permission (nome, descricao, created_by) VALUES
			('${UsuarioPermission.LER_USUARIO}', 'Permite visualizar usuários registrados.', 'Lucas Ramos'),
			('${UsuarioPermission.MODIFICAR_USUARIO}', 'Permite editar, adicionar e excluir usuários registrados.', 'Lucas Ramos'),
			('${PerfilPermission.LER_PERFIL}', 'Permite visualizar perfis registrados.', 'Lucas Ramos'),
			('${PerfilPermission.MODIFICAR_PERFIL}', 'Permite editar, adicionar e excluir perfis registrados.', 'Lucas Ramos'),
			('${PermissionsPermission.LER_PERMISSIONS}', 'Permite visualizar permissões registradas.', 'Lucas Ramos'),
			('${PermissionsPermission.MODIFICAR_PERMISSIONS}', 'Permite editar, adicionar e excluir permissões registradas.', 'Lucas Ramos'),
			('${EstadoPermission.LER_ESTADO}', 'Permite visualizar estados registrados.', 'Lucas Ramos'),
			('${EstadoPermission.MODIFICAR_ESTADO}', 'Permite editar, adicionar e excluir estados registrados.', 'Lucas Ramos'),
			('${CasosCovidPermission.LER_CASOS}', 'Permite visualizar casos registrados.', 'Lucas Ramos'),
			('${CasosCovidPermission.MODIFICAR_CASOS}', 'Permite editar, adicionar e excluir casos registrados.', 'Lucas Ramos')
		`)


		/** --------------
		@PERFIL_PERMISSIONS
		-------------- */
		// INSERÇÃO DE PERMISSIONS NO PERFIL ADMIN
		await queryRunner.query(`
			INSERT INTO security.perfil_permission (permission_id, perfil_id) VALUES
				((SELECT id FROM security.permission WHERE nome = '${UsuarioPermission.LER_USUARIO}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${UsuarioPermission.MODIFICAR_USUARIO}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${PerfilPermission.LER_PERFIL}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${PerfilPermission.MODIFICAR_PERFIL}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${PermissionsPermission.LER_PERMISSIONS}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${PermissionsPermission.MODIFICAR_PERMISSIONS}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${EstadoPermission.LER_ESTADO}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${EstadoPermission.MODIFICAR_ESTADO}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${CasosCovidPermission.LER_CASOS}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}')),
				((SELECT id FROM security.permission WHERE nome = '${CasosCovidPermission.MODIFICAR_CASOS}'), (SELECT id FROM security.perfil WHERE nome = '${PerfilEnum.ADMIN}'))
		`)
	}

	

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.clearTable('estado');
		await queryRunner.clearTable('security.perfil');
		await queryRunner.clearTable('security.permission');
		await queryRunner.clearTable('security.usuario');
	}
}
