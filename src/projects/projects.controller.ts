import { Controller, Get } from '@nestjs/common';
import { Project } from './models/project.model';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.getAll();
  }

  @Get('create')
  create() {
    return this.projectsService.create();
  }
}
