import { Column, DeleteDateColumn, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

import { BaseEntity } from "src/utils/entities/base.entity";
import { Perfil } from 'src/perfil/entities/perfil.entity';

@Entity({ name: 'usuario', schema: 'security' })
@Unique('UQ_DELETE', ['email', 'cpf', 'dataDelete'])
export class Usuario extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @Generated("uuid")
  @Index()
  idPublic: string;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  cpf: string;

  @Column({ nullable: false, select: false })
  senha: string;
    
  @Column({ nullable: false, default: true })
  ativo: boolean;

  @Column({ nullable: false, default: false })
  redefinirPass: boolean;
    
  @ManyToOne(() => Perfil, perfil => perfil.usuario, { eager: true, nullable: false })
  @JoinColumn({ name: 'fk_perfil' })
  perfil: Perfil;

  @Column({ nullable: true })
  lastAccess: Date;

  @Column({ nullable: true })
  firstAccess: Date;

  @DeleteDateColumn()
  dataDelete: Date;

}
