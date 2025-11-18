import logSymbols from 'log-symbols';
import { green, italic, underline } from 'picocolors';

import packageJson from '@/../../package.json' with { type: 'json' };

const name = packageJson.name;
const version = packageJson.version;

export const HELP_TEXT = `
${logSymbols.info} Usage
    bunx ${italic(name)} [options]

${logSymbols.info} Options
    ${green(underline('chunk-duration'))}   The duration for the chunks that the audio should be chopped into. This is useful if you want to produce smaller segments
    ${green(underline('concurrency'))}         The number of threads to use to process the OCR. The higher the value the more CPU power will be used.
    ${green(underline('keys'))}              The API keys (for wit.ai) to use. Once you set this once, you don't have to keep providing it and it will remember it. You can couple this with the --language flag to map specific API keys for their respective languages.
    ${green(underline('language'))}          Useful if you want to map the API keys for a specific language. This way if you want your transcriptions for a specific language to use those API keys, and different API keys for another language you can map these. By default this is set to global which represents universal API keys.
    ${green(underline('output'))}         The output file or folder to write the transcriptions to. If it is a single media being transcribed you can specify this as a file with a .txt or .json extension, and if it is multiple medias (ie: a folder, or playlist) then specify it as a folder.

${logSymbols.success} Examples
    npx ${name} "tmp/video.mp4" --output "./transcript.txt" --keys "ABCD" --keys "EFG"

    After this you can just do (and it will remember the API keys last used):
    npx ${name} "tmp/video.mp4" --output "./transcript.txt"

    You can use the languages like this
    npx ${name} "https://www.youtube.com/playlist?list=abcd" --output "./output_folder/1.txt" --lang ar --keys "XYZ"

    Now next time you run this it will remember to use the keys AR keys:
    npx ${name} "https://www.facebook.com/watch/?v=1234" "https://www.youtube.com/watch?v=12345" --output "./output_folder" --lang ar
`;

export { name, version };
