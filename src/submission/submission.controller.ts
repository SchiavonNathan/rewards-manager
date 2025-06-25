import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/submissions',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Arquivo enviado com sucesso',
      path: `/uploads/${file.filename}`,
    };
  }
}
