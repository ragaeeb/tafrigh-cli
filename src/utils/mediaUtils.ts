import ytdl from '@distube/ytdl-core';
import ytpl from '@distube/ytpl';
import { getFbVideoInfo } from 'fb-downloader-scrapper';
import { URL } from 'node:url';
import { TwitterDL } from 'twitter-downloader';

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

export const collectVideos = async (input: string): Promise<Record<string, string[]>> => {
    const videoUrls = await unpackVideosInPlaylist(input);
    const idToInputSource: Record<string, string[]> = {};

    for (let url of videoUrls) {
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url);
            const videoId: any = info.player_response.videoDetails.videoId;
            const { url: streamUrlForAudio } = ytdl.chooseFormat(info.formats, {
                filter: 'audioonly',
            });

            const { url: streamUrlForAudioVideo } = ytdl.chooseFormat(info.formats, {
                filter: 'audioandvideo',
            });

            idToInputSource[videoId] = [streamUrlForAudio, streamUrlForAudioVideo];
        } else if (url.includes('/facebook.com/')) {
            const info = await getFbVideoInfo(url);
            idToInputSource[urlToFilename(url)] = [info.sd, info.hd];
        } else if (url.includes('/x.com/') || url.includes('/twitter.com/')) {
            const info = await TwitterDL(url);
            const { videos = [] } = info.result?.media[0] || {};

            if (videos[0]?.url && info.result?.id) {
                idToInputSource[info.result.id] = [videos[0]?.url];
            }
        } else {
            idToInputSource[urlToFilename(url)] = [url];
        }
    }

    return idToInputSource;
};
