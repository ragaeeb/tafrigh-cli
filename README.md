# tafrigh-cli

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/3ab8ca50-a24a-46b4-af93-e8a6a55f670a.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/3ab8ca50-a24a-46b4-af93-e8a6a55f670a)
[![Node.js CI](https://github.com/ragaeeb/tafrigh-cli/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/tafrigh-cli/actions/workflows/build.yml)
![GitHub License](https://img.shields.io/github/license/ragaeeb/tafrigh-cli)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/tafrigh-cli)
[![Size](https://deno.bundlejs.com/badge?q=tafrigh-cli@1.0.0&badge=detailed)](https://bundlejs.com/?q=tafrigh-cli%401.0.0)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)

`tafrigh-cli` is a command-line interface built to interact with the [substract](https://github.com/ragaeeb/substract) library, which enables efficient extraction of hard-coded subtitles from video files. This CLI leverages the `substract` library's powerful OCR-based subtitle extraction features, making it straightforward to integrate with video processing workflows directly from the command line.

## Table of Contents

-   ## Features
-   ## Installation
-   ## Usage
-   ## Commands
-   ## Options
-   ## Requirements
-   ## License

## Features

-   **Subtitle Extraction**: Retrieves embedded subtitles from video files using OCR technology.
-   **User-Friendly CLI**: Simplified commands to streamline the subtitle extraction process.
-   **Configurable Options**: Control extraction parameters such as frame frequency, duplicate text filtering, and OCR paths directly through CLI options.
-   **Enhanced Logging**: Real-time feedback on extraction progress, including OCR and frame processing.

## Installation

To install the `Substract CLI`, ensure you have Node.js version 20.0.0 or later.

```bash
npm install -g tafrigh-cli
```

Or

```bash
npx tafrigh-cli
```

## Usage

To use the CLI, run the following command with the required arguments:

```bash
tafrigh-cli [options]
```

Example:

```bash
tafrigh-cli path/to/video.mp4 --output path/to/output.json --frequency 5

# outputs 123456.txt
tafrigh-cli "https://www.facebook.com/watch/?v=123456"

# outputs TKdI.txt
tafrigh-cli "https://www.youtube.com/watch?v=TKdI"
```

## Options

| Option                | Type   | Description                                                                                                                                                                                                                               |
| --------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--apple-binary-path` | string | The path to the OCR engine compiled for the Apple environment. If this is set at least once, the cli will reuse this value next time even if it is not provided. You can get a copy from [here](https://github.com/glowinthedark/macOCR). |
| `--concurrency`       | number | The number of threads to use to process the OCR.                                                                                                                                                                                          |
| `--frequency`         | number | The frequency in seconds after which to extract a frame for subtitles.                                                                                                                                                                    |
| `--bottom`            | number | The number of pixels from the bottom of the video to crop to extract the subtitles.                                                                                                                                                       |
| `--top`               | number | The number of pixels from the top of the video to crop to extract the subtitles.                                                                                                                                                          |
| `--left`              | number | The number of pixels from the left of the video to crop to extract the subtitles.                                                                                                                                                         |
| `--right`             | number | The number of pixels from the right of the video to crop to extract the subtitles.                                                                                                                                                        |
| `--output-file`       | number | The output file to write the extracted subtitles to. This can have a .json or .txt extension. If this is omitted, the output file will be a .txt file in the same directory as the input.                                                 |

## Requirements

-   **Node.js v20.0.0+**

## License

Licensed under the MIT License.
