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
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { categoryIdValidationPipe } from 'src/categories/categoryId.validation';
import { ImagesService } from 'src/images/images.service';
import { createProjectDto } from './dtos/createProject.dto';
import { FileService } from './file.service';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly fileService: FileService,
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

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(ValidationPipe, categoryIdValidationPipe)
  @UseInterceptors(FilesInterceptor('images'))
  async createProject(
    @Req() req: Request,
    @Body() createProjectDto: createProjectDto,
  ) {
    const filenames = await this.fileService.uploadImages(
      req.files as Express.Multer.File[],
    );
    const project = await this.projectsService.createProject(createProjectDto);
    await this.imageService.storeImageUrls(filenames as string[], project.id);
    return this.projectsService.getProjectById(project.id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes(ValidationPipe, categoryIdValidationPipe)
  async updateProject(
    @Body() createProjectDto: createProjectDto,
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (req.files.length != 0) {
      // Delete old images from database
      const images = await this.imageService.getImagesByProjectId(id);
      await this.imageService.deleteImagesByProjectId(id);

      // Delete old images from disk
      const imageURLS = images.map((image) => decodeURI(image.url));
      await this.fileService.DeleteFilesFromDisk(imageURLS);

      // Upload new images
      const filenames = await this.fileService.uploadImages(
        req.files as Express.Multer.File[],
      );
      console.log(filenames);
      await this.imageService.storeImageUrls(filenames as string[], id);
    }

    await this.projectsService.updateProjectDto(createProjectDto, id);

    return this.getProjectById(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    const project = await this.projectsService.getProjectById(id);
    await this.projectsService.deleteProject(id);
    await this.fileService.DeleteFilesFromDisk(project.images);

    return project;
  }
}
