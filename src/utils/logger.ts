import pino, { Logger } from 'pino';
import pretty from 'pino-pretty';
import process from 'process';

const stream = pretty({
    colorize: true,
});

const logger: Logger = pino.default(
    {
        base: { hostname: undefined, pid: undefined }, // This will remove pid and hostname but keep time
        level: process.env.LOG_LEVEL || 'info',
    },
    stream,
);

export default logger;
