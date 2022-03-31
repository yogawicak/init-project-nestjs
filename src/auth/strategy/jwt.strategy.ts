import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDecoded } from 'src/common/UserDecoded';
import { UserService } from 'src/user/user.service';
import { Reflector } from '@nestjs/core';
import { ROLE } from 'src/user/entities/user.role';

// interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private reflector: Reflector) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get('JWT_SECRET'),
    });
    // this.config = config;
  }

  async validate(payload: UserDecoded) {
    return payload;
  }
}
