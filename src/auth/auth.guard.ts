import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtTokenFromCookies(request);

    const payload = await this.verifyToken(token);
    request['user'] = payload;
    return true;
  }

  private extractJwtTokenFromCookies(request: Request): string | undefined {
    return request.cookies['jwt'];
  }

  async verifyToken(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
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
