'use strict';

const {execSync} = require('child_process');

const { env } = process;
env.XZ_OPT = '-2 -T0';

/**
 * Архивирует пути, указанные в массиве 'include' относительно cwd в в файл, указанный как dstFile.
 * @param {string} cwd
 * @param {string} dstFile - Полный путь.
 * @param {string} dir - directory to zip.
 */
exports.pack = function pack(cwd, dstFile, dir) {

  execSync(`tar -cpJSf ${dstFile} ${dir}`, {
    cwd,
    env,
    windowsHide: true,
  });
};

exports.unpack = function unpack(cwd, srcFile) {
  execSync(`tar -xpJSf ${srcFile}`, {
    cwd,
    env,
    windowsHide: true,
  });
};
