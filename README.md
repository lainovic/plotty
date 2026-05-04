# Plotty

Plotty is a small map utility for inspecting geographic data in the browser. You can paste or drop supported inputs onto the map and immediately visualize routes, points, polygons, and navigation logs.

<img width="1724" alt="Plotty screenshot" src="https://github.com/user-attachments/assets/46552d94-52f0-4cc3-b6e5-ca0d56611faa">

## What It Does

- Visualizes multiple layer types on top of Leaflet tiles.
- Imports data by paste or drag-and-drop onto the map.
- Supports GeoJSON, TomTom route responses, TTP files, logcat-derived navigation points, and raw coordinates.
- Lets you rename, recolor, hide, delete, and reorder layers.
- Includes keyboard-driven point navigation, a ruler tool, and a Go To dialog.

## Requirements

- Node.js 18+
- `pnpm` 9+ recommended

## Getting Started

```bash
pnpm install
pnpm dev
```

The Vite dev server prints the local URL in the terminal, usually `http://localhost:5173/plotty/`.

## Scripts

```bash
pnpm dev
pnpm test --run
pnpm lint
pnpm build
pnpm preview
```

## Importing Data

Focus the map, then paste content or drop a file onto it.

Supported formats:

- GeoJSON objects, features, and feature collections
- TomTom route JSON with `formatVersion: "0.0.12"`
- TomTom Positioning (`0.7`) TTP files
- Supported Android logcat navigation messages
- Raw latitude/longitude pairs

## Deployment

The app is configured for GitHub Pages under `/plotty/`.

```bash
pnpm deploy
```

`deploy` runs `build` first and publishes the `dist/` directory via `gh-pages`.

## License

MIT. See [LICENSE](./LICENSE).
