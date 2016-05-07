(function () {
    'use strict';

    // Vars
    var XP = require('expandjs'),
        zlib = require('zlib');

    /*********************************************************************/

    module.exports = function (data, cb) {

        var wad = [];

        XP.iterate(data.files, function (next, file, i) {
            if (data.fileHeaders[i].zipped) {
                zlib.unzip(new Buffer(file), function (err, res) {
                    if (err) { return next(err); }
                    wad.push(Array.prototype.slice.call(res));
                    next();
                });
            } else {
                wad.push(file);
                next();
            }
        }, function (err) {
            if (err) { return cb(err); }
            cb(null, wad);
        });

    };

}());
