import { getCategoryDto } from 'src/categories/dtos/getCategory.dto';

export class getProjectDto {
  id: number;
  name: string;
  description: string;
  images: string[];
  category: getCategoryDto;
}
