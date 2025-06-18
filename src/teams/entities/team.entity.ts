import { Mission } from 'src/missions/entities/mission.entity';
import { Reward } from 'src/rewards/entities/reward.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.team)
  users: User[];

  @OneToMany(() => Mission, (mission) => mission.team)
  missions: Mission[];

  @OneToMany(() => Reward, (reward) => reward.team)
  rewards: Reward[];
}