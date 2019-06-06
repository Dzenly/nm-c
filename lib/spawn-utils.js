'use strict';

const cp = require('child_process');
const logger = require('./logger');

// const { traceToSlack } = require('../slack/slack-bot');

/**
 * Запускает процесс, и ждет его завершения.
 * @param {String} command - команда для запуска.
 * @param {String[]} args - аргументы.
 * @param {String} cwd - рабочая директория.
 * @param stdOutCb - колбэк для сбора stdout.
 * @param stdErrCb - колбэк для сбора stderr.
 * Note: можно собирать stdout колбэками в массивы, а можно и
 * в реальном времени отправлять куда-то, например в WebSocket.
 *
 * @return {Promise<Number>} - Код возврата. Промис никогда не режектится.
 */
exports.spawn = function spawn({
                                 command,
                                 args,
                                 cwd,
                                 stdOutCb,
                                 stdErrCb,
                               }) {

  const text = `spawn: ${command} ${JSON.stringify(args)}`;
  logger.verbose(text);

  const child = cp.spawn(command, args, {
    cwd,
    windowsHide: true,
  });

  return new Promise((resolve, reject) => {
    child.stdout.on('data', (data) => {
      logger.silly(`spawn: stdout: ${data}`);
      stdOutCb(data.toString('utf8'));
    });

    child.stderr.on('data', (err) => {
      stdErrCb(err.toString('utf8'));
      logger.error(`spawn: stderr: ${err}`);
    });

    child.on('error', (err) => {
      logger.error(`spawn: error: ${err}`);
      reject(err);
    });

    child.on('close', (code) => {
      if (code === 0) {
        // logger.silly(`spawn: close: Exit code: ${code}`);
      } else {
        logger.verbose(`spawn: close: Exit code: ${code}`);
      }
      resolve(code);
    });
  });
};


/**
 * Запускает дочерний процесс, ждет завершения, и выдает массивы с stdout и stderr процесса.
 *
 * @param {String} command - команда для запуска.
 * @param {String[]} args - аргументы.
 * @param {String} cwd - рабочая директория.
 * @param {String} exceptionIfErrorCodeOrStderr - Надо ли выдавать эксепшн, если что-то есть в stderr или код возврата не 0.
 *
 * @return {Promise<{outArr: Array, errArr: Array}>}
 */
exports.spawnAndGetOutputsArr = async function spawnAndGetOutputs({
                                                                    command,
                                                                    args,
                                                                    cwd,
                                                                    exceptionIfErrorCodeOrStderr,
                                                                    exceptionIfErrorCode,
                                                                    exceptionIfStderrContains,
                                                                  }) {
  const outArr = [];
  const errArr = [];

  const code = await exports.spawn({
    command,
    args,
    cwd,
    stdOutCb: out => outArr.push(out),
    stdErrCb: err => errArr.push(err),
  });

  if (code < 0) {
    throw new Error(`spawnAndGetOutputsArr: negative error code: ${code},\nstderr: ${errArr.join('')}`);
  }

  if (exceptionIfStderrContains) {
    for (const stdErrStr of errArr) {
      if (stdErrStr.includes(exceptionIfStderrContains)) {
        throw new Error(`spawnAndGetOutputsArr: stderr contains: "${exceptionIfStderrContains}", code ${code},\nstderr: ${errArr.join('')}`);
      }
    }
  }

  if (exceptionIfErrorCodeOrStderr) {
    let errMsg = '';
    if (code !== 0) {
      errMsg = `spawnAndGetOutputsArr: error code: ${code}`;
    }
    if (errArr.length !== 0) {
      errMsg += `\nspawnAndGetOutputsArr: stderr: ${errArr.join('')}`;
    }
    if (errMsg) {
      throw new Error(errMsg);
    }
  }

  if (exceptionIfErrorCode) {
    let errMsg = '';
    if (code !== 0) {
      errMsg = `spawnAndGetOutputsArr: error code: ${code}\nstderr: ${errArr.join('')}`;
    }
    if (errMsg) {
      throw new Error(errMsg);
    }
  }

  return {
    code,
    outArr,
    errArr,
  };
};

exports.spawnAndGetOutputsStr = async function spawnAndGetOutputs({
                                                                    command,
                                                                    args,
                                                                    cwd,
                                                                    exceptionIfErrorCodeOrStderr,
                                                                    exceptionIfErrorCode,
                                                                    exceptionIfStderrContains,
                                                                  }) {
  const res = await exports.spawnAndGetOutputsArr({
    command,
    args,
    cwd,
    exceptionIfErrorCodeOrStderr,
    exceptionIfErrorCode,
    exceptionIfStderrContains,
  });

  const result = {
    code: res.code,
    out: res.outArr.join(''),
    err: res.errArr.join(''),
  };

  const text = `spawnAndGetOutputsStr: ${command} ${JSON.stringify(args)}, code: ${res.code}, stderr:\n"${result.err}"`;
  if (res.code !== 0) {
    logger.warn(`res.code: ${res.code}, args: ${text}`);

    // await traceToSlack({
    //   text,
    // });
  } else {
    // logger.verbose(text);
  }

  return result;
};

