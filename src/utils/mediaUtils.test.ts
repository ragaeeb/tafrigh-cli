import { describe, expect, it } from 'bun:test';

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
