# Node moudules cache

```
Usage: "nmc <arbitrary arguments for npm>"
Exception: "nmc --nmc-clean" = cleans the whole cache

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

Saves <hash>.tgz in inner directory.


If hash is found in cache - just unzips it from cache.
If hash is not found - runs npm with specified parameters and then saves node_modules to cache.
