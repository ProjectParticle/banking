/**
 * Bank implementation in PostgreSQL
 */

import { ApplicationError, MissingArgumentError } from '@speedup/error';
import { Pool as PostgresConnectionPool, } from 'pg';

import { BankService } from '../type/bank_service';
import { DatabaseConfig } from '../type/database';
import { GetBalanceResult, Transaction, TransactionHistoryOptions, TransactionHistoryResult, TransactionRecord, TransactionResult } from '../type/database_types';

export class BankPostgres implements BankService {

	private readonly databaseConfig: DatabaseConfig;
	private readonly connectionPool: PostgresConnectionPool;

	private readonly getAccountHistoryDefaultOptions: TransactionHistoryOptions = {

		pagination: {
			pageNumber: 1,
			pageSize: 20
		}
	};

	constructor(databaseConfig?: DatabaseConfig, connectionPool?: PostgresConnectionPool,) {
		if (!databaseConfig) { throw new MissingArgumentError('databaseConfig'); }
		if (!connectionPool) { throw new MissingArgumentError('connectionPool'); }

		this.databaseConfig = databaseConfig;
		this.connectionPool = connectionPool;
	}

	private async getAccountHistoryViewName(accountNumber: string): Promise<string> {

		// get the method name
		const methodName = `${this.databaseConfig.databaseItemsPrefix}get_account_history_view_name`;

		const result = await this.connectionPool.query(
			`SELECT * from "${this.databaseConfig.schemaName}".${methodName}($1)`,
			[accountNumber]
		);

		return result.rows[0][methodName];
	}

	async getAccountBalance(accountNumber: string): Promise<number> {

		// get the method name
		const methodName = `${this.databaseConfig.databaseItemsPrefix}get_balance`;

		const result = await this.connectionPool.query<GetBalanceResult>(
			`SELECT balance from "${this.databaseConfig.schemaName}".${methodName}($1) as balance`,
			[accountNumber]
		);

		// the first item is the result
		return result.rows[0].balance;
	}

	async addTransaction(

		accountNumber: string,
		amount: number,

		timestamp?: Date,
		code?: string,
		description?: string,
		meta?: any, // eslint-disable-line @typescript-eslint/no-explicit-any

	): Promise<TransactionResult> {

		// get the method name
		const methodName = `${this.databaseConfig.databaseItemsPrefix}insert_transaction`;

		const result = await this.connectionPool.query<TransactionResult>(
			`SELECT * from "${this.databaseConfig.schemaName}".${methodName}($1, $2, $3, $4, $5, $6)`,
			[accountNumber, amount, code, timestamp || new Date(), description, meta]
		);

		// the first item is the result
		return result.rows[0];
	}

	async transfer(

		fromAccountNumber: string,
		amount: number,

		toAccountNumber: string,

		timestamp?: Date,
		code?: string,
		description?: string,
		meta?: any, // eslint-disable-line @typescript-eslint/no-explicit-any

	): Promise<Array<TransactionResult>> {

		// get the method name
		const methodName = `${this.databaseConfig.databaseItemsPrefix}transfer`;

		const result = await this.connectionPool.query<TransactionResult>(
			`SELECT * from "${this.databaseConfig.schemaName}".${methodName}($1, $2, $3, $4, $5, $6, $7)`,
			[fromAccountNumber, amount, toAccountNumber, code, timestamp || new Date(), description, meta]
		);

		// the first item is the result
		return result.rows;
	}

	async getAccountHistory(accountNumber: string, options?: TransactionHistoryOptions): Promise<TransactionHistoryResult> {

		// merge with default values
		options = {
			...this.getAccountHistoryDefaultOptions,
			...(options || {})
		};

		if (!options.date) {

			const currentDate = new Date();
			currentDate.setHours(0);
			currentDate.setMinutes(0);
			currentDate.setSeconds(0);
			currentDate.setMilliseconds(0);

			const lastMonthDate = new Date();
			lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
			currentDate.setHours(23);
			currentDate.setMinutes(59);
			currentDate.setSeconds(59);
			currentDate.setMilliseconds(999);

			options.date = {
				from: lastMonthDate,
				to: currentDate,
			};
		}

		if (options!.pagination!.pageNumber < 1) {
			throw new ApplicationError({
				code: 'E_INVALID_PAGE_NO',
				message: 'pageNumber must be 1-based positive number.'
			});
		}

		if (options!.pagination!.pageSize < 1) {
			throw new ApplicationError({
				code: 'E_INVALID_PAGE_SIZE',
				message: 'pageSize must be greater than or equal to 1.'
			});
		}

		// get the method name
		const viewName = await this.getAccountHistoryViewName(accountNumber);

		let sql = `SELECT *, count(code) OVER() as total_count FROM ${viewName}`;
		const params: Array<any> = [];

		// date range filter
		sql += ' WHERE ';
		sql += ` timestamp >= $${params.push(options.date.from)} AND timestamp <= $${params.push(options.date.to)} `;

		// pagination
		let offset = 0;

		if (options!.pagination!.pageNumber > 1) {
			offset = ((options!.pagination!.pageNumber - 1) * options!.pagination!.pageSize);
		}

		sql += ` LIMIT $${params.push(options!.pagination!.pageSize)} OFFSET $${params.push(offset)} `;

		const output: TransactionHistoryResult = {
			currentPage: options!.pagination!.pageNumber,
			pageSize: options!.pagination!.pageSize,

			totalCount: 0,

			transactions: []
		};

		const result = await this.connectionPool.query<TransactionRecord>(
			sql,
			params,
		);

		// update totalCount
		if (result.rowCount > 0) {
			output.totalCount = (result.rows[0] as any)['total_count'];
		}

		// transform the result
		output.transactions = result.rows.map(row => ({

			accountNumber: row.account_number.trim(),
			amount: row.amount,
			balance: row.balance,
			code: row.code,
			timestamp: row.timestamp,
			description: row.description,
			meta: row.meta,
		}));

		return output;
	}

	async getTransactionByCode(code: string): Promise<Transaction> {

		// get the method name
		const methodName = `${this.databaseConfig.databaseItemsPrefix}transaction`;

		// Retrieve a specific record
		const result = await this.connectionPool.query<TransactionRecord>(
			`SELECT * FROM "${this.databaseConfig.schemaName}".${methodName} WHERE code=$1 LIMIT 1`,
			[code]
		);

		// record not found
		if (result.rowCount === 0) {
			throw new ApplicationError({
				code: 'E_NOT_FOUND',
				message: `Transaction with code '${code}' does not exists.`
			});
		}

		// assign a short name
		const transactionRecord = result.rows[0];

		// Transform record to an object
		// I did this to prevent leaking extra information from database to the clients
		return {
			accountNumber: transactionRecord.account_number.trim(),
			amount: transactionRecord.amount,
			balance: transactionRecord.balance,
			code: transactionRecord.code,
			timestamp: transactionRecord.timestamp,
			description: transactionRecord.description,
			meta: transactionRecord.meta,
		};
	}
}
