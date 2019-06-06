'use strict';

const os = require('os');
const { readFileSync } = require('fs');
const path = require('path');

const { spawnAndGetOutputsStr } = require('../lib/spawn-utils');
const { cwd, npmArgs, createHash } = require('./common');
const logger = require('./logger');

module.exports = async function calcHash() {
  const osInfo = {
    arc: os.arch(),
    platform: os.platform(),
    release: os.release(),
    type: os.type(),
  };

  const arrStrsForHash = [];

  arrStrsForHash.push(JSON.stringify(osInfo));

  const nodeInfo = process.versions;

  arrStrsForHash.push(JSON.stringify(nodeInfo));

  const { out: npmVersion } = await spawnAndGetOutputsStr({
    command: 'npm',
    args: ['--version'],
    cwd,
    exceptionIfErrorCode: true,
  });

  arrStrsForHash.push(npmVersion);

  arrStrsForHash.push(npmArgs.join(' '));

  arrStrsForHash.push(readFileSync(path.join(cwd, 'package.json')));

  try {
    arrStrsForHash.push(readFileSync(path.join(cwd, 'package-lock.json')));
  } catch (e) {
    logger.error('No package-lock.json, not good :( \n');
  }

  try {
    arrStrsForHash.push(readFileSync(path.join('npm-shrinkwrap.json')));
  } catch (e) {
    logger.verbose(`${e.toString()}\n`);
  }

  const hash = createHash(arrStrsForHash.join('\n'));

  return hash;
};
