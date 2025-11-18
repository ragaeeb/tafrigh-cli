import { describe, expect, it, mock } from 'bun:test';

const mockYtdlp = mock(async (url: string, options: any) => {
    if (options?.flatPlaylist) {
        if (url.includes('playlist?list=')) {
            return {
                entries: [{ id: 'playlistVideo', url: 'https://www.youtube.com/watch?v=playlistVideo' }],
            };
        }
        return { entries: [] };
    }

    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        const videoUrl = new URL(url);
        const videoId = videoUrl.searchParams.get('v') ?? 'youtube123';

        return {
            formats: [
                {
                    acodec: 'mp4a',
                    ext: 'mp4',
                    url: 'https://cdn.example.com/video.mp4',
                    vcodec: 'avc1',
                },
            ],
            id: videoId,
            url: 'https://cdn.example.com/video.mp4',
        };
    }

    return { id: 'unknown', url };
});

mock.module('youtube-dl-exec', () => ({
    create: mock(() => mockYtdlp),
    default: mockYtdlp,
}));

mock.module('fb-downloader-scrapper', () => ({
    getFbVideoInfo: mock(async (_url: string) => ({
        hd: 'https://fb.example.com/hd.mp4',
        sd: 'https://fb.example.com/sd.mp4',
    })),
}));

mock.module('rabbito', () => ({
    findBestDownloadUrl: mock(async (urls: string[]) => urls[0]),
}));

mock.module('twitter-downloader', () => ({
    TwitterDL: mock(async (_url: string) => ({
        result: {
            id: 'tweet123',
            media: [
                {
                    videos: [
                        {
                            url: 'https://video.twimg.com/tweet.mp4',
                        },
                    ],
                },
            ],
        },
    })),
}));

const { collectVideos, urlToFilename } = await import('./mediaUtils.ts');

describe('mediaUtils', () => {
    describe('urlToFilename', () => {
        it('should return query id when present', () => {
            const result = urlToFilename('https://example.com/watch?v=abc123');
            expect(result).toBe('abc123');
        });

        it('should use the last path segment when query id missing', () => {
            const result = urlToFilename('https://example.com/media/file.mp4');
            expect(result).toBe('file.mp4');
        });
    });

    describe('collectVideos', () => {
        it('should resolve regular urls to direct sources', async () => {
            const result = await collectVideos('https://example.com/media/file.mp4');
            expect(result).toEqual({ 'file.mp4': ['https://example.com/media/file.mp4'] });
        });

        it('should resolve youtube urls to downloadable sources', async () => {
            const result = await collectVideos('https://www.youtube.com/watch?v=youtube123');
            expect(result).toEqual({ youtube123: ['https://cdn.example.com/video.mp4'] });
        });

        it('should expand playlists into video ids', async () => {
            const result = await collectVideos('https://www.youtube.com/playlist?list=PL123');
            expect(result).toEqual({ playlistVideo: ['https://cdn.example.com/video.mp4'] });
        });

        it('should resolve facebook urls to sd and hd streams', async () => {
            const result = await collectVideos('https://www.facebook.com/watch/?v=fbid');
            expect(result).toEqual({ fbid: ['https://fb.example.com/sd.mp4', 'https://fb.example.com/hd.mp4'] });
        });

        it('should resolve twitter urls to highest quality stream', async () => {
            const result = await collectVideos('https://x.com/someuser/status/123');
            expect(result).toEqual({ tweet123: ['https://video.twimg.com/tweet.mp4'] });
        });
    });
});
