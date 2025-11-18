import type { TranscribeOptions } from 'tafrigh';

import type { TafrighFlags } from '../types.js';
import { collectMediaFiles } from './io.js';
import { collectVideos } from './mediaUtils.js';

/**
 * Determines whether a string resembles a valid URL.
 *
 * @param urlString - The string to validate.
 * @returns True when the string matches the URL pattern, otherwise false.
 */
const isValidUrl = (urlString: string): boolean => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
    return urlRegex.test(urlString);
};

/**
 * Maps CLI flags to tafrigh initialisation and transcription options.
 *
 * @param flags - Parsed CLI flags.
 * @returns A tuple containing the init options followed by transcription options.
 */
export const mapFlagsToOptions = ({
    flags: { chunkDuration, concurrency, keys },
}: TafrighFlags): [{ apiKeys: string[] }, Partial<TranscribeOptions>] => {
    return [
        { apiKeys: keys as string[] },
        {
            ...(concurrency && { concurrency }),
            ...(chunkDuration && {
                splitOptions: {
                    chunkDuration,
                },
            }),
        },
    ];
};

/**
 * Resolves CLI inputs to a mapping of identifiers to input sources.
 *
 * @param inputs - The CLI arguments containing file paths and URLs.
 * @returns A mapping from deterministic identifiers to lists of playable media sources.
 */
export const mapFileOrUrlsToInputSources = async (inputs: string[]): Promise<Record<string, string[]>> => {
    const idToInputSource: Record<string, string[]> = {};

    for (const input of inputs) {
        if (isValidUrl(input)) {
            Object.assign(idToInputSource, await collectVideos(input));
        } else {
            const idToFile: Record<string, string> = await collectMediaFiles(input);

            Object.entries(idToFile).forEach(([id, file]) => {
                idToInputSource[id] = [file];
            });
        }
    }

    return idToInputSource;
};
