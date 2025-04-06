import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientNumber: string;

  @Column()
  referenceMonth: string;

  @Column('decimal')
  energiaEletricaKwh: number;

  @Column('decimal')
  energiaEletricaReais: number;

  @Column('decimal')
  energiaSCEEEKwh: number;

  @Column('decimal')
  energiaSCEEReais: number;

  @Column('decimal')
  energiaCompensadaKwh: number;

  @Column('decimal')
  energiaCompensadaReais: number;

  @Column('decimal')
  contribuicaoIlumReais: number;

  @CreateDateColumn()
  createdAt: Date;
}
