# Human-Centric Music Visualizer

A real-time music visualizer built with React, TypeScript, the Web Audio API, and HTML5 Canvas. Users can upload an audio file and watch responsive, organic canvas animations react to bass, mids, treble, and overall energy.

The project is designed to show creative frontend engineering: animation loops, browser audio APIs, canvas rendering, responsive controls, and performance-conscious UI work.

## Live Project

- Live demo: https://music-visualizer-blush.vercel.app
- Source code: https://github.com/unyimesamuel891/music-visualizer

## What It Demonstrates

- Real-time browser audio analysis with the Web Audio API
- Canvas rendering with animation loops and frequency-reactive visuals
- React + TypeScript component architecture
- Responsive interaction design for upload, playback, and volume controls
- Performance thinking around frame rate, particle limits, and smoothing
- A polished creative interface beyond standard dashboard/landing-page work

## Core Features

- Upload browser-supported audio files such as MP3, WAV, and OGG
- Analyze frequency data in real time with `AnalyserNode`
- Render organic circles, spirals, gradients, and particle-style motion
- Smooth frequency response to avoid flickering
- Mobile-friendly playback controls
- Responsive canvas that adapts to different viewport sizes

## Tech Stack

| Layer | Tech |
| --- | --- |
| UI | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Audio | Web Audio API |
| Graphics | HTML5 Canvas |
| Styling | Tailwind CSS |
| Routing | Wouter |

## Running Locally

```bash
git clone https://github.com/unyimesamuel891/music-visualizer.git
cd music-visualizer
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Useful Scripts

```bash
pnpm dev       # Start local development
pnpm build     # Build for production
pnpm start     # Run production server output
pnpm check     # Type-check the project
```

## Implementation Notes

The visualizer uses an `AudioContext` and `AnalyserNode` to read frequency data from uploaded audio. The canvas renderer separates the frequency spectrum into useful bands, then maps those values into motion, color, scale, and particle energy.

The animation loop is built around `requestAnimationFrame`, with smoothing and particle caps to keep the experience fluid.

## Future Improvements

- Add multiple visualization modes
- Add a waveform scrubber/timeline
- Add microphone input support
- Add playlist support
- Add video/GIF export for generated visuals
- Add user-selectable color themes
