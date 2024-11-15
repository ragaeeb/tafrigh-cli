# tafrigh-cli

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/3ab8ca50-a24a-46b4-af93-e8a6a55f670a.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/3ab8ca50-a24a-46b4-af93-e8a6a55f670a)
[![Node.js CI](https://github.com/ragaeeb/tafrigh-cli/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/tafrigh-cli/actions/workflows/build.yml)
![GitHub License](https://img.shields.io/github/license/ragaeeb/tafrigh-cli)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/tafrigh-cli)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)

A Command Line Interface (CLI) for using the [tafrigh](https://github.com/ragaeeb/tafrigh) library, enabling transcription of audio and video files, including YouTube videos, Facebook videos, and local media files.

## Features

    •	Transcribe audio and video files.
    •	Support for YouTube videos and playlists.
    •	Support for Facebook videos.
    •	Support for local media files and directories.
    •	Customizable chunk duration for splitting audio.
    •	Concurrent processing with adjustable number of threads.
    •	API key management for wit.ai.
    •	Language-specific API key mapping.
    •	Detailed logging of the transcription process.
    •	Supports Facebook, YouTube and X (formerly Twitter) media links.

## Installation

You can install tafrigh-cli globally using npm:

```sh
npm install -g tafrigh-cli
```

Alternatively, you can use npx to run it without installing:

```sh
npx tafrigh-cli [options]
```

## Usage

```sh
npx tafrigh-cli [options] [inputs]
```

## Options

Option Alias Description
`–chunk-duration` `-d` The duration (in seconds) for splitting the audio into chunks. Useful for producing smaller segments. Default is 300 seconds.
`–concurrency` `-c` The number of threads to use for processing the OCR. Higher values increase CPU usage.
`–keys` `-k` The API keys for wit.ai. Provide multiple keys by repeating the flag. Once set, keys are saved and do not need to be provided again. Can be mapped to specific languages using the `–language` flag.
`–language` `-l` The language code to map specific API keys. Allows different API keys for different languages. Default is `global`, representing universal API keys.
`–output` `-o` The output file or directory for the transcriptions. If transcribing a single media file, specify a file with a `.txt` or `.json` extension. For multiple medias, specify a directory.

## Inputs

You can provide multiple inputs to `tafrigh-cli`, including:

    •	YouTube videos and playlists.
    •	Facebook videos.
    •	Local media files.
    •	Directories containing media files.

## Examples

Transcribe a local video file with specified API keys:

```sh
npx tafrigh-cli “tmp/video.mp4” –output “./transcript.txt” –keys “ABCD” –keys “EFG”
```

After setting the API keys, you can run without specifying them again:

```sh
npx tafrigh-cli “tmp/video.mp4” –output “./transcript.txt”
```

Transcribe a YouTube playlist with language-specific API keys:

```sh
npx tafrigh-cli “https://www.youtube.com/playlist?list=abcd” –output “./output_folder/1.txt” –language ar –keys “XYZ”
```

Next time, run using the saved language-specific API keys:

```sh
npx tafrigh-cli "https://www.facebook.com/watch/?v=1234" "https://www.youtube.com/watch?v=12345" "https://x.com/user/status/12345" –output “./output_folder” –language ar
```

## Logging

`tafrigh-cli` provides detailed logging throughout the transcription process, including:

    •	Preprocessing progress and completion notifications.
    •	Transcription progress updates for each chunk.
    •	Completion messages with the number of chunks transcribed.
    •	Information on where the output files are written.

## License

This project is licensed under the MIT License.
