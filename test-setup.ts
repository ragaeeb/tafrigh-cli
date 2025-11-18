import { mock } from 'bun:test';

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
