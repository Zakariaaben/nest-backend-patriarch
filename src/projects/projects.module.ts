import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from 'src/categories/categories.module';
import { ImagesModule } from 'src/images/images.module';
import { FileUploadService } from './fileUpload.service';
import { Project } from './models/project.model';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Project]),
    CategoriesModule,
    ImagesModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, FileUploadService],
})
export class ProjectsModule {}
