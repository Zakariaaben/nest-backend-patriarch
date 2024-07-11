import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dtos/createUser.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly UserModel: typeof User) {}

  async findAll() {
    return await this.UserModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async findById(id: number) {
    return await this.UserModel.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
  }

  async createUser(newUser: UserDto) {
    const userExists = await this.findByName(newUser.username);
    if (userExists) {
      throw new HttpException(
        `User with name '${newUser.username}' already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    newUser.password = await this.hashPassword(newUser.password);

    const user = await this.UserModel.create(
      newUser as { username: string; password: string },
    );
    const { password, ...result } = user.get();
    return result;
  }

  async updateUser(id: number, updatedUser: UserDto) {
    const oldUser = await this.UserModel.findOne({ where: { id } });

    if (!oldUser) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const userExists = await this.findByName(updatedUser.username);
    if (userExists && userExists.id !== id) {
      throw new HttpException(
        `Can't use name '${updatedUser.username}', already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    updatedUser.password = await this.hashPassword(updatedUser.password);

    const newUser = await oldUser.update(updatedUser);
    const { password, ...result } = newUser.get();
    return result;
  }

  async deleteUser(id: number) {
    const user = await this.UserModel.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    await user.destroy();
    throw new HttpException(`User with ID ${id} deleted`, HttpStatus.OK);
  }

  async findByName(username: string) {
    return await this.UserModel.findOne({
      where: { username },
    });
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
