import { describe, it, expect, mock, beforeEach } from 'bun:test';

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

const { getApiKeys, hasApiKeys, saveApiKeys } = await import('./config.ts');

describe('config', () => {
    beforeEach(() => {
        store.clear();
    });

    it('should return false when no keys saved', () => {
        expect(hasApiKeys('global')).toBe(false);
    });

    it('should save and retrieve keys', () => {
        saveApiKeys('global', ['abc', 'def']);
        expect(hasApiKeys('global')).toBe(true);
        expect(getApiKeys('global')).toEqual(['abc', 'def']);
    });

    it('should return empty array when no keys exist', () => {
        expect(getApiKeys('missing')).toEqual([]);
    });
});
