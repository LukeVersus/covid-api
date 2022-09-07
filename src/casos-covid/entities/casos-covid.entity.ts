import { Estado } from './../../estado/entities/estado.entity';
import { BaseEntity } from "src/utils/entities/base.entity";
import { Column, Entity, Generated, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CasosConsolidado } from 'src/casos-consolidados/entities/casos-consolidado.entity';

@Entity({ name: 'casos-covid' })
export class CasosCovid extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false, type: 'bigint' })
    novosCasos: number;
    
    @Column({ nullable: false, type: 'bigint' })
    recuperados: number;
    
    @Column({ nullable: false, type: 'bigint' })
    mortes: number;
    
    @ManyToOne(() => CasosConsolidado, consolidados => consolidados.casosCovid, { eager: true, cascade: ["insert", "update"] })
    @JoinColumn({ name: 'fk_consolidados'})
    consolidados: CasosConsolidado;

    @ManyToOne(() => Estado, estado => estado.casosCovid, { eager: true })
    @JoinColumn({ name: 'fk_estado'})
    estado: Estado;

}
