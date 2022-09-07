import { UpdateStatusUsuarioDto } from './../dto/update-status-usuario.dto';
import { IdDto } from './../../utils/id.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { ResponseGeneric } from 'src/utils/response.generic';

import { JwtService } from '@nestjs/jwt';
import { PassVerify } from './../../utils/pass-verify/passVerify';

import { Usuario } from './../entities/usuario.entity';

import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import PerfilEnum from 'src/perfil/enums/perfil.enum';
import { UpdateUsuarioSelfDto } from '../dto/update-usuario-self.dto';
import { UpdatePassDto } from '../dto/update-pass.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private dataSource: DataSource,
    private passVerify: PassVerify,
    private jwtService: JwtService
  ) {}
  async create(body: CreateUsuarioDto) {
    try {
      // Verifica se a senha é forte
      if (!(await this.passVerify.passVerify(body.senha))) {
        throw 'Senha deve ter no mínimo 8 caracteres e conter ao menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial. '
      }

      // Transforma senha informada em hash
      body.senha = await bcrypt.hash(body.senha, Number(process.env.BCRYPT_SALT_ROUNDS));

      // Trata possíveis inconsistências no email
      body.email = body.email.trim().toLowerCase();

      // Retira máscara de cpf
      body.cpf = body.cpf.replace(/[^0-9]/g, "").trim();

      // Salva novo usuário no banco
      const usuario = await this.usuarioRepository.save(body)

      // Busca no banco usuário salvo
      const usuarioReturn: Usuario = await this.usuarioRepository.findOneBy({id: usuario.id});

      // Retorna dados do usuário cadastrado
      return new ResponseGeneric<Usuario>(usuarioReturn);

    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível cadastrar Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {    
    try {
      // Busca no banco todos os usuários administrativos e ordena por nome em ordem alfabética.
      const usuarios: Usuario[] = await this.usuarioRepository.find({
        relations: {
          perfil: true
        },
        where: {
          perfil: {
            nome: PerfilEnum.ADMIN
          }
        },
        order: {
          nome: 'ASC'
        }
      });

      // Retorna a lista de usuários
      return new ResponseGeneric<Usuario[]>(usuarios);

    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível listar Usuários.', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

  async findOne(idPublic: string) {
    try {
      // Busca no banco um usuário de acordo com o id público informado.
      const usuario: Usuario = await this.usuarioRepository.findOneBy({ idPublic: idPublic })
      // Retorna usuário encontrado
      return new ResponseGeneric<Usuario>(usuario);
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível buscar o Usuário. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async update(idPublic: string, body: UpdateUsuarioDto, userToken: IdDto) {
    // Importa executor de consultas
    const queryRunner = this.dataSource.createQueryRunner();

    // Inicia conexão com o banco
    await queryRunner.connect();

    // Inicia Transaction
    await queryRunner.startTransaction();

    try {
      // Busca no banco um usuário de acordo com o id público informado.
      const usuarioCheck: Usuario = await this.usuarioRepository.findOneBy({ idPublic: idPublic })

      // Verifica se foi encontrado um usuário
      if (!usuarioCheck) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      // Verifica se o CPF está sendo alterado.
      if (body.cpf) {
        // Verifica se o usuário logado é o mesmo usuário que está sofrendo alteração de cpf.
        if (userToken.id != usuarioCheck.id) {
          // Retorna mensagem de erro
          throw 'Usuário sem autorização para modificar dados sensíveis deste usuário.';
        }
      }

      // Trata possíveis inconsistências no email
      if (body.email) {
        body.email = body.email.trim().toLowerCase();
      }

      // Adiciona id do usuario em questão no corpo do update
      const bodyUpdate: Usuario = {...usuarioCheck, ...body};
      
      // Atualiza dados do usuário com o idPublic informado
      await queryRunner.manager.save(Usuario, bodyUpdate);

      // Busca no banco um usuário com o idPublic informado
      const usuario: Usuario = await queryRunner.manager.findOneBy(Usuario, { idPublic: idPublic });
      
      // Salva Transaction
      await queryRunner.commitTransaction();
      
      // Retorna usuário modificado
      return new ResponseGeneric<Usuario>(usuario);

    } catch (error) {
      // Retorna dados da transaction
      await queryRunner.rollbackTransaction();
      
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível modificar o Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      // Libera conexão com o banco
      await queryRunner.release();
    }

  }

  async updateStatus(idPublic: string, body: UpdateStatusUsuarioDto, userToken: IdDto) {
    // Importa executor de consultas
    const queryRunner = this.dataSource.createQueryRunner();

    // Inicia conexão com o banco
    await queryRunner.connect();

    // Inicia Transaction
    await queryRunner.startTransaction();

    try {
      // Busca no banco um usuário de acordo com o id público informado.
      const usuarioCheck: Usuario = await this.usuarioRepository.findOneBy({ idPublic: idPublic })

      // Verifica se foi encontrado um usuário
      if (!usuarioCheck) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }
      // Verifica se o usuário logado é o mesmo usuário que está sofrendo alteração de status.
      if (userToken.id == usuarioCheck.id) {
        // Retorna mensagem de erro
        throw 'Usuário sem autorização para modificar status deste usuário.';
      }      

      // Adiciona id do usuario em questão no corpo do update
      const bodyUpdate: Usuario = {...usuarioCheck, ...body};
      
      // Atualiza dados do usuário com o idPublic informado
      await queryRunner.manager.save(Usuario, bodyUpdate);

      // Busca no banco um usuário com o idPublic informado
      const usuario: Usuario = await queryRunner.manager.findOneBy(Usuario, { idPublic: idPublic });
      
      // Salva Transaction
      await queryRunner.commitTransaction();
      
      // Retorna usuário modificado
      return new ResponseGeneric<Usuario>(usuario);

    } catch (error) {
      // Retorna dados da transaction
      await queryRunner.rollbackTransaction();
      
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível modificar status do Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      // Libera conexão com o banco
      await queryRunner.release();
    }

  }

  async updateSelf(idPublic: string, body: UpdateUsuarioSelfDto, userToken: IdDto) {
    // Importa executor de consultas
    const queryRunner = this.dataSource.createQueryRunner();

    // Inicia conexão com o banco
    await queryRunner.connect();

    // Inicia Transaction
    await queryRunner.startTransaction();

    try {
      // Busca no banco um usuário de acordo com o id público informado.
      const usuarioCheck: Usuario = await this.usuarioRepository.findOneBy({ idPublic: idPublic })

      // Verifica se foi encontrado um usuário
      if (!usuarioCheck) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      // Verifica se o id em questão é o mesmo do usuário logado
      if (usuarioCheck.id != userToken.id) {
        // Retorna mensagem de erro
        throw 'Usuário sem autorização para modificar outros usuários.';
      }

      // Trata possíveis inconsistências no email
      body.email = body.email.trim().toLowerCase();

      // Adiciona id do usuario em questão no corpo do update
      const bodyUpdate: Usuario = {...usuarioCheck, ...body};
      
      // Atualiza dados do usuário com o idPublic informado
      await queryRunner.manager.save(Usuario, bodyUpdate);

      // Busca no banco um usuário com o idPublic informado
      const usuario: Usuario = await queryRunner.manager.findOneBy(Usuario, { idPublic: idPublic });
      
      // Salva Transaction
      await queryRunner.commitTransaction();
      
      // Retorna usuário modificado
      return new ResponseGeneric<Usuario>(usuario);

    } catch (error) {
      // Retorna dados da transaction
      await queryRunner.rollbackTransaction();
      
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível modificar o Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      // Libera conexão com o banco
      await queryRunner.release();
    }

  }

  async updatePass(idPublic: string, body: UpdatePassDto) {
    // Importa executor de consultas
    const queryRunner = this.dataSource.createQueryRunner();

    // Inicia conexão com o banco
    await queryRunner.connect();

    // Inicia Transaction
    await queryRunner.startTransaction();

    try {
      // Busca no banco um usuário de acordo com o id público informado.
      const usuarioCheck: Usuario = await this.usuarioRepository.findOne({
        select: ['id', 'senha', 'email'],
        where: {
          idPublic: idPublic
        }
      });

      // Verifica se foi encontrado um usuário
      if (!usuarioCheck) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      // Compara a senha informada com a senha do banco
      const compare = await bcrypt.compare(body.senha, usuarioCheck.senha);

      // Verifica se a comparação foi aprovada
      if (!compare) {
        // Retorna mensagem de erro
        throw "Senha informada incorreta."
      }

      // Verifica se a senha é forte
      if (!(await this.passVerify.passVerify(body.novaSenha))) {
        throw 'Senha deve ter no mínimo 8 caracteres e conter ao menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial. '
      }

      // Transforma senha informada em hash
      const hash = await bcrypt.hash(body.novaSenha, Number(process.env.BCRYPT_SALT_ROUNDS));
      
      // Atualiza dados do usuário com o idPublic informado
      await queryRunner.manager.update(Usuario, { idPublic }, { senha : hash, redefinirPass: false });

      // Busca no banco um usuário com o idPublic informado
      const usuario: Usuario = await queryRunner.manager.findOneBy(Usuario, { idPublic: idPublic });
      
      // Salva Transaction
      await queryRunner.commitTransaction();
      
      // Retorna usuário modificado
      return new ResponseGeneric<Usuario>(usuario);

    } catch (error) {
      // Retorna dados da transaction
      await queryRunner.rollbackTransaction();
      
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível modificar senha do Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      // Libera conexão com o banco
      await queryRunner.release();
    }

  }

  async remove(idPublic: string) {
    try {
      // Busca no banco um usuário com o idPublic informado
      const usuario: Usuario = await this.usuarioRepository.findOne({
        loadEagerRelations: false,
        where: {
          idPublic: idPublic
        },
        select: ['id', 'email'],
        relations: {
          perfil: true
        }
      })

      // Verifica se foi encontrado algum usuário
      if (!usuario) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      // Deleta o usuário com o idPublic informado
      const returnDelete = await this.usuarioRepository.delete({ idPublic }).catch(async err => {
        // Verifica se o erro retornado é de existência de tabelas relacionadas
        if (err?.code == '23503') {
          // Realiza a o softDelete
          return await this.usuarioRepository.softDelete({ idPublic })
        } 
      });
      
      // Returna mensagem de sucesso
      return new ResponseGeneric<Usuario>(null, returnDelete.affected +  ' Usuário deletado com sucesso.');
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível deletar o Usuário. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }
}
