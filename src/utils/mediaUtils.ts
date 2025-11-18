import { URL } from 'node:url';
import { getFbVideoInfo } from 'fb-downloader-scrapper';
import { findBestDownloadUrl } from 'rabbito';
import { TwitterDL } from 'twitter-downloader';

import * as youtubedlExec from 'youtube-dl-exec';

// Use global yt-dlp if package binary not found
const { create } = youtubedlExec as any;
const youtubedl = create('yt-dlp');

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
 * Expands playlist URLs into individual video URLs using yt-dlp.
 *
 * @param url - The playlist or video URL.
 * @returns A list of URLs representing all videos to download.
 */
const unpackVideosInPlaylist = async (url: string): Promise<string[]> => {
    if (url.includes('youtube.com/playlist?list=')) {
        const result: any = await youtubedl(url, {
            dumpSingleJson: true,
            flatPlaylist: true,
            noWarnings: true,
        });

        // yt-dlp returns playlist entries in the 'entries' field
        if (result.entries && Array.isArray(result.entries)) {
            return result.entries
                .filter((entry: any) => entry.url || entry.id)
                .map((entry: any) => entry.url || `https://www.youtube.com/watch?v=${entry.id}`);
        }
    }

    return [url];
};

/**
 * Checks if a URL is a valid YouTube URL.
 *
 * @param url - The URL to validate.
 * @returns True if it's a YouTube URL.
 */
const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com/') || url.includes('youtu.be/');
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
        if (isYouTubeUrl(url)) {
            const info: any = await youtubedl(url, {
                dumpSingleJson: true,
                format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
            });

            // Extract formats with both audio and video
            const formats =
                info.formats?.filter((f: any) => f.ext === 'mp4' && f.acodec !== 'none' && f.vcodec !== 'none') || [];

            if (formats.length === 0) {
                // Fallback: use the direct URL from info
                if (info.url) {
                    idToInputSource[info.id] = [info.url];
                } else {
                    throw new Error(`No suitable mp4 format found for ${url} (id: ${info.id})`);
                }
            } else {
                const urls = formats.map((f: any) => f.url).filter(Boolean);
                const successfulUrl = await findBestDownloadUrl(urls);
                idToInputSource[info.id] = [successfulUrl];
            }
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
