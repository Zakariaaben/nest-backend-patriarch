import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private userModel: typeof Category) {}
  getAll() {
    return this.userModel.findAll({
      attributes: ['id', 'name'],
    });
  }

  async getCategoryById(id: number) {
    const category = await this.userModel.findByPk(id, {
      attributes: ['id', 'name'],
    });
    if (!category) {
      throw new HttpException(
        `Category with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async createCategory(name: string) {
    const category = await this.userModel.create({ name });
    return category;
  }

  async deleteCategory(id: number) {
    const category = await this.userModel.findByPk(id);
    if (!category) {
      throw new HttpException(
        `Category with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await category.destroy();
    } catch (e) {
      throw new HttpException(
        {
          message: `Cannot Delete category ${category.name}. Projects belong to this category `,
          details: e.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
