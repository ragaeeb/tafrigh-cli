import ytdl from '@distube/ytdl-core';
import getFbVideoInfo from 'fb-downloader-scrapper';
import { Result } from 'meow';
import path from 'node:path';
import { URL } from 'node:url';
import { TafrighOptions, TranscribeFilesOptions } from 'tafrigh';

import { TafrighFlags } from '../types.js';

export const urlToFilename = (urlString: string): string => {
    const url = new URL(urlString);

    // 1. Check for a "v" query parameter, often used in video URLs
    if (url.searchParams.get('v')) {
        return url.searchParams.get('v') as string;
    }

    // 2. Fall back to using the last part of the pathname if no "v" parameter exists
    const pathParts = url.pathname.split('/').filter(Boolean);
    return pathParts[pathParts.length - 1];
};

const isValidUrl = (urlString: string): boolean => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
    return urlRegex.test(urlString);
};

const parseOutputFile = (input: string[]) => {
    const [inputFile] = input;

    if (isValidUrl(inputFile)) {
        const name = urlToFilename(inputFile);
        return path.format({ ext: '.txt', name });
    }

    const parsed = path.parse(path.resolve(inputFile));
    return path.format({ dir: parsed.dir, ext: '.txt', name: parsed.name });
};

export const mapFlagsToOptions = ({
    flags: { chunkDuration, concurrency, keys },
}: TafrighFlags): [TafrighOptions, TranscribeFilesOptions] => {
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

export const mapFileOrUrlToInputSource = async (inputs: string[]): Promise<Record<string, null | string>> => {
    let [inputSource] = inputs;
    for (let input of inputs) {
    }

    if (ytdl.validateURL(inputSource)) {
        const info = await ytdl.getInfo(inputSource);
        let format = ytdl.chooseFormat(info.formats, { quality: '134' });

        inputSource = format.url;
    } else if (inputSource.includes('facebook.com')) {
        const info = await getFbVideoInfo(inputSource);
        inputSource = info.sd || info.hd;
    }

    return inputSource;
};
