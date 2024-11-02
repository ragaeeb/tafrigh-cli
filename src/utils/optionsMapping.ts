import ytdl from '@distube/ytdl-core';
import ytpl from '@distube/ytpl';
import getFbVideoInfo from 'fb-downloader-scrapper';
import { promises as fs } from 'fs';
import path from 'node:path';
import { URL } from 'node:url';
import { TafrighOptions, TranscribeFilesOptions } from 'tafrigh';

import { TafrighFlags } from '../types.js';
import { filterMediaFiles } from './io.js';

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

/**
 * If the url contains a playlist, it will return all the videos in the playlist, otherwise just the url back
 * @param url
 */
const unpackVideosInPlaylist = async (url: string): Promise<string[]> => {
    if (url.includes('youtube.com/playlist?list=')) {
        const info = await ytpl(url);
        return info.items.map((video) => (video as any).shortUrl as string);
    }

    return [url];
};

export const mapFileOrUrlsToInputSources = async (inputs: string[]): Promise<Record<string, string>> => {
    const idToInputSource: Record<string, string> = {};

    for (let input of inputs) {
        if (isValidUrl(input)) {
            const videoUrls = await unpackVideosInPlaylist(input);

            for (let url of videoUrls) {
                if (ytdl.validateURL(url)) {
                    const info = await ytdl.getInfo(url);
                    const videoId: any = info.player_response.videoDetails.videoId;
                    idToInputSource[videoId] = ytdl.chooseFormat(info.formats, {
                        quality: '134',
                    }).url;
                } else if (url.includes('facebook.com')) {
                    const info = await getFbVideoInfo(url);
                    idToInputSource[urlToFilename(url)] = info.sd || info.hd;
                }
            }
        } else {
            const info = await fs.stat(input);

            if (info.isFile()) {
                const parsed = path.parse(path.resolve(input));
                idToInputSource[parsed.name] = input;
            } else if (info.isDirectory()) {
                const files = await fs.readdir(input);
                const mediaFiles = filterMediaFiles(files)
                    .map((file) => path.join(input, file))
                    .map((file) => path.resolve(file));

                for (let mediaFile of mediaFiles) {
                    const parsed = path.parse(path.resolve(path.join(mediaFile)));
                    idToInputSource[parsed.name] = mediaFile;
                }
            } else {
                console.warn(`Skipping ${input}`);
            }
        }
    }

    return idToInputSource;
};
