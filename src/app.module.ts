import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { MissionsModule } from './missions/missions.module';
import { RewardsModule } from './rewards/rewards.module';
import { SubmissionModule } from './submission/submission.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'rewards',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    TeamsModule,
    MissionsModule,
    RewardsModule,
    SubmissionModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}