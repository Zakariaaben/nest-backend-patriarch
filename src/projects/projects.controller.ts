import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { categoryIdValidationPipe } from 'src/categories/categoryId.validation';
import { ImagesService } from 'src/images/images.service';
import { createProjectDto } from './dtos/createProject.dto';
import { FileUploadService } from './fileUpload.service';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly fileUploadService: FileUploadService,
    private readonly imageService: ImagesService,
  ) {}

  @Get()
  findAllProjects() {
    return this.projectsService.getAll();
  }

  @Get(':id')
  async getProjectById(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  @UsePipes(ValidationPipe, categoryIdValidationPipe)
  @UseInterceptors(FilesInterceptor('images'))
  async createProject(
    @Req() req: Request,
    @Body() createProjectDto: createProjectDto,
  ) {
    const filenames = await this.fileUploadService.uploadImages(
      req.files as Express.Multer.File[],
    );
    return filenames;
  }

  @Put(':id')
  @UsePipes(ValidationPipe, categoryIdValidationPipe)
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() createProjectDto: createProjectDto,
  ) {
    const updatedProject = await this.projectsService.updateProjectDto(
      createProjectDto,
      id,
    );

    return updatedProject;
  }
}
