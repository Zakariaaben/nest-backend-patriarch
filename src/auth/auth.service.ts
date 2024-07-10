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
    const verifiedUser = await this.usersService.findByName(user.name);
    if (
      !verifiedUser ||
      !(await bcrypt.compare(user.password, verifiedUser.password))
    )
      throw new UnauthorizedException('Invalid credentials');

    const payload = { name: verifiedUser.name, sub: verifiedUser.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
    };
  }

  logout() {
    return 'logout';
  }

  setCookie(res: Response, token: string) {
    res.cookie('jwt', token, { httpOnly: true });
  }
}
