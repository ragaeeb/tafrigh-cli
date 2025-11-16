import ytdl from '@distube/ytdl-core';
import ytpl from '@distube/ytpl';
import { getFbVideoInfo } from 'fb-downloader-scrapper';
import { URL } from 'node:url';
import { findBestDownloadUrl } from 'rabbito';
import { TwitterDL } from 'twitter-downloader';

/**
 * Creates a deterministic filename based on a video URL.
 *
 * @param urlString - The original video URL.
 * @returns A usable identifier derived from the URL.
 */
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
 * Expands playlist URLs into individual video URLs.
 *
 * @param url - The playlist or video URL.
 * @returns A list of URLs representing all videos to download.
 */
const unpackVideosInPlaylist = async (url: string): Promise<string[]> => {
    if (url.includes('youtube.com/playlist?list=')) {
        const info = await ytpl(url);
        return info.items.map((video) => (video as any).shortUrl as string);
    }

    return [url];
};

/**
 * Resolves a social media URL into downloadable media sources.
 *
 * @param input - The URL provided by the user.
 * @returns A mapping from identifiers to available download URLs.
 */
export const collectVideos = async (input: string): Promise<Record<string, string[]>> => {
    const videoUrls = await unpackVideosInPlaylist(input);
    const idToInputSource: Record<string, string[]> = {};

    for (const url of videoUrls) {
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url);
            const formats = info.formats.filter(
                (f) => f.container === 'mp4' && f.hasAudio && !f.isHLS && !f.isDashMPD,
            );
        
            if (formats.length === 0) {
                throw new Error('No suitable mp4 format found');
            }
        
            const successfulUrl = await findBestDownloadUrl(formats.map((f) => f.url));

            idToInputSource[info.player_response.videoDetails.videoId] = [successfulUrl];
        } else if (url.includes('facebook.com/')) {
            const info = await getFbVideoInfo(url);
            idToInputSource[urlToFilename(url)] = [info.sd, info.hd];
        } else if (url.includes('x.com/') || url.includes('twitter.com/')) {
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
