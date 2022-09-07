import { CasosConsolidado } from "src/casos-consolidados/entities/casos-consolidado.entity";
import { CasosCovid } from "src/casos-covid/entities/casos-covid.entity";
import { Column, Entity, Generated, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'estado' })
export class Estado {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false, unique: true })
	@Generated("uuid")
	@Index()
	idPublic: string;

	@Column({ nullable: false })
	nome: string;

	@Column({ nullable: false })
	sigla: string;

    @Column({ nullable: false, type: 'bigint' })
    populacao: number;

	@OneToMany(() => CasosCovid, casosCovid => casosCovid.estado)
    casosCovid: CasosCovid[];

	@OneToOne(() => CasosConsolidado, consolidado => consolidado.estado)
	consolidado: CasosConsolidado;
}
