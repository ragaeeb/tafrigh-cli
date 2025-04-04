import { TafrighOptions, TranscribeFilesOptions } from 'tafrigh';

import { TafrighFlags } from '../types.js';
import { collectMediaFiles } from './io.js';
import { collectVideos } from './mediaUtils.js';

const isValidUrl = (urlString: string): boolean => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
    return urlRegex.test(urlString);
};

export const mapFlagsToOptions = ({
    flags: { chunkDuration, concurrency, keys },
}: TafrighFlags): [TafrighOptions, Partial<TranscribeFilesOptions>] => {
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

export const mapFileOrUrlsToInputSources = async (inputs: string[]): Promise<Record<string, string[]>> => {
    const idToInputSource: Record<string, string[]> = {};

    for (let input of inputs) {
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
