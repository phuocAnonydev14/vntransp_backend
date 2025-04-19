import { AuthStrategy } from '@/apis/auth/auth.const';
import { UserService } from '@/apis/user/user.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy, AuthStrategy.ADMIN_LOCAL) {
	constructor(private readonly userService: UserService) {
		super({
			usernameField: 'email',
			passwordField: 'password'
		});
	}

	async validate(email: string, password: string) {
		return this.userService.validateAdminByEmailPassword(email, password);
	}
}
