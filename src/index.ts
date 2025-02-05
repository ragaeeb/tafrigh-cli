#!/usr/bin/env bun
import welcome from 'cli-welcome';
import logSymbols from 'log-symbols';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import open from 'open';
import { init, transcribe, TranscribeFilesOptions } from 'tafrigh';

import type { TafrighFlags } from './types.js';

import { name, version } from './utils/constants.js';
import logger from './utils/logger.js';
import { mapFileOrUrlsToInputSources, mapFlagsToOptions } from './utils/optionsMapping.js';
import { getCliArgs } from './utils/prompt.js';

const processInput = async (content: string, options: TranscribeFilesOptions): Promise<string> => {
    const result = await transcribe(content, {
        ...options,
        callbacks: {
            onPreprocessingFinished: async (filePath) => logger.info(`${logSymbols.success} Pre-formatted ${filePath}`),
            onPreprocessingProgress: (index) => logger.info(`${logSymbols.info} pre-formatting ${index}%`),
            onPreprocessingStarted: async (filePath) => logger.info(`${logSymbols.info} Pre-formatting ${filePath}`),
            onTranscriptionFinished: async (transcripts) =>
                logger.info(`${logSymbols.success} Transcribed ${transcripts.length} chunks`),
            onTranscriptionProgress: (index) => logger.info(`${logSymbols.info} Transcribed #${index}`),
            onTranscriptionStarted: async (total) =>
                logger.info(`${logSymbols.info} Starting transcription of ${total} chunks`),
        },
    });

    if (result) {
        logger.info(`${logSymbols.success} written ${result}`);
    } else {
        logger.warn(`${logSymbols.error} Nothing written`);
    }

    return result;
};

const processInputSources = async (
    inputs: string[],
    transcribeOptions: TranscribeFilesOptions,
): Promise<string | undefined> => {
    for (const input of inputs) {
        try {
            const result = await processInput(input, transcribeOptions);
            return result;
        } catch (e) {
            logger.error(`Could not process ${input} due to ${JSON.stringify(e)}, trying next source`);
        }
    }
};

const main = async () => {
    welcome({
        bgColor: `#FADC00`,
        bold: true,
        clear: false,
        color: `#000000`,
        title: name,
        version,
    });

    const cli = getCliArgs() as TafrighFlags;
    const [initOptions, transcribeOptions] = mapFlagsToOptions(cli);

    if (!cli.input.length) {
        logger.warn(`${logSymbols.warning} No inputs specified`);
        return;
    }

    logger.debug(`initOptions: ${JSON.stringify(initOptions)}`);
    init(initOptions);

    const idToInputSource = await mapFileOrUrlsToInputSources(cli.input);
    const ids = Object.keys(idToInputSource);

    logger.debug(`idToInputSource ${JSON.stringify(idToInputSource)}`);

    if (ids.length === 1) {
        const result = await processInputSources(idToInputSource[ids[0]], {
            ...transcribeOptions,
            lineBreakSecondsThreshold: 5,
            outputOptions: {
                outputFile: cli.flags.output || path.format({ dir: os.tmpdir(), ext: '.txt', name: ids[0] }),
            },
        });

        if (result) {
            await open(result);
        }
    } else if (ids.length > 1) {
        await fs.mkdir(cli.flags.output, { recursive: true });

        for (let id of ids) {
            await processInputSources(idToInputSource[ids[0]], {
                ...transcribeOptions,
                outputOptions: { outputFile: path.format({ dir: cli.flags.output, ext: '.txt', name: id }) },
            });
        }

        await open(cli.flags.output);
    } else {
        logger.warn(`${logSymbols.error} Nothing written`);
    }
};

main();
