import { ApiController } from '@/common/base/base.swagger';
import { User } from '@/common/decorator/user.decorator';
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Query,
	UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthStrategy } from './auth.const';
import { AuthService } from './auth.service';
import { ForgetPasswordDto } from './dto/forget-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
@ApiController('Auth')
@ApiBearerAuth('access-token')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {}

	@Post('user/login')
	@UseGuards(AuthGuard(AuthStrategy.USER_LOCAL))
	@HttpCode(200)
	async loginUser(@Body() _loginUserDto: LoginUserDto, @User() user: UserEntity) {
		return this.authService.createToken(user);
	}

	@Post('user/login/admin')
	@UseGuards(AuthGuard(AuthStrategy.ADMIN_LOCAL))
	@HttpCode(200)
	async loginAdmin(@Body() _loginUserDto: LoginUserDto, @User() user: UserEntity) {
		return this.authService.createToken(user);
	}

	@UseGuards(AuthGuard(AuthStrategy.USER_JWT))
	@Get('user/profile')
	async profile(@User() user: any) {
		return user;
	}

	@Post('user/refresh-token')
	@UseGuards(AuthGuard(AuthStrategy.USER_RF_JWT))
	async refreshToken(@User() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshToken(refreshTokenDto);
	}

	@UseGuards(AuthGuard(AuthStrategy.USER_RF_JWT))
	@Get('user/logout')
	async logout(@User() refreshTokenDto: RefreshTokenDto) {
		return this.authService.logout(refreshTokenDto);
	}

	@Get('verify')
	async verifyEmail(@Query('token') token: string) {
		if (!token) {
			throw new BadRequestException('Token is missing');
		}

		const user = await this.userService.verifyEmailToken(token);
		if (!user) {
			throw new BadRequestException('Invalid token');
		}

		return {
			message: 'Email verified successfully'
		};
	}

	@Post('user/forget-password')
	async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
		this.userService.generateAndUpdateForgetPasswordToken(forgetPasswordDto.email);

		return { message: 'New password has been sent to your email' };
	}
}
