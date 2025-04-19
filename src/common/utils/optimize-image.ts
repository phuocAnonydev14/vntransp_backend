import * as sharp from 'sharp';

/**
 * Optimize an image by resizing and compressing it.
 * @param buffer - The buffer of the image to optimize.
 * @param width - The width to resize the image to.
 * @param height - The height to resize the image to.
 * @returns The optimized image buffer.
 */
export async function optimizeImage(buffer: Buffer): Promise<Buffer> {
	return await sharp(buffer)
		.resize({
			fit: sharp.fit.cover,
			position: sharp.strategy.entropy
		})
		.toFormat('jpeg', { quality: 80 })
		.toBuffer();
}
