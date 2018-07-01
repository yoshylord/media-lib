'use strict';

const fs = require('fs');
const flac = require('../utils/flac-metadata');

function FlacFileHandler(src, dest, artist, title, album, track, date) {
    this.src = src;
    this.dest = dest;
    this.artist = artist;
    this.title = title;
    this.album = album;
    this.track = track;
    this.date = date;
    this.processor = new flac.Processor();
    console.log('FlacFileHandler() - ARGS  call !');
    console.log('FlacFileHandler()src:' + src);
    console.log('FlacFileHandler()dest:' + dest);
    console.log('FlacFileHandler()artist:' + artist);
    console.log('FlacFileHandler()title:' + title);
    console.log('FlacFileHandler()album:' + album);
    console.log('FlacFileHandler()track:' + track);
    console.log('FlacFileHandler()date:' + date);
};

FlacFileHandler.prototype.setMetadata = function(test) {
    return new Promise((resolve, reject) => {
        const self = this;
        console.log('FlacFileHandler.setMetadata()');
        console.log('test:' + test);

        if(!test) {
            console.log('it\'s not a test dude i\'m writing on disk, I\'ll write on:' + this.dest);

            const reader = fs.createReadStream(this.src);
            const writer = fs.createWriteStream(this.dest);


            const track = this.track;

            let mdbVorbis;
            const vendor = 'reference libFLAC 1.2.1 20070917';
            const comments = [
                'ARTIST=' + this.artist,
                'TITLE=' + this.title,
                'ALBUM=' + this.album,
                'TRACKNUMBER=' + this.track,
                'DATE=' + this.date];

            console.log('FlacFileHandler.setMetadata() - just build comments block :' + comments);


            const preprocessCb = function(mdb) {
                console.log(track + '[preprocess-----------------------------------------------------------------------------------');
                // Remove existing VORBIS_COMMENT block, if any.
                if(mdb.type === flac.Processor.MDB_TYPE_VORBIS_COMMENT) {
                    mdb.remove();
                }
                // Prepare to add new VORBIS_COMMENT block as last metadata block.
                if(mdb.isLast) {
                    mdb.isLast = false;
                    mdbVorbis = flac.data.MetaDataBlockVorbisComment.create(true, vendor, comments);
                }
                console.log('-----------------------------------------------------------------------------------preprocess]' + track);
            };
            this.processor.on('preprocess', preprocessCb);

            this.processor.on('postprocess', function(mdb) {
                console.log(track + '[postprocess-----------------------------------------------------------------------------------');
                console.log(mdb);
                if(mdbVorbis) {
                    // Add new VORBIS_COMMENT block as last metadata block.
                    self.processor.push(mdbVorbis.publish());
                }
                console.log('-----------------------------------------------------------------------------------postprocess]' + track);
            });


            writer.on('finish', () => {
                console.log('FlacFileHandler.setMetadata() - before resolve' + comments);
                resolve(comments);
                console.log('FlacFileHandler.setMetadata() - after resolve' + comments);
            });
            writer.on('error', () => {
                console.log('FlacFileHandler.setMetadata() - ERROR' + comments);
                reject();
            });

            reader.pipe(this.processor).pipe(writer);
        } else {
            console.log('it\'s a test dude relax, I\'m NOT writing on disk, but I\d like to write on:' + this.dest);
            resolve();
        }
    });
};

FlacFileHandler.prototype.getMetadata = function(src) {
    return new Promise((resolve, reject) => {
        const self = this;
        console.log('FlacFileHandler.getMetadata() start:' + src);
        let comments = [];

        const reader = fs.createReadStream(src);
        this.processor.setParseBlocks();
        const postprocessCb = function(mdb) {
            //console.log('[getMetadata postprocess-----------------------------------------------------------------------------------');
            if(Array.isArray(mdb.comments)) {
                //console.log('is ARRAY !!! ' + mdb.comments);
                //console.log('FlacFileHandler.getMetadata() postprocess:' + src);
                //console.log(mdb);
                //console.log(self.processor);
                comments = mdb.comments;
                resolve(comments);
            }
            //console.log('-----------------------------------------------------------------------------------getMetadata postprocess]');
        };

        const finishCb = function() {
            console.log('FlacFileHandler.getMetadata() - before resolve' + comments);
            resolve(comments);
            console.log('FlacFileHandler.getMetadata() - after resolve' + comments);
        };

        const errorCb = function() {
            console.log('FlacFileHandler.getMetadata() - ERROR' + comments);
            reject();
        };

        this.processor.on('postprocess', postprocessCb);
        this.processor.on('finish', finishCb);
        this.processor.on('close', finishCb);
        this.processor.on('error', errorCb);
        reader.on('error', errorCb);
        reader.pipe(this.processor);
        //console.log(this.processor);
        console.log('FlacFileHandler.getMetadata() end:' + src);
    });
};

module.exports = FlacFileHandler;
