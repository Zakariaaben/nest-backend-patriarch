import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Injectable()
export class categoryIdValidationPipe implements PipeTransform {
  constructor(private readonly categoriesService: CategoriesService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const { categoryId } = value;
    await this.categoriesService.getCategoryById(categoryId);
    return value;
  }
}
