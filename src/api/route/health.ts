/**
 * Health API
 */

import { Handler, Router, } from 'express';
import { MissingArgumentError, } from '@speedup/error';

import { Health, HealthStatus, } from '../../type/health';

export const create = async (healthService?: Health): Promise<Handler> => {

	if (!healthService) { throw new MissingArgumentError('healthService'); }

	const router = Router();

	// add purposeful delay
	router.use((req, res, next) => setTimeout(next, 1 * 1000));

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	router.get('/', async (req, res, next): Promise<void> => {
		res.status(200).contentType('text/plain').send('SERVER_IS_INITIALIZING');
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	router.get('/live', async (req, res, next): Promise<void> => {

		try {
			const healthState = await healthService.getHealthState();
			const responseStatus: number = healthState !== HealthStatus.Initializing ? 200 : 503;
			const responseText: string = healthState !== HealthStatus.Initializing ? 'SERVER_IS_ALIVE' : 'SERVER_IS_NOT_ALIVE';

			res.status(responseStatus).contentType('text/plain').send(responseText);
		}
		catch (err) {

			return next(err);
		}
	});

	router.get('/ready', async (req, res, next): Promise<void> => {

		try {
			const healthState = await healthService.getHealthState();
			const responseStatus = healthState === HealthStatus.Ready ? 200 : 503;
			const responseText = healthState === HealthStatus.Ready ? 'SERVER_IS_READY' : 'SERVER_IS_NOT_READY';

			res.status(responseStatus).contentType('text/plain').send(responseText);
		}
		catch (err) {

			return next(err);
		}
	});

	return router;
};
