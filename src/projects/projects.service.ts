import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/models/category.model';
import { Image } from 'src/images/Models/images.model.';
import { createProjectDto } from './dtos/createProject.dto';
import { getProjectDto } from './dtos/getProject.dto';
import { Project } from './models/project.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
    private readonly categoryService: CategoriesService,
  ) {}

  async getAll(): Promise<getProjectDto[]> {
    const projects = await this.projectModel.findAll({
      include: [
        {
          model: Image,
          attributes: ['url'],
        },
        {
          model: Category,
          attributes: ['name', 'id'],
        },
      ],
    });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      images: project.images.map((image: Image) => image.url),
      category: project.category,
    }));
  }

  async getProjectById(id: number): Promise<getProjectDto> {
    const project = await this.projectModel.findByPk(id, {
      include: [
        {
          model: Image,
          attributes: ['url'],
        },
        {
          model: Category,
          attributes: ['name', 'id'],
        },
      ],
    });
    if (!project) {
      throw new HttpException(
        `Project with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      images: project.images.map((image: Image) => image.url),
      category: project.category,
    };
  }

  async createProject(createProjectDto: createProjectDto) {
    const { name, description, categoryId } = createProjectDto;

    const category = await this.categoryService.getCategoryById(categoryId);

    const project = {
      name,
      description,
      categoryId: category.id,
    };

    return this.projectModel.create(project);
  }

  async updateProjectDto(updateProjectDto: createProjectDto) {
    const { name, description, categoryId } = updateProjectDto;

    const category = await this.categoryService.getCategoryById(categoryId);

    const project = {
      name,
      description,
      categoryId: category.id,
    };

    category.update(Project);
  }
}
