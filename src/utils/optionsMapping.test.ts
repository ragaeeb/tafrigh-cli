import { describe, it, expect } from 'bun:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { mapFlagsToOptions, mapFileOrUrlsToInputSources } from './optionsMapping.ts';

describe('mapFlagsToOptions', () => {
    it('should map cli flags to tafrigh options', () => {
        const result = mapFlagsToOptions({
            flags: {
                chunkDuration: 120,
                concurrency: 4,
                keys: ['abc'],
            },
        } as any);

        expect(result).toEqual([
            { apiKeys: ['abc'] },
            { concurrency: 4, splitOptions: { chunkDuration: 120 } },
        ]);
    });
});

describe('mapFileOrUrlsToInputSources', () => {
    it('should map media files from directory', async () => {
        const dir = await mkdtemp(path.join(tmpdir(), 'tafrigh-'));
        const filePath = path.join(dir, 'clip.mp4');
        await writeFile(filePath, 'test');

        const result = await mapFileOrUrlsToInputSources([dir]);
        expect(result).toEqual({ clip: [path.resolve(filePath)] });

        await rm(dir, { recursive: true, force: true });
    });

    it('should map urls using collectVideos', async () => {
        const result = await mapFileOrUrlsToInputSources(['https://example.com/media/file.mp4']);
        expect(result).toEqual({ 'file.mp4': ['https://example.com/media/file.mp4'] });
    });
});
