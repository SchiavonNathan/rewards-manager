import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardsRepository: Repository<Reward>,
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const existingReward = await this.rewardsRepository.findOneBy({
      name: createRewardDto.name,
    });

    if (existingReward) {
      throw new ConflictException(
        `Já existe uma recompensa com o nome "${createRewardDto.name}"`,
      );
    }

    const reward = this.rewardsRepository.create(createRewardDto);
    return this.rewardsRepository.save(reward);
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardsRepository.find({
      order: {
        points_cost: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardsRepository.findOneBy({ id });

    if (!reward) {
      throw new NotFoundException(`Recompensa com ID "${id}" não encontrada.`);
    }

    return reward;
  }

  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    const reward = await this.rewardsRepository.preload({
      id: id,
      ...updateRewardDto,
    });

    if (!reward) {
      throw new NotFoundException(`Recompensa com ID "${id}" não encontrada.`);
    }

    return this.rewardsRepository.save(reward);
  }

  async remove(id: string): Promise<{ message: string }> {
    const reward = await this.findOne(id);

    await this.rewardsRepository.remove(reward);

    return { message: `Recompensa "${reward.name}" removida com sucesso.` };
  }
}
