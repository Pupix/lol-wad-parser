(function () {
    'use strict';

    module.exports = function (wad, parser) {
        var i;

        parser.skip(84);
        wad.header.unk = parser.uint64();
        wad.header.entryHeaderOffset = parser.ushort();
        wad.header.entryHeaderCellSize = parser.ushort();
        
        wad.header.fileCount = parser.uint();
        
        wad.fileHeaders = [];
        
        for (i = 0; i < wad.header.fileCount; i += 1) {
            wad.fileHeaders.push({
                /**
                * Hash of the directory path, fs name is different han the one that gets called by the API
                *
                * From => :prefix/:plugin-name/:asset
                * To   => plugins/rcp-:prefix-:plugin-name/:region(default is global)/:language (default is 'default')/:asset
                */
                pathHash: parser.uint64(),
                offset: parser.uint(),
                compressedFileSize: parser.uint(),
                fileSize: parser.uint(),
                compressed: parser.uint(),
                // First 8 bytes of the fileEntry sha256
                sha256: parser.uint64()
            });
        }

    };

}());
