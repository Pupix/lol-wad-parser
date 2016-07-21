(function () {
    'use strict';

    // Vars
    var XP  = require('expandjs'),
        mkdirp = require('mkdirp'),
        fs = require('fs-extra'),
        path = require('path'),
        zlib = require('zlib'),
        signatures = require('./signatures.json');

    /*********************************************************************/

    const _ensureFile = (header, file, next) => {
        if (header.compressed) {
            zlib.unzip(new Buffer(file), function (err, file) {
                if (err) { return next(err); }
                _writeFile(header, file, next);
            });
        } else {
            _writeFile(header, file, next);
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
            console.log(ext, header.pathHash, signatures[ext]);
            return ext = `${header.pathHash}.${signatures[ext]}`;
        }

        return header.pathHash;
    }

    const _writeFile = (header, file, next) => {
        if (!Buffer.isBuffer(file)) {
            file = Buffer.from(file)
        }

        let savePath = path.join(header.output, _getSavePath(header, file));
        
        mkdirp(header.output, function (err) {
            if (err) { return next(err); }
            fs.outputFile(savePath , file, function (err) {
                next(err || null);
            });
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
        }, function (err) {
            if (err) { return cb(err); }
            cb(null, true);
        });

    };

}());
