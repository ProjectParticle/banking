/**
 * Logger
 */

import { EnvironmentName } from './shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoggingMethod = (message: string, ...args: Array<any>) => void;

export type LoggerConfig = {

    /**
     * Environment name
     */
    environment: EnvironmentName;

    /**
     * Application name (used in log messages)
     */
    instanceName: string;

    /**
     * Syslog configuration
     * visit https://www.npmjs.com/package/winston-syslog
     */
    syslog?: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
};

export interface Logger {

    debug: LoggingMethod;
    info: LoggingMethod;
    warn: LoggingMethod;
    error: LoggingMethod;

    log: LoggingMethod;
}
