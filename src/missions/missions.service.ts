import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from './entities/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionsRepository: Repository<Mission>,
  ) {}

  async create(createMissionDto: CreateMissionDto): Promise<Mission> {
    const existingMission = await this.missionsRepository.findOneBy({
      name: createMissionDto.name,
    });

    if (existingMission) {
      throw new ConflictException(
        `Já existe uma missão com o nome "${createMissionDto.name}"`,
      );
    }

    const mission = this.missionsRepository.create({
      ...createMissionDto,
      team: { id: createMissionDto.teamId },
    });
    return this.missionsRepository.save(mission);
  }

  async findAll(): Promise<Mission[]> {
    return this.missionsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['team'],
    });
  }

  async findOne(id: string): Promise<Mission> {
    const mission = await this.missionsRepository.findOneBy({ id });

    if (!mission) {
      throw new NotFoundException(`Missão com ID "${id}" não encontrada.`);
    }

    return mission;
  }

  async update(
    id: string,
    updateMissionDto: UpdateMissionDto,
  ): Promise<Mission> {
    const mission = await this.missionsRepository.preload({
      id: id,
      ...updateMissionDto,
    });

    if (!mission) {
      throw new NotFoundException(`Missão com ID "${id}" não encontrada.`);
    }

    return this.missionsRepository.save(mission);
  }

  async remove(id: string): Promise<{ message: string }> {
    const mission = await this.findOne(id);

    await this.missionsRepository.remove(mission);

    return { message: `Missão "${mission.name}" removida com sucesso.` };
  }
}
