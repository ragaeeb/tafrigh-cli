import Conf from 'conf';

import { name } from './constants.js';

const config = new Conf({ projectName: name });

export const hasApiKeys = (language: string): boolean => config.has(`${language}_keys`);

export const getApiKeys = (language: string): string[] => {
    if (hasApiKeys(language)) {
        return config.get(`${language}_keys`) as string[];
    }

    return [];
};

export const saveApiKeys = (language: string, keys: string[]) => {
    config.set(`${language}_keys`, keys);
};
