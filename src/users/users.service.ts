import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createUserDto } from './dtos/createUser.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly UserModel: typeof User) {}

  async findAll() {
    return await this.UserModel.findAll();
  }

  async findById(id: number) {
    return await this.UserModel.findOne({ where: { id } });
  }

  async create(newUser: createUserDto) {
    return await this.UserModel.create(
      newUser as { name: string; password: string },
    );
  }

  async update(id: number, updatedUser: createUserDto) {
    const user = await this.UserModel.findOne({ where: { id } });
    if (!user) {
      return new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return await user.update(updatedUser);
  }
}
