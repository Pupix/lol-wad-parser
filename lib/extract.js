const XP  = require('expandjs'),
    fs = require('fs-extra'),
    path = require('path'),
    zlib = require('zlib'),
    zstd = require('node-zstandard'),
    cp = require('child_process'),
    signatures = require('./signatures'),
    zstdBin = (process.platform === 'win32')?((process.arch === 'x64')?'zstd64.exe':'zstd32.exe'):((process.platform === 'darwin')?'zstd.darwin':'zstd.linux64'),
    zstdBinPath = path.resolve(path.dirname(require.resolve('node-zstandard')), 'bin', zstdBin);

const _ensureFile = (header, file, next) => {
    switch (header.type) {
        case 0x00:
            _writeFile(header, file, next);
            break;

        case 0x01:
            zlib.unzip(new Buffer(file), function (err, file) {
                if (err) { return next(err); }
                _writeFile(header, file, next);
            });
            break;

        case 0x02:
            // These are redirections to files outside the WAD itself
            next();
            break;

        case 0x03:
            const savePath = path.join(header.output, header.fileName || header.pathHash);
            const tmpPath = `${savePath}.zst`;

            fs.outputFile(tmpPath, Buffer.from(file), error => {
                if (error) {
                    next(error);
                    return;
                }

                const proc = cp.spawn(zstdBinPath, ['-d', tmpPath, '--rm', '-f', '-o', savePath]);

                proc.on('exit', (code, signal) => {
                    if (code !== 0) {
                        next(new Error(`Couldn\'t decompress file ${savePath}`));
                        return;
                    }

                    next();
                });

                proc.on('error', next);
            });
            break;

        default:
            console.log('Unknown file type. Please file an issue at https://github.com/Pupix/lol-wad-parser/issues');
            next();
    }
}

const _getSavePath = (header, file) => {

    if (header.fileName) { return header.fileName; }

    // Force file name by reading file contents
    const magic = file.slice(0, 12).toString('hex');

    let ext = Object.keys(signatures).find(item => {
        return magic.startsWith(item)
    });

    if (ext) {
        return ext = `${header.pathHash}.${signatures[ext]}`;
    }

    return header.pathHash;
}

const _writeFile = (header, file, next) => {
    if (!Buffer.isBuffer(file)) {
        file = Buffer.from(file)
    }

    let savePath = path.join(header.output, _getSavePath(header, file));

    fs.outputFile(savePath , file, function (err) {
        next(err || null);
    });
}

/*********************************************************************/

module.exports = function (headers, output, cb, parser) {

    XP.iterate(headers, function (next, header, i) {
        parser.seek(header.offset);
        let file;

        if (header.compressedFileSize) {
            file = parser.ubyte(header.compressedFileSize);
        } else {
            file = '';
        }

        header.output = output;
        _ensureFile(header, file, next);
    }, (error) => {
        if (error) {
            cb(error);
            return
        }
        cb(null, true);
    });

};
