import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { sequelizeConfigAsync } from './config/sequelize.config';
import { ImagesModule } from './images/images.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync(sequelizeConfigAsync),
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
