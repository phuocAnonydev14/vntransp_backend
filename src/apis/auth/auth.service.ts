import { UserEntity } from '@/apis/user/entities/user.entity';
import { ICacheService } from '@/module/cache/cache.interface';
import { IJwtService } from '@/module/jwt/jwt.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto, TokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: IJwtService,
		private readonly configService: ConfigService,
		private readonly cacheService: ICacheService
	) {}

	async createToken(user: UserEntity) {
		const payload: JwtPayload = {
			id: user.id,
			roleId: user.role.id
		};

		const { accessToken, refreshToken } = await this.generateToken(payload);
		return { user, accessToken, refreshToken };
	}

	/**
	 * Refreshes the access token using the provided refresh token.
	 * If the refresh token is valid and not blacklisted, a new access token is generated.
	 * Otherwise, an UnauthorizedException is thrown.
	 *
	 * @param refreshTokenDto - The DTO containing the refresh token.
	 * @returns A Promise that resolves to the new access token.
	 * @throws UnauthorizedException if the refresh token is blacklisted.
	 */
	async refreshToken(refreshTokenDto: RefreshTokenDto) {
		const data = await this.jwtService.verify(refreshTokenDto.refreshToken);

		const isCheckBlackListedRefreshToken = await this.cacheService.get(
			refreshTokenDto.refreshToken
		);

		if (isCheckBlackListedRefreshToken) {
			throw new UnauthorizedException('access_denied');
		}

		// renew token
		const payload: JwtPayload = {
			id: data.id,
			roleId: data.roleId
		};

		return await this.generateToken(payload);
	}

	private async generateToken(payload: JwtPayload): Promise<TokenDto> {
		const expiresInAccessToken = this.configService.get<string>('JWT_EXPIRATION_TIME');
		const expiresInRefreshToken = this.configService.get<string>('JWT_REFRESH_TOKEN_TIME');

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.sign(payload, {
				expiresIn: expiresInAccessToken
			}),
			this.jwtService.sign(payload, {
				expiresIn: expiresInRefreshToken
			})
		]);

		return { accessToken, refreshToken };
	}

	/**
	 * Logs out the user by invalidating the refresh token.
	 * @param refreshTokenDto - The refresh token DTO containing the refresh token.
	 * @returns An empty object.
	 */
	async logout(refreshTokenDto: RefreshTokenDto) {
		const data = await this.jwtService.verify(refreshTokenDto.refreshToken);

		const currentTime = Math.floor(Date.now() / 1000);
		const refreshToken = refreshTokenDto.refreshToken;

		const expiredTime = data.exp - currentTime;

		await this.cacheService.set(refreshToken, refreshToken, expiredTime);

		return {};
	}
}
