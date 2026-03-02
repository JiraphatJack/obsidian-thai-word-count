# Thai Word Count

This is an Obsidian plugin that counts words in Thai text.

This project uses TypeScript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in TypeScript Definition format, which contains TSDoc comments describing what it does.

## Features

- **Thai Word Segmentation**: Uses the native `Intl.Segmenter` API with Thai language support to accurately count words in Thai text.
- **Status Bar Display**: Shows real-time word count in the status bar as you type.
- **Selection Awareness**: Displays both selected word count and total word count when text is selected.
- **Live Updates**: Updates automatically as you edit, with a 300ms debounce to prevent excessive recalculations.

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm (comes with Node.js)

### Development Setup

- Clone this repo.
- Run `npm install` to install dependencies.
- Run `npm run dev` to start compilation in watch mode.
- In Obsidian, reload the plugin to see your changes.

### Building for Release

- Run `npm run build` to create an optimized production build.
- Copy `main.js`, `manifest.json`, and `styles.css` (if any) to `<VaultFolder>/.obsidian/plugins/Thai-Word-Count/`.
- Reload Obsidian and enable the plugin in **Settings → Community plugins**.

## Releasing a New Version

- Update `manifest.json` with the new version number (e.g., `1.1.0`) and minimum Obsidian version if needed.
- Update `versions.json` to map the new version to the minimum Obsidian version.
- Run `npm run build` to create the production build.
- Commit and push changes.
- Create a GitHub release with a tag matching the version number (e.g., `1.1.0`, not `v1.1.0`).
- Attach `manifest.json` and `main.js` to the release.

### Using npm Version Helper

You can simplify the version bump process:
```bash
npm version patch  # bumps 1.0.0 → 1.0.1
npm version minor  # bumps 1.0.0 → 1.1.0
npm version major  # bumps 1.0.0 → 2.0.0
```

> Update `minAppVersion` in `manifest.json` manually before running `npm version` if needed.

## Adding to Obsidian Community Plugins

To submit this plugin to the Obsidian community plugin registry:

1. Review the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
2. Publish a release on GitHub with version `1.0.0`.
3. Make a pull request at https://github.com/obsidianmd/obsidian-releases with your plugin information.

## How to Use

1. Install the Thai Word Count plugin from Obsidian's community plugins.
2. Open any note with Thai text.
3. The word count will appear in the status bar at the bottom of the window.
4. Select any portion of Thai text to see the selected word count and total count.

### Example Status Bar Output

- Without selection: `Thai Words: 150`
- With selection: `Thai Words: 25 / 150` (25 words selected out of 150 total)

## Code Quality

### ESLint

- [ESLint](https://eslint.org/) analyzes your code to find common bugs and improvements. 
- Run `npm run lint` to check the code.
- This project includes ESLint preconfigured with [Obsidian-specific rules](https://github.com/obsidianmd/eslint-plugin).
- GitHub Actions automatically lints every commit.

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## API Documentation

See https://docs.obsidian.md
