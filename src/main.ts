/**
 * Radar service
 */

import HttpServer from '@speedup/async-http-server';

import * as apiFactory from './api';
import * as config from './config';
import { Health, } from './service/health';
import { apply as migrateDatabase } from './migrate_database';

import { create as createLogger, } from './service/logger';
import { Notifier, } from './service/notifier';
import { RedisNotificationChannel, } from './service/redis_notification_channel';
import { HealthStatus } from './type/health';

(async (): Promise<{ healthService: Health, }> => {

	const healthService = new Health();
	const logger = createLogger(config.logger());

	// migrate database to the latest version
	await migrateDatabase(config.databaseConfig());

	// prepare API application
	const apiApplication = await apiFactory.create(
		config.apiApplication(),

		healthService,
		logger,
	);

	// prepare API server
	const apiServer = new HttpServer({
		handler: apiApplication,
		...config.httpServer(),
	});

	// start API server
	await apiServer.start();

	// prepare notification channel
	// const redisNotificationChannel = new RedisNotificationChannel(
	// 	config.redisNotificationAppConfig(),
	// 	config.redisNotificationRedisClient(),
	// );

	// const notifier = new Notifier(
	// 	redisNotificationChannel,
	// 	logger,
	// );

	healthService.setHealthState(HealthStatus.Alive);

	return {
		healthService,
	}
})
	()
	.then(({ healthService: Health }) => {

		Health.setHealthState(HealthStatus.Ready);
		console.debug('[Particle.LocalBank] Service is started.');
	})
	.catch(err => {

		console.error('[Particle.LocalBank] Failed to start service.', err);
		process.exit(1);
	});
