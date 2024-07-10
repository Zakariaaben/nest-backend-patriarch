import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './Models/images.model.';

@Injectable()
export class ImagesService {
  constructor(@InjectModel(Image) private imageModel: typeof Image) {}
  storeImageUrls(urls: string[], projectId: number) {
    return this.imageModel.bulkCreate(urls.map((url) => ({ url, projectId })));
  }

  getImagesByProjectId(projectId: number) {
    return this.imageModel.findAll({ where: { projectId } });
  }

  deleteImagesByProjectId(projectId: number) {
    return this.imageModel.destroy({ where: { projectId } });
  }
}
