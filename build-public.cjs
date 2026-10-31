'use strict';
const { build, Platform, Arch } = require('electron-builder');
const { desktopConfiguration } = require('../src/distribution.cjs');
const { localHealth } = require('../src/health.cjs');

async function main() {
  const hylix = desktopConfiguration({
    mode: 'online', origin: process.env.HYLIX_PUBLIC_ORIGIN,
    repository: process.env.HYLIX_RELEASE_REPOSITORY,
  });
  if (!(await localHealth(hylix.origin)))
    throw Error('The online Hylix service is not ready. Deploy and verify it before building a public installer.');
  const [owner,repo]=hylix.repository.split('/');
  await build({
    targets: Platform.WINDOWS.createTarget('nsis', Arch.x64),
    publish: 'never',
    config: {
      extraResources: [],
      extraMetadata: { hylix },
      publish: [{provider:'github',owner,repo,releaseType:'release'}],
      directories: { output: 'dist-public' },
      afterPack: require('./verify-public.cjs'),
    },
  });
}
main().catch(error => { console.error(error.message); process.exitCode=1; });
