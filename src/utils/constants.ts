import logSymbols from 'log-symbols';
import { green, italic, underline } from 'picocolors';

import { name, version } from '../../package.json';

export const HELP_TEXT = `
${logSymbols.info} Usage
    npx ${italic(name)} [options]

${logSymbols.info} Options
    ${green(underline('apple-binary-path'))}   The path to the OCR engine compiled for the Apple environment. If this is set at least once, the cli will reuse this value next time even if it is not provided.
    ${green(underline('concurrency'))}         The number of threads to use to process the OCR. The higher the value the more CPU power will be used.
    ${green(underline('ext'))}           The extension and file format of the transcriptions that will be outputted when multiple files.
    ${green(underline('bottom'))}              The number of pixels from the bottom of the video to crop to extract the subtitles.
    ${green(underline('top'))}                 The number of pixels from the top of the video to crop to extract the subtitles.
    ${green(underline('left'))}                The number of pixels from the left of the video to crop to extract the subtitles.
    ${green(underline('right'))}               The number of pixels from the right of the video to crop to extract the subtitles.
    ${green(underline('output'))}         The output file or folder to write the transcriptions to. If it is a single media being transcribed you can specify this as a file with a .txt or .json extension, and if it is multiple medias (ie: a folder, or playlist) then specify it as a folder.

${logSymbols.success} Examples
    npx ${name} "tmp/video.mp4" --output "./transcript.txt" --keys "ABCD" --keys "EFG"
    npx ${name} "https://www.youtube.com/playlist?list=abcd" --output "./output_folder" --lang ar --keys "XYZ" --ext json
`;

export { name, version };
