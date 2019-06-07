# Node modules cache

npm install -g @dzenly/nmc

```
  'Usage: "nmc <arbitrary arguments for npm>" - runs npm with the specified arguments (saving node_modules in cache)
  or unzips archieve from cache.'

  "nmc --nmc-clean" - cleans the whole cache.'

  "nmc --nmc-cache-size" - returns size of current cache.'
```

Calculates sha256 hash from:
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

Saves node_modules as `<hash>.tgz` to the inner directory.

If hash is found in cache - just unzips it from cache.
If hash is not found - runs npm with specified parameters and then saves node_modules to cache.

## Warning about postinstall.

nmc checks stdout to detect if there was `postinstall` run for the main module (not for dependencies),
and if yes - it will run `npm run postistall` after unzipping of cached archive.

So if your dependencies do something outside its node_modules, nmc, probably, is not for you.

## About uninstall

Please, use only npm arguments destined to installation. For other arguments the behaviour is undefined.

nmc does not support uninstall. So you can use `npm install -S some-module` and then run `nmc install`
to cache you new node_modules.

## Use cases

* CI builds speed up.
* Fast branch switching for developers.
