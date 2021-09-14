/* eslint-disable no-console, import/no-extraneous-dependencies */
const { promises: { readdir, readFile, writeFile } } = require('fs');
const { join, resolve } = require('path');
const chokidar = require('chokidar');
const pkg = require('../package.json');

const root = resolve(__dirname, '..');

if (pkg.name === 'chrome-ext-skeleton' || pkg.version === '0.0.0') {
  console.warn('Please update the project name and version in package.json');
}

const lsr = async (path) => {
  const files = [];
  const entries = await readdir(path, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    if (entry.isFile()) {
      files.push(join(path, entry.name));
    } else if (entry.isDirectory()) {
      const children = await lsr(join(path, entry.name));
      children.forEach((child) => {
        files.push(child);
      });
    }
  }));
  return files;
};

const getJson = async (file, defaultValue) => {
  try {
    const json = await readFile(file, { encoding: 'utf-8' });
    return JSON.parse(json);
  } catch (_) { /* skip */ }
  return defaultValue;
};

const remanifest = async () => {
  const manifestFile = join(root, 'manifest.json');
  const manifest = {
    ...(await getJson(manifestFile, {})),
    ...pkg.chromiumManifest,
    version: pkg.version,
    web_accessible_resources: await lsr('./src'),
  };
  console.log(`Web-accessible:\n\t${manifest.web_accessible_resources.join('\n\t')}`);
  writeFile('./manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
  console.log('Updated manifest.json');
};

if (resolve(__filename) === resolve(process.argv[1]) && process.argv[2] === '--watch') {
  (async () => {
    console.log('Watching');
    chokidar.watch('dir')
      .add(resolve(root, 'src'))
      .on('add', remanifest)
      .on('unlink', remanifest);
    chokidar.watch('file')
      .add(resolve(root, 'package.json'))
      .on('change', remanifest);
  })();
} else {
  remanifest();
}
