# lol-wad-parser
A parser for .wad files from League of Legends.

## Download
lol-wad-parser is installable via:

- [GitHub](https://github.com/Pupix/lol-wad-parser) `git clone https://github.com/Pupix/lol-wad-parser.git`
- [npm](https://www.npmjs.com/): `npm install lol-wad-parser`

## Usage example

```js
var WadParser = require('lol-wad-parser'),
    wad = new WadParser();

    wad.read('assets.wad', function (err, data) {
        console.log(data);
        //  [
        //    [Buffer ...]
        //    [Buffer ...]
        //  ]
    });

```

## Available methods

**N.B:** All methods act as promises if no callback is passed.

### parse(path, cb)

It will roughly parse a .wad file from the given path.

**Parameters**

1. **path {string}** A path to where the file to parse resides.
2. **[cb] {Function}** A callback called with `(error, parsedData)` as arguments.

### read(path, cb)

It will read a .wad file from the given path, casting all the data into the right variable type.

**Parameters**

1. **path {string}** A path to where the file to read resides.
2. **[cb] {Function}** A callback called with `(error, readData)` as arguments.

### extract(input, output, cb)

It will read a .wad and extract the result on disk.

**Parameters**

1. **input {string}** A path to where the file to read resides.
2. **output {string}** The path where the file should be stored.
3. **[cb] {Function}** A callback called with `(error)` as arguments.
