### Installation

Navigate into own extension and use the following command lines:

```bash
# using yarn
yarn install

# using npm
npm i / npm ci (npm Version 6 or higher)
```

### Building files

```bash
# Currently webpack build has 4 default scripts
# 
# "dev-server": "encore dev-server"
# "dev": "encore dev"
# "watch": "encore dev --watch"
# "build": "encore production"
#
# Production build has no sourcemapping for displaying all scss-files into dev-tools

# using yarn
yarn dev-server|dev|watch|build

# using npm
npm run-script dev-server|dev|watch|build
```

### Migrating from current projects

- [TYPO3](Documentation/TYPO3.md)

### Setting favicon

- [Favicon](Documentation/Favicon.md)