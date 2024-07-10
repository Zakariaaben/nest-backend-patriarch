import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from './categories/categories.module';
import { ImagesModule } from './images/images.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      autoLoadModels: true,
      database: 'new-db',
    }),

    ProjectsModule,

    ImagesModule,

    CategoriesModule,

    UsersModule,

    AuthModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
