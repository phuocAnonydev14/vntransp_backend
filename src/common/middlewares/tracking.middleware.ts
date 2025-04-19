import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express'; // Import the 'Request' type
@Injectable()
export class TrackingMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		const trackingId = req.cookies['tracking-id'] || generateTrackingId();
		res.cookie('tracking-id', trackingId, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: true
		}); // 30 days expiry

		// Log user activity (you can replace this with your actual logging mechanism)
		console.log(
			`Tracking ID: ${trackingId}, URL: ${req.baseUrl}, Method: ${req.method}, Referer: ${req.headers.referer}, date: ${new Date().toISOString()}`
		);
		next();
	}
}

function generateTrackingId(): string {
	return Math.random().toString(36).substring(2);
}
