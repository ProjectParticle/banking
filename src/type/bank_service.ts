/**
 * Bank service
 */

import { Transaction, TransactionHistoryOptions, TransactionHistoryResult, TransactionResult } from './database_types';

export interface BankService {

	/**
	 * Get an account balance
	 * @param accountNumber Target account number
	 */
	getCurrentBalance(accountNumber: string): Promise<number>;

	/**
	 * Add a new transaction
	 * @param accountNumber Account number
	 * @param amount Amount of money/credit
	 * @param timestamp Time that the transaction occurred
	 * @param code Transaction code
	 * @param description Human-friendly extra information
	 * @param meta Machine-friendly extra information
	 */
	addTransaction(
		accountNumber: string,
		amount: number,

		timestamp?: Date,
		code?: string,
		description?: string,
		meta?: any, // eslint-disable-line @typescript-eslint/no-explicit-any

	): Promise<TransactionResult>;

	/**
	 * Transfer money between two accounts
	 * @param fromAccountNumber Transfer money/credit from this account
	 * @param amount Amount of money/credit to transfer
	 * @param toAccountNumber Transfer money/credit to this account
	 * @param timestamp Time that the transaction occurred
	 * @param code Transaction code
	 * @param description Human-friendly extra information
	 * @param meta Machine-friendly extra information
	 */
	transfer(

		fromAccountNumber: string,
		amount: number,

		toAccountNumber: string,

		timestamp?: Date,
		code?: string,
		description?: string,
		meta?: any, // eslint-disable-line @typescript-eslint/no-explicit-any

	): Promise<Array<TransactionResult>>;

	/**
	 * Get account transactions history
	 * @param accountNumber Target account number
	 * @param options History options
	 */
	getAccountHistory(accountNumber: string, options?: TransactionHistoryOptions): Promise<TransactionHistoryResult>;

	/**
	 * Retrieve transaction details by it's code
	 * @param code Transaction code
	 */
	getTransactionByCode(code: string): Promise<Transaction>;
};
