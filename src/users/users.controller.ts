import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAllUsers() {
    return 'This action returns all users';
  }

  @Get(':id')
  findOneUser() {
    return 'This action returns a #${id} user';
  }

  @Post()
  createUser() {
    return 'This action adds a new user';
  }

  @Put(':id')
  updateUser() {
    return 'This action updates a #${id} user';
  }

  @Delete(':id')
  deleteUser() {
    return 'This action removes a #${id} user';
  }
}
