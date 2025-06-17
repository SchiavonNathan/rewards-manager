import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const existingTeam = await this.teamsRepository.findOneBy({
      name: createTeamDto.name,
    });

    if (existingTeam) {
      throw new ConflictException(
        `Já existe uma equipe com o nome "${createTeamDto.name}"`,
      );
    }

    const team = this.teamsRepository.create(createTeamDto);
    return this.teamsRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOneBy({ id });

    if (!team) {
      throw new NotFoundException(`Equipe com ID "${id}" não encontrada.`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamsRepository.preload({
      id: id,
      ...updateTeamDto,
    });

    if (!team) {
      throw new NotFoundException(`Equipe com ID "${id}" não encontrada.`);
    }

    return this.teamsRepository.save(team);
  }

  async remove(id: string): Promise<{ message: string }> {
    const team = await this.findOne(id);

    await this.teamsRepository.remove(team);

    return { message: `Equipe "${team.name}" removida com sucesso.` };
  }
}