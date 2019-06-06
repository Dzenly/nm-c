#!/usr/bin/env node

// ':' //# comment; exec /usr/bin/env node "$0" "$@"
// Don't allow eslint to set semicolon after ':' above.
// http://sambal.org/2014/02/passing-options-node-shebang-line/

const path = require('path');
const { existsSync } = require('fs');

const rimraf = require('rimraf');

const calcHash = require('../lib/calc-hash');
const logger = require('../lib/logger');
const { cacheDir, npmArgs, cwd } = require('../lib/common');
const { pack, unpack } = require('../lib/tar-utils');
const { spawnAndGetOutputsStr: spawn } = require('../lib/spawn-utils');

if (npmArgs.length === 0) {
  console.log('Usage: "nmc <arbitrary arguments for npm>"');
  console.log('Exception: "nmc --nmc-clean" = cleans the whole cache');
  process.exit(0);
}

if (npmArgs[0] === '--nmc-clean') {
  rimraf.sync(cacheDir);
  logger.info('Cache is cleaned.');
  process.exit(0);
}

const timeLabel = 'nmc time';

console.time(timeLabel);

async function run() {
  logger.info('Remove node_modules...');
  rimraf.sync(path.join(cwd, 'node_modules'));
  logger.info('Done.\n');

  const hash = await calcHash();
  const tgzPath = path.join(cacheDir, `${hash}.tgz`);
  const exists = existsSync(tgzPath);
  if (exists) {
    logger.info('Hash found in cache, unzipping...\n');
    unpack(cwd, tgzPath);
    logger.info('Unzipping is done.\n');
    console.timeEnd(timeLabel);
    process.exit(0);
  }

  logger.info(`Hash not found in cache, installing as npm ${npmArgs.join(' ')} ...\n`);

  await spawn({
    command: 'npm',
    args: npmArgs,
    cwd,
    exceptionIfErrorCode: true,
  });

  logger.info('Installing is done, zipping...\n');

  pack(cwd, tgzPath, ['node_modules']);

  logger.info('Zipping is done.\n');
  console.timeEnd(timeLabel);
}

run();
