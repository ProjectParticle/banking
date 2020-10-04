/**
 * Database types
 */

export type TransactionRecord = {

	/**
	 * Time that transaction has taken place
	 */
	timestamp: Date,

	/**
	 * Unique transaction code
	 */
	code: string,

	/**
	 * Account number
	 */
	account_number: string,

	/**
	 * Transaction amount
	 */
	amount: number,

	/**
	 * Balance after transaction
	 */
	balance: number,

	/**
	 * Human-friendly information about current transaction
	 */
	description?: string,

	/**
	 * Machine-friendly information about current transaction
	 */
	meta?: any,
};

export type Transaction = {

	/**
	 * Time that transaction has taken place
	 */
	timestamp: Date,

	/**
	 * Unique transaction code
	 */
	code: string,

	/**
	 * Account number
	 */
	accountNumber: string,

	/**
	 * Transaction amount
	 */
	amount: number,

	/**
	 * Balance after transaction
	 */
	balance: number,

	/**
	 * Human-friendly information about current transaction
	 */
	description?: string,

	/**
	 * Machine-friendly information about current transaction
	 */
	meta?: any,
};

export type TransactionResult = {

	/**
	 * Transaction code
	 */
	code: string,

	/**
	 * New balance
	 */
	balance: number,
};

export type GetBalanceResult = {

	/**
	 * Current balance
	 */
	balance: number,
};

export type TransactionHistoryOptions = {

	/**
	 * Pagination options
	 */
	pagination?: TransactionHistoryPaginationOptions,

	/**
	 * Date filtering options
	 */
	date?: TransactionHistoryDateRangeOptions,
};

export type TransactionHistoryPaginationOptions = {

	/**
	 * Index of the first item in the list
	 */
	pageNumber: number, // 1-based (not zero-based)

	/**
	 * Number of items per page
	 */
	pageSize: number,
};

export type TransactionHistoryDateRangeOptions = {

	/**
	 * First acceptable date
	 */
	from: Date,

	/**
	 * Last acceptable date
	 */
	to: Date,
};

export type TransactionHistoryResult = {

	/**
	 * Current page
	 */
	currentPage: number,

	/**
	 * Items per page
	 */
	pageSize: number,

	/**
	 * Total available number of records
	 */
	totalCount: number,

	/**
	 * List of transactions
	 */
	transactions: Array<Transaction>,
}
