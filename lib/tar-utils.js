'use strict';

const tar = require('tar');

/**
 * Архивирует пути, указанные в массиве 'include' относительно cwd в в файл, указанный как dstFile.
 * @param {string} cwd
 * @param {string} dstFile - Полный путь.
 * @param {string[]} include - куски путей от cwd.
 * @param {string[]} exclude - хвосты путей для исключения из архивации.
 */
exports.pack = function pack(cwd, dstFile, include, exclude) {
  function filter(path, stat) {
    for (const item of exclude) {
      if (path.endsWith(item)) {
        return false
      }
    }
    return true;
  }
  tar.c(
    {
      gzip: true,
      file: dstFile,
      cwd,
      sync: true,
      filter: (exclude) ? filter : null, // path, stat (returns true or false)
    },
    include
  );
};

exports.unpack = function unpack(cwd, srcFile) {
  tar.x(
    {
      gzip: true,
      file: srcFile,
      cwd,
      sync: true,
    },
  );
};
