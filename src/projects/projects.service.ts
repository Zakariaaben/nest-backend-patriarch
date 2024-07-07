import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './models/project.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private userModel: typeof Project,
  ) {}

  async getAll(): Promise<Project[]> {
    return this.userModel.findAll();
  }

  async create() {
    return this.userModel.create({
      name: 'Project Name',
      description: 'Project Description',
      categoryId: 1,
    });
  }
}
