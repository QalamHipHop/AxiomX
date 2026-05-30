import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('synthetic_limit_orders')
export class SyntheticLimitOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  symbol: string;

  @Column()
  side: 'buy' | 'sell';

  @Column('decimal', { precision: 20, scale: 10 })
  amount: number;

  @Column('decimal', { precision: 20, scale: 10 })
  triggerPrice: number;

  @Column('decimal', { precision: 20, scale: 10 })
  limitPrice: number;

  @Column({ default: 'active' })
  @Index()
  status: 'active' | 'executed' | 'canceled' | 'expired' | 'failed';

  @Column({ type: 'bigint' })
  expiresAt: number;

  @Column({ type: 'bigint', nullable: true })
  executedAt: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
