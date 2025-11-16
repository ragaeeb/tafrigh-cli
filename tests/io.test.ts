import { describe, it, expect } from 'bun:test';
import { mkdtemp, writeFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { collectMediaFiles, filterMediaFiles } from '../src/utils/io.ts';

describe('filterMediaFiles', () => {
    it('should return only audio and video files', () => {
        const files = ['audio.mp3', 'video.mp4', 'document.pdf'];
        const result = filterMediaFiles(files);
        expect(result).toEqual(['audio.mp3', 'video.mp4']);
    });
});

describe('collectMediaFiles', () => {
    it('should return mapping for a file input', async () => {
        const dir = await mkdtemp(path.join(tmpdir(), 'tafrigh-'));
        const filePath = path.join(dir, 'sample.mp3');
        await writeFile(filePath, 'test');

        const result = await collectMediaFiles(filePath);
        expect(result).toEqual({ sample: filePath });

        await rm(dir, { recursive: true, force: true });
    });

    it('should return mapping for media files in a directory', async () => {
        const dir = await mkdtemp(path.join(tmpdir(), 'tafrigh-'));
        await writeFile(path.join(dir, 'song.mp3'), 'test');
        await writeFile(path.join(dir, 'video.mp4'), 'test');
        await writeFile(path.join(dir, 'note.txt'), 'ignore');

        const result = await collectMediaFiles(dir);
        expect(result).toEqual({
            song: path.resolve(path.join(dir, 'song.mp3')),
            video: path.resolve(path.join(dir, 'video.mp4')),
        });

        await rm(dir, { recursive: true, force: true });
    });

    it('should skip directory when not media related', async () => {
        const dir = await mkdtemp(path.join(tmpdir(), 'tafrigh-'));
        await mkdir(path.join(dir, 'nested'));

        const result = await collectMediaFiles(path.join(dir, 'nested'));
        expect(result).toEqual({});

        await rm(dir, { recursive: true, force: true });
    });
});
