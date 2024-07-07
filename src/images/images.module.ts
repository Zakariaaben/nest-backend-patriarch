import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './Models/images.model.';

@Module({
  imports: [SequelizeModule.forFeature([Image])],
  providers: [ImagesService],
})
export class ImagesModule {}
