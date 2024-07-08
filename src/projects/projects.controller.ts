import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { createProjectDto } from './dtos/createProject.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAllProjects() {
    return this.projectsService.getAll();
  }

  @Get(':id')
  async getProjectById(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createProject(@Body() createProjectDto: createProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
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
