import { CreateDateColumn, UpdateDateColumn, Column } from "typeorm";

export abstract class BaseEntity {
  @CreateDateColumn({ nullable: false })
  createdAt: Date;
  
  @Column({ nullable: false })
  createdBy: string;
  
  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;
}