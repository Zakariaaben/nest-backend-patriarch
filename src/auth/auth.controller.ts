import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDto } from 'src/users/dtos/createUser.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() Credentials: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(Credentials);
    this.authService.setCookie(res, token.access_token);
    return { Message: 'logged in scuccessfully' };
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout(res);
    return { message: 'logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('check-auth')
  async isAuth(@Req() req: Request) {
    return req['user'];
  }
}
