/**
 * Logger
 */

import { MissingArgumentError, ApplicationError } from '@speedup/error';
import winston, { createLogger } from 'winston';
import { Syslog } from 'winston-syslog';

import { Logger as ILogger, LoggerConfig, } from '../type/logger';

export const create = (config?: LoggerConfig): ILogger => {

	if (!config) { throw new MissingArgumentError('config'); }

	const logger = createLogger({
		transports: [],
		exitOnError: true
	});

	if (config.environment === 'dev') {

		logger.add(new winston.transports.Console({
			handleExceptions: true,
			level: 'debug',
		}));
	}

	if (config.syslog) {

		logger.add(
			new Syslog(
				{
					app_name: config.instanceName,
					handleExceptions: true,
					...config.syslog
				}
			)
		);
	}

	if (logger.transports.length === 0) {
		throw new ApplicationError({
			code: 'E_LOGGER_NO_TRANSPORT',
			message: 'No transport is configured for the logger.'
		});
	}

	return logger;
};
