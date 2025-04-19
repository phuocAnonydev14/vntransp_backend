import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
	// constructor(private reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return super.canActivate(context);
	}

	handleRequest<TUser = any>(err: any, user: any, _: any, context: ExecutionContext): TUser {
		if (err || !user) {
			throw (
				err || new ForbiddenException('You do not have permission to perform this action')
			);
		}
		const roles = Reflect.getMetadata('roles', context.getHandler());
		if (!roles.includes(user.role.name)) {
			throw new ForbiddenException('You do not have permission to perform this action');
		}
		return user;
	}
}
