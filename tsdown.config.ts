import { defineConfig } from 'tsdown';

export default defineConfig({
    banner: { js: '#!/usr/bin/env bun' },
    clean: true,
    entry: ['src/index.ts'],
    external: [
        '@distube/ytdl-core',
        '@distube/ytpl',
        'cli-welcome',
        'conf',
        'fb-downloader-scrapper',
        'log-symbols',
        'mime-types',
        'open',
        'paragrafs',
        'picocolors',
        'pino',
        'pino-pretty',
        'rabbito',
        'tafrigh',
        'twitter-downloader'
    ],
    fixedExtension: false,
    format: 'esm',
    outDir: 'dist',
    platform: 'node',
    sourcemap: true,
    target: 'node22'
});
