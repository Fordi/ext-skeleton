Chromium Extension Template
---------------------------

This is a template repository for building a simple on-page Chromium extension.

## Development

* Click "Use this template" on github and follow the prompts to create your own repo
* Run `npm i` to generate a `package-lock.json` and commit it
* Run `npm run watch` to build and maintain a `manifest.json` while you work
* Commit `manifest.json`.

Note: Updates to the extension manifest should be made in the `chromiumManifest` section of `package.json`.

## Basic installation

* Clone this repo to your machine
* in Chrome/Chromium, go to `chrome://extensions`
* flip on "Developer mode" in the upper right-hand corner
* click "Load unpacked"
* Browse to this folder.
