import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() newUser: UserDto) {
    return this.usersService.createUser(newUser);
  }

  @HttpCode(200)
  @Post('changecredentials')
  @UsePipes(ValidationPipe)
  updateUser(@Body() updatedUser: UserDto, @Req() request: Request) {
    const id = request['user'].sub;
    return this.usersService.updateUser(id, updatedUser);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
