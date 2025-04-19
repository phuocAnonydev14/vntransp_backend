import { AuthStrategy } from '@/apis/auth/auth.const';
import { UserService } from '@/apis/user/user.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.USER_JWT) {
	constructor(private readonly userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET
		});
	}
	async validate(payload: UserJwtPayload) {
		return await this.userService.validateUserById(payload.id);
	}
}
