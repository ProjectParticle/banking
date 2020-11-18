/**
 * Database connection provider
 */

import { MissingArgumentError } from '@speedup/error';
import { Pool as PostgresPool } from 'pg';

import { DatabaseConfig } from '../type/database';

export const create = async (config?: DatabaseConfig): Promise<PostgresPool> => {

	if (!config) { throw new MissingArgumentError('config'); }

	const pool = new PostgresPool({
		// common settings
		application_name: config.applicationName,
		connectionString: config.connectionString,

		// parser
		parseInputDatesAsUTC: true,

		// timeouts
		connectionTimeoutMillis: config.connectionTimeoutMillis,
		idleTimeoutMillis: config.idleTimeoutMillis,
		idle_in_transaction_session_timeout: config.idleInTransactionSessionTimeout,
		query_timeout: config.queryTimeout,
		statement_timeout: config.statementTimeout,
	});

	// create a dummy connection to test database connectivity
	await pool.query('SELECT 1');

	return pool;
};
