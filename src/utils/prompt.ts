import meow from 'meow';

import { getApiKeys, hasApiKeys, saveApiKeys } from './config.js';
import { HELP_TEXT } from './constants.js';

export const getCliArgs = (): any => {
    const myFlags = {
        chunkDuration: {
            default: 300,
            shortflag: 'd',
            type: 'number',
        },
        concurrency: {
            shortflag: 'c',
            type: 'number',
        },
        keys: {
            default: [],
            isMultiple: true,
            isRequired: (flags: Record<string, string>) => {
                return !hasApiKeys(flags.language);
            },
            shortflag: 'k',
            type: 'string',
        },
        language: {
            default: 'global',
            shortflag: 'l',
            type: 'string',
        },
        output: {
            isRequired: (_flags: Record<string, string>, input: string[]) => {
                return input.length > 1;
            },
            shortflag: 'o',
            type: 'string',
        },
    };

    const result = meow(HELP_TEXT, {
        allowUnknownFlags: false,
        flags: myFlags as any,
        importMeta: import.meta,
    });

    const keys: string[] = result.flags.keys as string[];

    if (keys.length > 0) {
        saveApiKeys(result.flags.language as string, keys);
    } else {
        result.flags.keys = getApiKeys(result.flags.language as string);
    }

    return result;
};
