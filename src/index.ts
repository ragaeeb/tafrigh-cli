#!/usr/bin/env bun
import welcome from 'cli-welcome';
import logSymbols from 'log-symbols';
import { init, transcribe } from 'tafrigh';

import { TafrighFlags } from './types.js';
import { name, version } from './utils/constants.js';
import { mapFileOrUrlToInputSource, mapFlagsToOptions } from './utils/optionsMapping.js';
import { getCliArgs } from './utils/prompt.js';

const main = async () => {
    welcome({
        bgColor: `#FADC00`,
        bold: true,
        color: `#000000`,
        title: name,
        version,
    });

    const cli = getCliArgs() as TafrighFlags;
    const [initOptions, transcribeOptions] = mapFlagsToOptions(cli);

    if (!cli.input.length) {
        console.warn(`${logSymbols.warning} No inputs specified`);
        return;
    }

    init(initOptions);

    const inputSources = await mapFilesOrUrlsToInputSources(cli.input);

    const result = await transcribe(inputSource, transcribeOptions);

    if (result) {
        console.log(`${logSymbols.success} written ${result}`);
    } else {
        console.warn(`${logSymbols.error} Nothing written`);
    }
};

main();
