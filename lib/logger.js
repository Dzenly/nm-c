'use strict';

const logLevel = process.env.NMC_LOG_LEVEL || 1;

module.exports = {
  error(err) {
    process.stderr.write(err);
  },
  info(msg) {
    if (logLevel > 0) {
      process.stdout.write(msg);
    }
  },
  verbose(msg) {
    if (logLevel > 2)
      process.stdout.write(msg);
  },
  silly(msg) {
    if (logLevel > 3) {
      process.stdout.write(msg);
    }
  },
};
