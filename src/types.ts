export type TafrighFlags = {
    flags: {
        chunkDuration?: number;
        concurrency?: number;
        keys: string[];
        output: string;
    };
    input: string[];
};
