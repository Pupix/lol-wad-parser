const parsers = require('./parsers');

/*********************************************************************/

module.exports = function (parser, cb) {

    const wad = {
        header: {}
    };

    wad.header.magic = parser.string(2);

    if (wad.header.magic !== 'RW') {
        throw new Error('Not a valid WAD file');
    }

    wad.header.verMajor = parser.ubyte();
    wad.header.verMinor = parser.ubyte();

    if (wad.header.verMajor > 3) {
        throw new Error('WAD version not supported. Please file an issue at https://github.com/Pupix/lol-wad-parser/issues');
    }

    parsers['v' + wad.header.verMajor](wad, parser);

    cb(null, wad);

};
