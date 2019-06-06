'use strict';

const os = require('os');
const { readFileSync } = require('fs');
const path = require('path');
const fs = require('fs');

const { spawnAndGetOutputsStr } = require('../lib/spawn-utils');
const {cwd, npmArgs, createHash} = require('./common');
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

  arrStrsForHash.push(fs.readFileSync(path.join(cwd, 'package.json')));


  try {
    arrStrsForHash.push(fs.readFileSync(path.join(cwd, 'package-lock.json')));
  } catch (e) {
    logger.error(e.toString());
  }

  try {
    arrStrsForHash.push(fs.readFileSync(path.join('npm-shrinkwrap.json')));
  } catch (e) {
    logger.verbose(e.toString());
  }

  const hash = createHash(arrStrsForHash.join('\n'));

  return hash;
};
