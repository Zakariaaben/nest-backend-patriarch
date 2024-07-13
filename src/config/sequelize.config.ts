import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  SequelizeModuleAsyncOptions,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';

export default class SequelizeConfig {
  static getSequelizeConfig(
    configService: ConfigService,
  ): SequelizeModuleOptions {
    return {
      dialect: 'mysql',
      host: configService.get<string>('MY_SQL_HOST'),
      port: Number(configService.get<string>('MY_SQL_PORT')),
      username: configService.get<string>('MY_SQL_USER'), // defaulting to 'root'
      password: configService.get<string>('MY_SQL_PASSWORD'), // defaulting to ''
      database: configService.get<string>('MY_SQL_DATABASE'),
      autoLoadModels: true,
    };
  }
}

export const sequelizeConfigAsync: SequelizeModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<SequelizeModuleOptions> =>
    SequelizeConfig.getSequelizeConfig(configService),
  inject: [ConfigService],
};
