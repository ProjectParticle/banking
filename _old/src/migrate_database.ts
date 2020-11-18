/**
 * Database migration service
 */

import { resolve as resolvePath, join as joinPath } from 'path';

import * as dbMigration from '@keendev/db-migration';
import { MissingArgumentError } from '@speedup/error';

import { DatabaseConfig } from './type/database';

export const apply = async (databaseConfig?: DatabaseConfig): Promise<void> => {

    if (!databaseConfig) { throw new MissingArgumentError('databaseConfig'); }

    // update database to the latest version
    await (await dbMigration.migration.postgres.create(

        // migration repository
        await dbMigration.repository.fileSystem.create({
            migrationsDirectory: resolvePath(joinPath(__dirname, 'migration')),
            fileExtension: '.sql',
        }),

        // template engine
        dbMigration.template.ejs.create(),

        // migration config
        {
            keepTrackOfMigration: true,
            schemaName: databaseConfig.schemaName,
            tableName: databaseConfig.migrationTableName,
        },

        // database connection
        {
            // common settings
            application_name: databaseConfig.applicationName,
            connectionString: databaseConfig.connectionString,

            // parser
            parseInputDatesAsUTC: true,

            // timeouts
            connectionTimeoutMillis: databaseConfig.connectionTimeoutMillis,
            idleTimeoutMillis: databaseConfig.idleTimeoutMillis,
            idle_in_transaction_session_timeout: databaseConfig.idleInTransactionSessionTimeout,
            query_timeout: databaseConfig.queryTimeout,
            statement_timeout: databaseConfig.statementTimeout,
        },
    )).apply({
        databaseItemsPrefix: databaseConfig.databaseItemsPrefix || ''
    });
};
