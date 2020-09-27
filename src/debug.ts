/**
 * Debug mode
 */

import { resolve as resolvePath } from 'path';
import { config as loadEnv } from 'dotenv';

loadEnv({
	path: resolvePath(__dirname, '..', '.env')
});

import './main';
