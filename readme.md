# Node moudules cache

```
  'Usage: "nmc <arbitrary arguments for npm>" - runs npm with the specified arguments or unzips archieve from cache.'
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

Saves <hash>.tgz in inner directory.


If hash is found in cache - just unzips it from cache.
If hash is not found - runs npm with specified parameters and then saves node_modules to cache.
