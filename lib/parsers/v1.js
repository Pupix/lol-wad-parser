(function () {
    'use strict';

    module.exports = function (wad, parser) {
        var i;

        wad.header.unks = {};
        wad.header.entryHeaderOffset = parser.ushort();
        wad.header.entryHeaderCellSize = parser.ushort();
        
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

    };

}());
