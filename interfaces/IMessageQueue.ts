// /Users/rotour/projects/mindforge/src/lib/ddd/interfaces/IMessageQueue.ts

/**
 * Generic options for a job that can be added to a queue.
 * This provides an abstraction over implementation-specific options.
 */
export interface JobOptions {
	delay?: number;
	jobId?: string;
}

export type Job<T> = {
	name: string;
	data: T;
	opts?: JobOptions;
};

export interface IMessageQueue {
	add<T>(job: Job<T>): Promise<any>;
	process<T>(name: string, callback: (job: Job<T>) => Promise<void>): void;
}
