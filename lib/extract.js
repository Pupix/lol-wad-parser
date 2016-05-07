(function () {
    'use strict';

    // Vars
    var XP  = require('expandjs'),
        mkdirp = require('mkdirp'),
        fs = require('xp-fs'),
        path = require('path');

    /*********************************************************************/

    module.exports = function (data, output, cb) {
        var counter = 0,
            savePath;

        XP.iterate(data, function (next, file) {

            mkdirp(output, function (err) {
                if (err) { return cb(err, null); }

                savePath = path.resolve(output, String(counter));
                fs.writeFile(savePath, new Buffer(file), function (err) {
                    counter += 1;
                    cb(err || null);
                    next();
                });
            });

        }, cb);
    };

}());
