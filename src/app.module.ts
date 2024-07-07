import { Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from './projects/models/project.model';
import { ProjectsModule } from './projects/projects.module';
import { ImagesModule } from './images/images.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest-sequelize',
      sync: { alter: true },
      autoLoadModels: true,
    }),

    ProjectsModule,

    ImagesModule,

    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
