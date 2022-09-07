import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CasosConsolidado } from 'src/casos-consolidados/entities/casos-consolidado.entity';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import { ResponseGeneric } from 'src/utils/response.generic';
import { DataSource, Repository } from 'typeorm';
import { CreateCasosCovidDto } from '../dto/create-casos-covid.dto';
import { UpdateCasosCovidDto } from '../dto/update-casos-covid.dto';
import { CasosCovid } from '../entities/casos-covid.entity';

@Injectable()
export class CasosCovidService {
  constructor(
    @InjectRepository(CasosCovid)
    private casosCovidRepository: Repository<CasosCovid>,
    private dataSource: DataSource
  ) {}

  async create(body: CreateCasosCovidDto) {
    try {
      // Verifica se já existem casos consolidados para aquele estado.
      const consolidado: CasosConsolidado = await this.dataSource.getRepository(CasosConsolidado).findOneBy({estado: {id: body.estado.id}});

      if (consolidado) {
        // Se existirem casos consolidados, adiciona novos casos.
        consolidado.totalCasos = Number(consolidado.totalCasos) + Number(body.novosCasos);
        consolidado.totalRecuperados = Number(consolidado.totalRecuperados) + Number(body.recuperados);
        consolidado.totalMorte = Number(consolidado.totalMorte) + Number(body.mortes);
        body.consolidados = consolidado;
      } else {
        // Se não existirem casos consolidados, cria-se um novo caso consolidado.
        const casosConsolidadados: CasosConsolidado = new CasosConsolidado;
        casosConsolidadados.totalCasos = Number(body.novosCasos);
        casosConsolidadados.totalRecuperados = Number(body.recuperados);
        casosConsolidadados.totalMorte = Number(body.mortes);
        casosConsolidadados.estado = body.estado;
        body.consolidados = casosConsolidadados;
      }

      // Salva novos casos de covid no banco.
      const casosCovid: CasosCovid = await this.casosCovidRepository.save(body);

      // Retorna dados dos casos cadastrados.
      return new ResponseGeneric<CasosCovid>(casosCovid);

    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível cadastrar Novos Casos. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(page: number, size: number) {
    try {
      // Busca todos os casos no banco, ordenando por id
      const [casosCovid, total] : [CasosCovid[], number] = await this.casosCovidRepository.findAndCount({
        loadEagerRelations: false,
        relations: {
          estado: true
        },
        order: {
          id: 'ASC'
        },
        take: size,
        skip: size * (page)
      });

      // Retorna dados dos casos cadastrados.
      return new ResponseGeneric<PaginationInterface<CasosCovid[]>>({
        content: casosCovid,
        total: total,
        totalPages: Math.ceil(total/size)
      });
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível listar Casos. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async findAllByEstado(idPublic: string, page: number, size: number) {
    try {
      // Busca todos os casos no banco de acordo com o id public do estado, ordenando por id
      const [casosCovid, total] : [CasosCovid[], number] = await this.casosCovidRepository.findAndCount({
        loadEagerRelations: false,
        where: {
          estado: {
            idPublic: idPublic
          }
        },
        order: {
          id: 'ASC'
        },
        take: size,
        skip: size * (page)
      });

      // Retorna dados dos casos cadastrados.
      return new ResponseGeneric<PaginationInterface<CasosCovid[]>>({
        content: casosCovid,
        total: total,
        totalPages: Math.ceil(total/size)
      });
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível listar Casos. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async findOne(idPublic: string) {
    try {
      // Busca no banco um caso com o idPublic informado
      const casosCovid: CasosCovid = await this.casosCovidRepository.findOne({
        loadEagerRelations: false,
        relations: {
          consolidados: {
            totalCasos: true,
            totalMorte: true,
            totalRecuperados: true
          },
          estado: {
            sigla: true,
            nome: true
          }
        },
        where: {
          idPublic
        }
      });

      // Retorna dados do caso cadastrado
      return new ResponseGeneric<CasosCovid>(casosCovid);
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível listar Caso. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async findLastOneByEstado(idPublic: string) {
    try {
      // Busca no banco o último caso cadastrado com o idPublic do estado informado
      const casosCovid: CasosCovid = await this.casosCovidRepository.findOne({
        loadEagerRelations: false,
        relations: {
          consolidados: {
            totalCasos: true,
            totalMorte: true,
            totalRecuperados: true
          },
          estado: {
            sigla: true,
            nome: true
          }
        },
        where: {
          estado: {
            idPublic: idPublic
          }
        },
        order: {
          createdAt: 'DESC'
        }
      });

      // Retorna dados do caso cadastrado
      return new ResponseGeneric<CasosCovid>(casosCovid);
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível listar Caso. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async update(idPublic: string, body: UpdateCasosCovidDto) {
    // Importa executor de consultas
    const queryRunner = this.dataSource.createQueryRunner();

    // Inicia conexão com o banco
    await queryRunner.connect();

    // Inicia Transaction
    await queryRunner.startTransaction();

    try {
      // Busca no banco um caso com o idPublic informado
      const casoCheck = await this.casosCovidRepository.findOne({
        relations: {
          consolidados: true,
          estado: true
        },
        where: {
          idPublic
        }
      })
      
      // Verifica se foi encontrado algum caso
      if (!casoCheck) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Caso com esta identificação: ' + idPublic;
      }

      // Busca consolidado no banco para atualização do total de casos
      const consolidado: CasosConsolidado = await this.dataSource.getRepository(CasosConsolidado).findOneBy({ id: casoCheck.consolidados.id });
      // Realiza atualização do total de casos
      consolidado.totalCasos = Number(consolidado.totalCasos) - Number(casoCheck.novosCasos);
      consolidado.totalRecuperados = Number(consolidado.totalRecuperados) - Number(casoCheck.recuperados);
      consolidado.totalMorte = Number(consolidado.totalMorte) - Number(casoCheck.mortes);
      await queryRunner.manager.update(CasosConsolidado, { id: consolidado.id }, consolidado);
      // Busca casos consolidados atualizado
      const novoConsolidado: CasosConsolidado = await queryRunner.manager.findOneBy(CasosConsolidado, {id: consolidado.id});
      // Realiza atualização do total de casos no body
      novoConsolidado.totalCasos = Number(novoConsolidado.totalCasos) + Number(body.novosCasos);
      novoConsolidado.totalRecuperados = Number(novoConsolidado.totalRecuperados) + Number(body.recuperados);
      novoConsolidado.totalMorte = Number(novoConsolidado.totalMorte) + Number(body.mortes);
      body.consolidados = novoConsolidado;

      // Atualiza dados do caso com o idPublic informado
      await queryRunner.manager.update(CasosCovid, { idPublic }, body)

      // Busca no banco um caso com o idPublic informado
      const caso: CasosCovid = await queryRunner.manager.findOneBy(CasosCovid, { idPublic })

      // Salva Transaction
      await queryRunner.commitTransaction();

      // Retorna caso modificado
      return new ResponseGeneric<CasosCovid>(caso);
    } catch (error) {
      // Retorna dados da transaction
      await queryRunner.rollbackTransaction();

      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível modificar o Caso. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)       
    } finally {
      // Libera conexão com o banco
      await queryRunner.release();
    }
  }

  async remove(idPublic: string) {
    try {
      // Busca no banco um caso com o idPublic informado
      const caso: CasosCovid = await this.casosCovidRepository.findOne({
        relations: {
          consolidados: true,
          estado: true
        },
        where: {
          idPublic
        }
      })

      // Verifica se foi encontrado algum caso
      if (!caso) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Caso com esta identificação: ' + idPublic;
      }

      // Busca consolidado no banco para atualização do total de casos
      const consolidado: CasosConsolidado = await this.dataSource.getRepository(CasosConsolidado).findOneBy({ id: caso.consolidados.id });
      // Realiza atualização do total de casos
      consolidado.totalCasos = Number(consolidado.totalCasos) - Number(caso.novosCasos);
      consolidado.totalRecuperados = Number(consolidado.totalRecuperados) -  Number(caso.recuperados);
      consolidado.totalMorte = Number(consolidado.totalMorte) -  Number(caso.mortes);
      await this.dataSource.getRepository(CasosConsolidado).update({ id: consolidado.id }, consolidado);

      // Deleta o caso com o idPublic informado
      const returnDelete = await this.casosCovidRepository.delete({ idPublic }).catch(async err => {
        // Verifica se o erro retornado é de existência de tabelas relacionadas
        if (err?.code == '23503') {
          // Realiza a o softDelete
          return await this.casosCovidRepository.softDelete(this.casosCovidRepository.create(caso))
        }
      });
      
      // Returna mensagem de sucesso
      return new ResponseGeneric<CasosCovid>(null, returnDelete.affected + ' Caso deletado com sucesso.');
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível deletar o Caso. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }
}
