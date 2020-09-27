/**
 * Health service
 */

import { Health as IHealth, HealthStatus } from '../type/health';

export class Health implements IHealth {

	private currentState: HealthStatus = HealthStatus.Initializing;

	async getHealthState(): Promise<HealthStatus> {
		return this.currentState;
	}

	async setHealthState(newState: HealthStatus): Promise<void> {
		this.currentState = newState;
	}
}
