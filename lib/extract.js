(function () {
    'use strict';

    // Vars
    var XP  = require('expandjs'),
        mkdirp = require('mkdirp'),
        fs = require('xp-fs'),
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

        const magic = file.slice(0, 12).toString('hex');

        let ext = Object.keys(signatures).find(item => {
            return magic.startsWith(item)
        });

        if (ext) {
            if (signatures[ext] === 'min.js') {
                file = file.toString();
                [, ext] = file.match(/\/\/# sourceMappingURL=(.*)\.js\.map/);
                ext += '.js';
            } else if (signatures[ext] === 'jsonp') {
                file = file.toString();
                [, ext] = file.match(/\/\/# sourceMappingURL=(.*)\.js\.map/);
                ext += '.js';
            } else if (signatures[ext] === 'js.map') {
                file = file.toString();
                ext = `${JSON.parse(file).file}.map`;
            }  else if (signatures[ext] === 'js') {
                ext = `init.${signatures[ext]}`;
            } else {
                ext = `${header.pathHash}.${signatures[ext]}`;
            }
        }

        return ext || header.pathHash;
    }

    const _writeFile = (header, file, next) => {
        if (!Buffer.isBuffer(file)) {
            file = new Buffer(file || 0)
        }

        let savePath = path.resolve(header.output, _getSavePath(header, file));
        
        mkdirp(header.output, function (err) {
            if (err) { return next(err); }
            fs.writeFile(savePath , file, function (err) {
                next(err || null);
            });
        });
    }

    /*********************************************************************/

    module.exports = function (data, output, cb, parser) {

        XP.iterate(data.fileHeaders, function (next, header, i) {
            parser.seek(header.offset);
            let file = parser.ubyte(header.compressedFileSize);

            header.output = output;
            _ensureFile(header, file, next);
        }, function (err) {
            if (err) { return cb(err); }
            cb(null, true);
        });

    };

}());
