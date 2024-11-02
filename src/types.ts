export type TafrighFlags = {
    flags: {
        chunkDuration?: number;
        concurrency?: number;
        ext?: string;
        keys: string[];
        output: string;
    };
    input: string[];
};
