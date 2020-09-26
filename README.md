# @nexssp / packUnpack

Just _**pack**_ or _**unpack**_ mulitple files and/or folders with the **.gitignore** rules. Put node_modules in the .gitignore and pack will ommit the whole directory.

## Example

```js
const { pack, unpack } = require('@nexssp/packunpack');
const package = path.resolve("../mypack.tar.gz");

pack(["myfolderOne","myfolder2","file1","file2","folderX",...], package)

unpack(package, "/tmp/") // extract files to the tmp folder

```

## Quick shell example

```sh
node -e "const {pack}= require('./src');pack('.gitignore','myf.tar.gz',{ force : true })"
node -e "const {pack}= require('./src');unpack('myf.tar.gz','../x')"
```

## Formats

- **tar.gz** - for now only tar/gz

## What pack returns

```js
const packReturnsExample = {
  ommited: [
    // from .gitignore
    'G:\\111222333\\node_modules\\@nexssp',
    '.........',
    'G:\\111222333\\node_modules\\@nexssp\\ansi\\README.md',
    'G:\\111222333\\node_modules\\@nexssp\\ansi\\dist\\ansi.js',
  ],
  packed: [
    'G:\\111222333',
    'G:\\111222333\\.gitignore',
    'G:\\111222333\\BBB.ign',
    '.........',
    'G:\\5\\1234\\stdinTest.js',
    'G:\\5\\1234\\xxxx.hs',
  ],
  file: '../../mypackXX1.tar.gz', // Result packed file
  includes: ['G:\\111222333', 'G:/5/1234'], // What was selected for packing
  size: 99388, // size in bytes
  sizeMB: 0.09478378295898438, // size in MB
};
```
