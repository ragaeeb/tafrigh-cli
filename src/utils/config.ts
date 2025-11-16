import Conf from 'conf';

import { name } from './constants.js';

const config = new Conf({ projectName: name });

/**
 * Checks whether API keys are stored for the requested language.
 *
 * @param language - The language namespace for the keys.
 * @returns True when keys are persisted.
 */
export const hasApiKeys = (language: string): boolean => config.has(`${language}_keys`);

/**
 * Retrieves stored API keys for the requested language.
 *
 * @param language - The language namespace for the keys.
 * @returns A list of API keys, or an empty array when none are stored.
 */
export const getApiKeys = (language: string): string[] => {
    if (hasApiKeys(language)) {
        return config.get(`${language}_keys`) as string[];
    }

    return [];
};

/**
 * Persists API keys for a specific language namespace.
 *
 * @param language - The language namespace to assign the keys to.
 * @param keys - The API keys to store.
 */
export const saveApiKeys = (language: string, keys: string[]) => {
    config.set(`${language}_keys`, keys);
};
