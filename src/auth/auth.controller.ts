import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDto } from 'src/users/dtos/createUser.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() Credentials: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(Credentials);
    this.authService.setCookie(res, token.access_token);

    return { message: 'logged in scuccessfully' };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return req['user'];
  }
}
