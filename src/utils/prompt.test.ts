import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

type Store = Map<string, string[]>;
const store: Store = (globalThis as { __confStore?: Store }).__confStore ?? new Map();
(globalThis as { __confStore?: Store }).__confStore = store;

class FakeConf {
    #projectName: string;
    constructor({ projectName }: { projectName: string }) {
        this.#projectName = projectName;
    }

    has(key: string) {
        return store.has(`${this.#projectName}:${key}`);
    }

    get(key: string) {
        return store.get(`${this.#projectName}:${key}`);
    }

    set(key: string, value: string[]) {
        store.set(`${this.#projectName}:${key}`, value);
    }
}

mock.module('conf', () => ({
    default: FakeConf,
}));

const meowMock = mock(() => ({
    flags: {
        input: ['input.mp4'],
        keys: ['abc123'],
        language: 'ar',
    },
}));

mock.module('meow', () => ({
    default: (...args: unknown[]) => meowMock(...args),
}));

const { getCliArgs } = await import('./prompt.ts');
const { getApiKeys } = await import('./config.ts');

beforeEach(() => {
    store.clear();
    meowMock.mockReset();
    meowMock.mockImplementation(() => ({
        flags: {
            input: ['input.mp4'],
            keys: ['abc123'],
            language: 'ar',
        },
    }));
});

afterEach(() => {
    store.clear();
});

describe('getCliArgs', () => {
    it('should persist keys when provided', () => {
        const result = getCliArgs();
        expect(result.flags.keys).toEqual(['abc123']);
        expect(getApiKeys('ar')).toEqual(['abc123']);
    });

    it('should fallback to stored keys when not provided', () => {
        store.set('tafrigh-cli:global_keys', ['stored']);
        meowMock.mockImplementation(() => ({
            flags: {
                input: ['input.mp4'],
                keys: [],
                language: 'global',
            },
        }));

        const result = getCliArgs();
        expect(result.flags.keys).toEqual(['stored']);
    });
});
