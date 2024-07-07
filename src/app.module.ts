import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from './categories/categories.module';
import { ImagesModule } from './images/images.module';
import { ProjectsModule } from './projects/projects.module';

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
