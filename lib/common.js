'use strict';

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

exports.cwd = process.cwd();
exports.npmArgs = process.argv.slice(2);

exports.createHash = function createHash(text) {
  const hash = crypto.createHash('sha256');
  hash.update(text);
  return hash.digest('hex');
};

exports.cacheDir = path.resolve(__dirname, '..', 'cache-no-git');

if (!fs.existsSync(exports.cacheDir)) {
  fs.mkdirSync(exports.cacheDir);
}
