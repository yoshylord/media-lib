'use strict';

const fs = require('fs');
const path = require('path');
const Maid = require('../utils/maid.js');
//import flacFileHandler from '../file-handlers/flac-file-handler.js';
//const FlacFileHandler = require('../file-handlers/flac-file-handler.js');

exports.setMetadata = function(srcdir, workingdir, test, date) {
    return new Promise((resolve, reject) => {;
        let files;
        let allPromises = [];
        console.log('FlacDirHandler.setMetadata() - STARTING FOR DIR');
        console.log('srcdir:' + srcdir);
        console.log('test:' + test);
        console.log('date:' + date);
        const cleanedDirname = Maid.replaceUglyDirname(srcdir);
        const dstdir = cleanedDirname.path;
        const artist = cleanedDirname.artist;
        const album = cleanedDirname.album;
        const metadata = cleanedDirname.metadata;
        console.log('dstdir :'+dstdir);

        files = fs.readdirSync(srcdir);
        files.filter(function(file) {
            return file.match(/(.*)\.flac/); // handle all flac files
        }).forEach(function(srcfile) {
            console.log('FlacDirHandler.setMetadata() - STARTING FOR FILE : '+srcfile);
            const cleanedFilename = Maid.replaceUglyFilename(srcfile);
            const dstfile = cleanedFilename.path;
            const track = cleanedFilename.track;
            const title = cleanedFilename.title;
            const srcfilePath = path.join(srcdir, srcfile);
            const dstfilePath = path.join(workingdir, dstfile);
            //const FlacFileHandler = require('../file-handlers/flac-file-handler.js');
            const FlacFileHandler = require('../file-handlers/flac-file-handler.js');
            let flacFileHandler = new FlacFileHandler(srcfilePath,
                dstfilePath,
                artist,
                title,
                album,
                track,
                '1982');
            let promSet = flacFileHandler.setMetadata(test).then(function(res) {
                console.log('FlacDirHandler.setMetadata() - just finished one promise : '+srcfile);
                console.log('FlacDirHandler.setMetadata() - just finished one promise with res: '+res);
            }).catch(
                // Promesse rejetée
                function(err) {
                    console.log('FlacDirHandler.setMetadata() - promesse set rompue:'+srcfile);
                    console.log(err);
                    reject(err);
                });
            allPromises.push(promSet);
        });

        Promise.all(allPromises).then(function(values) {
            console.log('all promises done:' + values);
            resolve(values);
            console.log('just resolved:');
        }).catch(
            // Promesse rejetée
            function(err) {
                console.log('all promise failed- promesse set rompue:');
                console.log(err);
                reject(err);
            });
    });
};
