/**
 * API server
 */

import Express, { Application, Request, Response, NextFunction, } from 'express';
import { ApplicationError, HttpError, MissingArgumentError, } from '@speedup/error';

import { ApiApplicationConfig, } from '../type/api_server';
import { Health, } from '../type/health';
import { Logger, } from '../type/logger';

import * as healthRouteFactory from './route/health';

export const create = async (

	config?: ApiApplicationConfig,

	healthService?: Health,

	logger?: Logger,

): Promise<Application> => {

	if (!config) { throw new MissingArgumentError('healthService'); }
	if (!healthService) { throw new MissingArgumentError('healthService'); }
	if (!logger) { throw new MissingArgumentError('logger'); }

	const app = Express();

	app.set('x-powered-by', false);
	app.set('etag', false);

	// register /health
	app.use(
		'/health',
		await healthRouteFactory.create(healthService),
	);

	// homepage
	app.get(
		'/',
		(req, res, next) => setTimeout(next, 1 * 1000),
		(req, res) => res.status(200).send({
			version: config.appVersion,
			uptime: process.uptime(),
		})
	);

	// error handler
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((err: HttpError | ApplicationError | Error, req: Request, res: Response, next: NextFunction) => {

		let statusCode = 500;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let responseBody: any = {
			code: 'E_FATAL_ERROR',
			message: 'Fatal error occurred.'
		};

		if (err instanceof HttpError) {

			statusCode = err.statusCode;
			res.statusMessage = err.statusMessage || res.statusMessage;

			responseBody = {
				code: err.code,
				message: err.message,
			};

			// prepare developer-friendly error message
			if (config.environment === 'dev') {
				responseBody.error = err;
			}
		}
		else if (err instanceof ApplicationError) {

			// prepare developer-friendly error message
			if (config.environment === 'dev') {
				responseBody = err;
			}
			else {

				// prepare user-friendly error message
				responseBody = {
					code: err.code,
					message: err.message,
				};
			}
		}

		// log the error using logger
		logger.error(err.message, err);

		// send error to the user
		res.status(statusCode).send(responseBody);
	});

	return app;
};
