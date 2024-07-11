import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  ) {}

  async login(user: UserDto): Promise<{ access_token: string }> {
    const verifiedUser = await this.usersService.findByName(user.username);

    if (!verifiedUser) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (!(await bcrypt.compare(user.password, verifiedUser.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { name: verifiedUser.name, sub: verifiedUser.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
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

  async verifyToken(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new Error();
      }
      if (new Date(user.updatedAt).getTime() > payload.iat * 1000) {
        throw new Error();
      }
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
