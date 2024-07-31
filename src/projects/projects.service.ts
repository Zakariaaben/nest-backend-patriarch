import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/models/category.model';
import { Image } from 'src/images/Models/images.model.';
import { createProjectDto } from './dtos/createProject.dto';
import { getProjectDto } from './dtos/getProject.dto';
import { searchParamsDto } from './dtos/searchParams.dto';
import { Project } from './models/project.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
    private readonly categoryService: CategoriesService,
  ) {}

  async getAll(params: searchParamsDto): Promise<getProjectDto[]> {
    const { categoryId, page } = params;
    const projects = await this.projectModel.findAll({
      where: categoryId ? { categoryId } : {},
      limit: page ? 6 : undefined,
      offset: page ? (page - 1) * 6 : undefined,

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
      date: project.date,
      created_at: project.createdAt,
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
      date: project.date,
    };
  }

  async createProject(createProjectDto: createProjectDto) {
    const { name, description, categoryId, date } = createProjectDto;
    const project = {
      name,
      description,
      categoryId,
      date,
    };

    return this.projectModel.create(project);
  }

  async updateProjectDto(updateProjectDto: createProjectDto, id: number) {
    const { name, description, categoryId, date } = updateProjectDto;

    const category = await this.categoryService.getCategoryById(categoryId);

    const updatedProject = await this.projectModel.update(
      { name, description, categoryId: category.id, date },
      { where: { id } },
    );

    if (updatedProject[0] === 0) {
      throw new HttpException(
        `Project with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedProject;
  }

  deleteProject(id: number) {
    return this.projectModel.destroy({ where: { id } });
  }
}
