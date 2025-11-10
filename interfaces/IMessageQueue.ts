// /Users/rotour/projects/mindforge/src/lib/ddd/interfaces/MessageQueue.interface.ts
export type Job<T, O = undefined> = {
	name: string;
	data: T;
	opts?: O;
};

export interface IMessageQueue {
	add<T>(job: Job<T>): Promise<any>;
	process<T>(name: string, callback: (job: Job<T>) => Promise<void>): void;
}
