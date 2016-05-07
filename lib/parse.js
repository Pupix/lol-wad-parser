(function () {
    'use strict';

    // Vars
    var XP = require('expandjs');

    /*********************************************************************/

    module.exports = function (parser, cb) {
        var wad = {},
            i;
        
        wad.header = {};
        
        wad.header.magic = parser.string(2);
        wad.header.verMinor = parser.ubyte();
        wad.header.verMajor = parser.ubyte();

        wad.header.unks = {};
        wad.header.unks[parser.tell()] = parser.ushort();
        wad.header.unks[parser.tell()] = parser.ushort();
        
        wad.header.fileCount = parser.uint();
        
        wad.fileHeaders = [];
        
        for (i = 0; i < wad.header.fileCount; i += 1) {
            wad.fileHeaders.push({
                unks: parser.uint(2),
                offset: parser.uint(),
                zipSize: parser.uint(),
                size: parser.uint(),
                zipped: parser.uint(),
            });
        }

        wad.files = [];
        for (i = 0; i < wad.header.fileCount; i += 1) {
            parser.seek(wad.fileHeaders[i].offset);
            wad.files[i] = parser.ubyte(wad.fileHeaders[i].zipSize);
        }

        cb(null, wad);

    };

}());
