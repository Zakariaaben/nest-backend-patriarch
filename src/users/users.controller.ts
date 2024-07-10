import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';

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

  @Put(':id')
  @UsePipes(ValidationPipe)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUser: UserDto,
  ) {
    return this.usersService.updateUser(id, updatedUser);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
