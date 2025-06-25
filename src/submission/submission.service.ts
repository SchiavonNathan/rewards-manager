import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}

  async create(
    createSubmissionDto: CreateSubmissionDto,
    fileName: string,
  ): Promise<Submission> {
    const { userId, missionId } = createSubmissionDto;

    const submission = this.submissionRepository.create({
      user: { id: userId },
      mission: { id: missionId },
      filePath: `/uploads/submissions/${fileName}`,
    });

    return this.submissionRepository.save(submission);
  }

  findAll(): Promise<Submission[]> {
    return this.submissionRepository.find();
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.submissionRepository.findOneBy({ id });
    if (!submission) {
      throw new NotFoundException(`Submissão com ID "${id}" não encontrada.`);
    }
    return submission;
  }

  async update(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<Submission> {
    const submission = await this.submissionRepository.preload({
      id,
      ...updateSubmissionDto,
    });

    if (!submission) {
      throw new NotFoundException(`Submissão com ID "${id}" não encontrada.`);
    }

    return this.submissionRepository.save(submission);
  }

  async remove(id: string): Promise<Submission> {
    const submission = await this.findOne(id);
    return this.submissionRepository.remove(submission);
  }
}
