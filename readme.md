# Node modules cache

Speeds up npm install / npm ci commands. Especially if you have multi-core CPU.

## Known issue on Windows

You must have `tar`, supporting `xpJSf` options, in your OS.
So everything is ok on Linux. But for Windows you must use tar from cygwin or smth like.
I could use npm tar module, but it supports max 99 symbols in file name.
If tar module will be fixed, I will use it.

## Installation

npm install -g @dzenly/nmc

## Usage

### `nmc <npm arguments destined for installation the whole node_modules>`
Runs npm with the specified arguments (saving node_modules in cache) or unzips archieve from cache.

### `nmc --nmc-clean`
Cleans the whole nmc cache.

### `nmc --nmc-cache-size`
Returns size of current cache.
  
### Examples:
* `nmc ci`
* `nmc ci --production`
* `nmc install`

## How it works

It calculates sha256 hash from:
* os.arch()
* os.platform()
* os.release()
* os.type()
* process.versions
* npm --version
* npm arguments passed in the command line
* package.json
* package-lock.json (if exists)
* npm-shrinkwrap.json (if exists)

If hash is found in cache - just unzips it from cache.

If hash is not found - runs npm with specified parameters and then saves node_modules to
the inner directory (cache) as `<hash>.txz`.

## Warning about postinstall.

nmc checks stdout to detect if there was `postinstall` run for the main module (not for dependencies),
and if yes - it will run `npm run postistall` after unzipping of cached archive.

So if your dependencies do something outside its node_modules, nmc, probably, is not for you.

## About uninstall

Please, use only npm arguments destined to installation. For other arguments the behaviour is undefined.

nmc does not support uninstall. So you can use `npm install -S some-module` and then run `nmc install`
to cache you new node_modules.

## About nmc install some-new-module

No, no, no. Use only commands for the whole node_modules installation
for your package.json, package-lock.json and npm-shrinkwrap.json.

## Use cases

* CI builds speed up.
* Fast branch switching for developers.

## Environment variables

* NPM_ORIG - path to npm binary, it allows to create such a script at your `~/bin/npm`.

```
#!/usr/bin/env bash

if [ -z "$NPM_ORIG" ]; then
  export NPM_ORIG=$(dirname $(which nmc))/npm
fi

if [[ -n "$NPM_USE_NMC" ]]; then
  if [[ "$1" == "install" || "$1" == "i" || "$1" == "ci" ]];then
    echo Install by NMC $NPM_ORIG "$@"
    nmc "$@"
    exit
  fi
fi

echo Install by NPM $NPM_ORIG "$@"

$NPM_ORIG "$@"
```

And add it to path: `export PATH=~/bin:$PATH`

So nmc will be used instead of npm if NPM_USE_NMC will be defined.
