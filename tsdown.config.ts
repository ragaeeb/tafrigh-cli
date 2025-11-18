import { defineConfig } from 'tsdown/config';

export default defineConfig({
    banner: {
        js: '#!/usr/bin/env node\n',
    },
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: 'esm',
    minify: false,
    outDir: 'dist',
    platform: 'node',
    sourcemap: true,
    target: 'node22',
});
