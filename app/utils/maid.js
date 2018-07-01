'use strict';
const path = require('path');

exports.replaceUglyDirname = function(dirname) {
    console.log('Maid.replaceUglyDirname()');
    let hasMetadata = false;
    if(typeof dirname === 'undefined') {
        return '';
    }
    const basename = path.basename(dirname); // TODO test that
    dirname = path.dirname(dirname); // TODO test that
    console.log('dirname:'+dirname);
    console.log('basename:'+basename);


    console.log('dirname:'+dirname);
    const regexp = /([^-]+)-(.*)/gm;
    const match = regexp.exec(basename);
    let artist = match[1];
    let albumAndMeta = match[2];
    console.log('!!!!!artist=['+artist+']');
    console.log('!!!!!albumAndMeta=['+albumAndMeta+']');
    artist = artist.trim();
    albumAndMeta = albumAndMeta.trim();
    artist = artist.replace(/-/g,' ');
    albumAndMeta = albumAndMeta.replace(/ +(?= )/g,'');
    artist = artist.replace(/ +(?= )/g,'');

    let album = '';
    let metadata = '';
    console.log('!!!!!albumAndMeta=['+albumAndMeta+']');
    const match2 = /([^-]+)-(.*)/gm.exec(albumAndMeta);
    console.log('test regex 2');
    if(match2 && Array.isArray(match2) && match2.length==3) {
        console.log('!!!!!hasMetadata');
        album = match2[1];
        album = album.trim();
        album = album.replace(/-/g,' ');
        album = album.replace(/ +(?= )/g,'');
        hasMetadata = true;
        metadata = match2[2];
        metadata = metadata.trim();
        metadata = metadata.replace(/-/g,' ');
        metadata = metadata.replace(/ +(?= )/g,'');
    } else {
        console.log('!!!!!has no Metadata');
    }

    let cleanDirname = '';
    if(hasMetadata) {
        cleanDirname = {
            path:dirname+'/'+artist+' - '+album+' - '+metadata,
            artist:artist,
            album:album,
            metadata:metadata,
        };
    } else {
        cleanDirname = {
            path:dirname+'/'+artist+' - '+albumAndMeta,
            artist:artist,
            album:albumAndMeta,
            metadata:'',
        };
    }

    return cleanDirname;
};

exports.replaceUglyFilename = function(filename) {
    console.log('Maid.replaceUglyFilename()');
    if(typeof filename === 'undefined') {
        return '';
    }

    const basename = path.basename(filename); // TODO test that
    const dirname = path.dirname(filename); // TODO test that
    console.log('filename:'+filename);
    console.log('dirname:'+dirname);
    console.log('basename:'+basename);
    const regexp = /([^-]+)-(.*)\.flac/gm;
    const match = regexp.exec(basename);
    let index = match[1];
    let songname = match[2];
    index = index.trim();
    songname = songname.trim();
    songname = songname.replace(/-/g,' ');
    songname = songname.replace(/ +(?= )/g,'');
    let cleanFilename = {
        path:dirname+'/'+index+' - '+songname+'.flac',
        track:index,
        title:songname,
    };
    return cleanFilename;
};

