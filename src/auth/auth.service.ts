import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserDto } from 'src/users/dtos/createUser.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: UserDto): Promise<{ access_token: string }> {
    const verifiedUser = await this.usersService.findByName(user.username);

    if (!verifiedUser) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (!(await bcrypt.compare(user.password, verifiedUser.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: verifiedUser.username, sub: verifiedUser.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      }),
    };
  }

  logout(res: Response) {
    res.clearCookie('jwt');
    return;
  }

  setCookie(res: Response, token: string) {
    res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax' });
    return;
  }
}
