import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
@Injectable()
export class AuthValidationMiddleware implements NestMiddleware {
	async use(req: Request, res: Response, next: NextFunction) {
		// const body: any = req.body;
		// const login = new LoginUserDto();
		// const errors: any = [];

		// Object.keys(body).forEach((key) => {
		// 	login[key] = body[key];
		// });

		// try {
		// 	await validateOrReject(login);
		// } catch (errs) {
		// 	errs.forEach((err: any) => {
		// 		Object.values(err.constraints).forEach((constraint) => errors.push(constraint));
		// 	});
		// }

		// if (errors.length) {
		// 	throw new BadRequestException(errors);
		// }

		next();
	}
}
