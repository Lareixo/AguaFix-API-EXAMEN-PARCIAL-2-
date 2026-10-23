import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('WATER_REPORT')
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  address!: string;

  @Column('text')
  description!: string;

  @Column({
    type: 'varchar',
  })
  severity!: string;

  @Column()
  reporterPhone!: string;

  @Column({
    default: false,
  })
  isResolved!: boolean;

  @Column()
  photoUrl!: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  repairPhotoUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}