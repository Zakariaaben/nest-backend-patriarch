import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ImagesModule } from './images/images.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ImagesModule,
    ProjectsModule,

    CategoriesModule,

    UsersModule,

    AuthModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
