module.exports = function (wad, parser) {
    wad.header.ECDSALength = parser.ubyte();
    wad.header.ECDSA = parser.byte(wad.header.ECDSALength);
    wad.header.ECDSAPadding = parser.byte(83 - wad.header.ECDSALength);
    wad.header.filesChecksum = parser.uint64();
    wad.header.entryHeaderOffset = parser.ushort();
    wad.header.entryHeaderCellSize = parser.ushort();

    wad.header.fileCount = parser.uint();

    wad.fileHeaders = [];

    for (let i = 0; i < wad.header.fileCount; i += 1) {
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
            type: parser.ubyte(),
            duplicate: parser.ubyte(),
            unk: parser.ubyte(),
            unk0: parser.ubyte(),
            // First 8 bytes of the fileEntry sha256
            sha256: parser.uint64()
        });
    }

};
