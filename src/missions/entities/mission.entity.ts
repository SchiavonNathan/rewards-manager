import { Submission } from 'src/submission/entities/submission.entity';
import { Team } from 'src/teams/entities/team.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'missions' })
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  description: string;

  @Column({ type: 'integer', default: 0 })
  points: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Team, (team) => team.missions)
  team: Team;

  @OneToMany(() => Submission, (submission) => submission.mission)
  submissions: Submission[];
}
