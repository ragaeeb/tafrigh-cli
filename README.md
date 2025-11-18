# tafrigh-cli

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/3ab8ca50-a24a-46b4-af93-e8a6a55f670a.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/3ab8ca50-a24a-46b4-af93-e8a6a55f670a)
[![Node.js CI](https://github.com/ragaeeb/tafrigh-cli/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/tafrigh-cli/actions/workflows/build.yml)
![GitHub License](https://img.shields.io/github/license/ragaeeb/tafrigh-cli)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/tafrigh-cli)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)

`tafrigh-cli` is a Bun-powered command-line interface for the [tafrigh](https://github.com/ragaeeb/tafrigh) transcription engine. It orchestrates downloading media, chunking audio, performing speech-to-text and formatting transcripts for rapid review.

The CLI is composed of small utilities documented with JSDoc and individually tested so that media discovery, option parsing and configuration persistence remain easy to maintain. The sections below highlight the most frequently used modules when extending the tool.

## Feature highlights

- 🎯 **Broad input support** – Local files & folders, YouTube videos/playlists, Facebook and X (Twitter) URLs.
- 🪄 **Automatic media discovery** – Fetches the best downloadable sources for supported platforms via yt-dlp.
- ⚙️ **Configurable processing** – Control chunk duration and concurrency for tafrigh workloads.
- 🔑 **Persistent wit.ai credentials** – Securely stores API keys per language via `conf`.
- 📄 **Structured transcripts** – Produces timestamped, filler-aware transcripts ready for editors.
- 🪵 **Rich logging** – Uses `pino` + `pino-pretty` for actionable CLI feedback.

### Key modules

| Location | Purpose |
| --- | --- |
| `src/index.ts` | CLI entrypoint that wires `meow` options to tafrigh execution. |
| `src/utils/mediaUtils.ts` | Detects supported URLs, crawls playlists and discovers download targets using yt-dlp. |
| `src/utils/optionsMapping.ts` | Normalizes CLI flags into tafrigh-friendly option objects. |
| `src/utils/config.ts` | Persists per-language wit.ai credentials using `conf`. |
| `src/utils/io.ts` | File system helpers for globbing media, verifying paths and ensuring output folders exist. |
| `src/utils/prompt.ts` | Simplified prompt helpers for collecting credentials interactively. |

## Requirements

- **Bun** 1.3.2 or later
- **Node.js** 22.0.0 or later (for compatibility)
- **Python** 3.7+ available as `python3` in your system PATH (required by yt-dlp)

The CLI uses `youtube-dl-exec` which wraps [yt-dlp](https://github.com/yt-dlp/yt-dlp) for YouTube downloads. The yt-dlp binary is auto-installed during `bun install`, but you can also use a global installation.

## Installation

Install dependencies with Bun:

```sh
bun install
```

To run the CLI without installing globally, use `bunx`:

```sh
bunx tafrigh-cli --help
```

## Usage

```sh
bunx tafrigh-cli [options] <inputs...>
```

### Common options

| Flag | Alias | Description |
| --- | --- | --- |
| `--chunk-duration` | `-d` | Split audio into fixed-size segments (seconds). Default: `300`. |
| `--concurrency` | `-c` | Number of tafrigh worker threads. |
| `--keys` | `-k` | wit.ai API keys. Repeat flag for multiple keys. Persisted per language. |
| `--language` | `-l` | Namespace API keys for a locale. Default: `global`. |
| `--output` | `-o` | Output file (single input) or directory (multiple inputs). |

### Supported inputs

- Absolute/relative paths to media files.
- Directories containing audio/video files.
- YouTube video links or playlists.
- Facebook video URLs.
- X (Twitter) video URLs.

### Examples

Transcribe a local video and open the output automatically:

```sh
bunx tafrigh-cli "./video.mp4" --output "./transcript.txt" --keys "ABC" --keys "DEF"
```

Process an entire playlist using Arabic-specific keys:

```sh
bunx tafrigh-cli "https://www.youtube.com/playlist?list=abcd" \
  --output "./transcripts" \
  --language ar \
  --keys "XYZ"
```

Reuse stored keys for multiple mixed sources:

```sh
bunx tafrigh-cli \
  "https://www.facebook.com/watch/?v=1234" \
  "https://www.youtube.com/watch?v=5678" \
  "https://x.com/user/status/9012" \
  --output "./batch-output"
```

## Development workflow

| Command | Description |
| --- | --- |
| `bun run build` | Bundles the CLI through `tsdown` using `tsdown.config.ts`. |
| `bun test` | Runs the Bun test suite (`bun:test`). |
| `bun run lint` | Lints the project with Biome. |
| `bun run format` | Formats sources with Biome. |

The bundler configuration lives in `tsdown.config.ts` and is consumed directly by `tsdown`. Unit tests live beside their helpers as `src/**/*.test.ts` files so behaviour is verified right next to the implementation.

## Logging

The CLI emits structured logs describing preprocessing, transcription progress and output destinations. Adjust `LOG_LEVEL` to change verbosity.

## Migration Notes

**v1.4.3+**: Migrated from `@distube/ytdl-core` and `@distube/ytpl` to `youtube-dl-exec` for improved reliability and active maintenance. This requires Python 3.7+ for yt-dlp to function.

## License

MIT © Ragaeeb Haq
