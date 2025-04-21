import logSymbols from 'log-symbols';
import mime from 'mime-types';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import logger from './logger.js';

export const filterMediaFiles = (paths: string[]): string[] => {
    const filteredMediaFiles: string[] = [];
    for (const filePath of paths) {
        const mimeType = mime.lookup(filePath);
        if (!mimeType) continue;

        const type = mimeType.split('/')[0];
        if (type === 'audio' || type === 'video') {
            filteredMediaFiles.push(filePath);
        }
    }
    return filteredMediaFiles;
};

export const collectMediaFiles = async (input: string): Promise<Record<string, string>> => {
    const info = await fs.stat(input);
    const idToInputSource: Record<string, string> = {};

    if (info.isFile()) {
        const parsed = path.parse(path.resolve(input));
        idToInputSource[parsed.name] = input;
    } else if (info.isDirectory()) {
        const files = await fs.readdir(input);
        const mediaFiles = filterMediaFiles(files)
            .map((file) => path.join(input, file))
            .map((file) => path.resolve(file));

        for (const mediaFile of mediaFiles) {
            const parsed = path.parse(path.resolve(path.join(mediaFile)));
            idToInputSource[parsed.name] = mediaFile;
        }
    } else {
        logger.warn(`${logSymbols.warning} Skipping ${input}`);
    }

    return idToInputSource;
};
