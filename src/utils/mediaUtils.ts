import ytdl from '@distube/ytdl-core';
import ytpl from '@distube/ytpl';
// @ts-expect-error: Missing types
import getFbVideoInfo from 'fb-downloader-scrapper';
import { URL } from 'node:url';

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

export const collectVideos = async (input: string): Promise<Record<string, string>> => {
    const videoUrls = await unpackVideosInPlaylist(input);
    const idToInputSource: Record<string, string> = {};

    for (let url of videoUrls) {
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url);
            const videoId: any = info.player_response.videoDetails.videoId;
            const { url: streamUrl } = ytdl.chooseFormat(info.formats, {
                filter: 'audioonly',
            });
            idToInputSource[videoId] = streamUrl;
        } else if (url.includes('facebook.com')) {
            const info = await getFbVideoInfo(url);
            idToInputSource[urlToFilename(url)] = info.sd || info.hd;
        }
    }

    return idToInputSource;
};
