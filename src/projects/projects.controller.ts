import {
  Body,
  Controller,
  Delete,
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
    const project = await this.projectsService.createProject(createProjectDto);
    const images = await this.imageService.storeImageUrls(
      filenames as string[],
      project.id,
    );
    return this.projectsService.getProjectById(project.id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes()
  async updateProject(
    @Body() createProjectDto: createProjectDto,
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log(createProjectDto);
    const updatedProject = await this.projectsService.updateProjectDto(
      createProjectDto,
      id,
    );
    const images = await this.imageService.getImagesByProjectId(id);
    console.log(req.files.length);
    if (req.files.length != 0) {
      const filenames = await this.fileUploadService.uploadImages(
        req.files as Express.Multer.File[],
      );
      await this.imageService.storeImageUrls(filenames as string[], id);
    }

    return this.getProjectById(id);
  }

  @Delete(':id')
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }
}
