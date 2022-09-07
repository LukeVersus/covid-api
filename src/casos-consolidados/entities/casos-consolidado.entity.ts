import { CasosCovid } from "src/casos-covid/entities/casos-covid.entity";
import { Estado } from "src/estado/entities/estado.entity";
import { Column, Entity, Generated, Index, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'casos-consolidados' })
export class CasosConsolidado {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false, type: 'bigint', default: 0 })
    totalCasos: number;
    
    @Column({ nullable: false, type: 'bigint', default: 0 })
    totalRecuperados: number;
    
    @Column({ nullable: false, type: 'bigint', default: 0 })
    totalMorte: number;

    @OneToOne(() => Estado, estado => estado.consolidado,  { eager: true })
    @JoinColumn({ name: 'fk_estado' })
    estado: Estado;

    @OneToMany(() => CasosCovid, casosCovid => casosCovid.consolidados)
    casosCovid: CasosCovid[];
}
