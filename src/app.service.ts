import { Injectable } from '@nestjs/common';
import * as packageJson from '../package.json';

@Injectable()
export class AppService {
	getHello(): string {
		const name = packageJson.name;
		const version = packageJson.version;
		return `${name} v${version}`;
	}
}
