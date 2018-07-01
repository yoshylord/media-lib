/* eslint-env node, mocha */
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
require('chai').should();
const FlacDirHandler = require('../../app/dir-handlers/flac-dir-handler.js');
const FlacFileHandler = require('../../app/file-handlers/flac-file-handler.js');
const fs = require('fs');
Chai.use(ChaiAsPromised);
const Configuration = require('../../app/utils/configuration.js');
console.log('STARTING CONF FILE:'+Configuration.get('filesystem:tmp'));

describe('FlacDirHandler', () => {
    describe('setMetadata()', () => {
        it('should set two flac files metadata\n', () => {
            function ensureDirExists(path, mask, cb) {
                console.log('AHHHHHH create dir:' + path);
                if(typeof mask == 'function') { // allow the `mask` parameter to be optional
                    cb = mask;
                    mask = '0777';
                }
                fs.mkdir(path, mask, function(err) {
                    if(err) {
                        if(err.code == 'EEXIST') {
                            console.log('directory already exists:' + err);
                            cb(null);
                        } // ignore the error if the folder already exists
                        else cb(err); // something else went wrong
                    } else cb(null); // successfully created folder
                });
            };
            ensureDirExists(Configuration.get('filesystem:tmp'), '0744', function(err) {
                if(err) {
                    console.log('cannot create tmp directory:' + err);
                } else {
                    let res01;
                    let res02;
                    console.log('Calling the FlacDirHandler.setMetadata shit !');
                    return FlacDirHandler.setMetadata(__dirname + '/../input-sample/Twisted Sister - Under The Blade - [2011][SHM-CD VQCD-10250, Japan]',
                        Configuration.get('filesystem:tmp'),
                        false, // it's a test
                        '1982')
                        .then(function(res) {
                            console.log('flac-dir-handler-test - promesse FlacDirHandler.setMetadata() tenue:' + res);
                            let flacFileHandler01 = new FlacFileHandler();
                            return flacFileHandler01.getMetadata(Configuration.get('filesystem:tmp')+'01 - What You Don\'t Know (Sure Can Hurt You).flac');
                        }, function(err) {
                            console.log(err);
                            return Promise.should.be.rejectedWith(err);
                        })
                        .then(function(r01) {
                            res01 = r01;
                            let flacFileHandler02 = new FlacFileHandler();
                            return flacFileHandler02.getMetadata(Configuration.get('filesystem:tmp')+'02 - Bad Boys (Of Rock \'n\' Roll).flac');
                        }, function(err) {
                            console.log(err);
                            return Promise.should.be.rejectedWith(err);
                        })
                        .then(function(res02) {
                            console.log('flac-dir-handler-test - ALL Promises FlacDirHandler.getMetadata() OK in test dir !');
                            console.log('res01:');
                            console.log(res01);
                            console.log('res02:');
                            console.log(res02);

                            return (res01.should.eql([
                                'ARTIST=Twisted Sister',
                                'TITLE=What You Don\'t Know (Sure Can Hurt You)',
                                'ALBUM=Under The Blade',
                                'TRACKNUMBER=01',
                                'DATE=1982']
                            )) && (res02.should.eql([
                                'ARTIST=Twisted Sister',
                                'TITLE=Bad Boys (Of Rock \'n\' Roll)',
                                'ALBUM=Under The Blade',
                                'TRACKNUMBER=02',
                                'DATE=1982']
                            ));
                        }, function(err) {
                            console.log(err);
                            return Promise.should.be.rejectedWith(err);
                        });
                }
            });
        });
    });
});

/*
describe('FlacDirHandler', () => {
    describe('setMetadata()', () => {
        it('should replace &lt;br&gt; tags by \n', () => {
            function ensureDirExists(path, mask, cb) {
                console.log('AHHHHHH create dir:' + path);
                if(typeof mask == 'function') { // allow the `mask` parameter to be optional
                    cb = mask;
                    mask = '0777';
                }
                fs.mkdir(path, mask, function(err) {
                    if(err) {
                        if(err.code == 'EEXIST') {
                            console.log('directory already exists:' + err);
                            cb(null);
                        } // ignore the error if the folder already exists
                        else cb(err); // something else went wrong
                    } else cb(null); // successfully created folder
                });
            };
            ensureDirExists(__dirname + '/../tmp', '0744', function(err) {
                if(err) {
                    console.log('cannot create tmp directory:' + err);
                } else {
                    const allPromises = [];
                    console.log('Calling the FlacDirHandler.setMetadata shit !');
                    FlacDirHandler.setMetadata(__dirname + '/../input-sample/Twisted Sister - Under The Blade - [2011][SHM-CD VQCD-10250, Japan]',
                        __dirname + '/../tmp/',
                        false, // it's a test
                        '1982').then(function(res) {
                        console.log('flac-dir-handler-test - promesse FlacDirHandler.setMetadata() tenue:' + res);
                        let flacFileHandler01 = new FlacFileHandler();
                        let promGet = flacFileHandler01.getMetadata(__dirname + '/../tmp/01 - What You Don\'t Know (Sure Can Hurt You).flac');
                        let flacFileHandler02 = new FlacFileHandler();
                        let promGet2 = flacFileHandler02.getMetadata(__dirname + '/../tmp/02 - Bad Boys (Of Rock \'n\' Roll).flac');

                        allPromises.push(promGet);
                        allPromises.push(promGet2);

                        Promise.all(allPromises).then(function(values) {
                            console.log(allPromises);
                            console.log('flac-dir-handler-test - ALL Promises FlacDirHandler.getMetadata() OK in test dir !');
                            console.log(values);

                            return (values[0].should.eql([
                                'ARTIST=Twisted Sister',
                                'TITLE=What You Don\'t Know (Sure Can Hurt You)',
                                'ALBUM=Under The Blade',
                                'TRACKNUMBER=01',
                                'DATE=1982']
                            )) && (values[1].should.eql([
                                'ARTIST=Twisted Sister',
                                'TITLE=Bad Boys (Of Rock \'n\' Roll)',
                                'ALBUM=Under The Blade',
                                'TRACKNUMBER=02',
                                'DATE=1982']
                            ));
                        }).catch(reason => {
                            console.log('flac-dir-handler-test - promesse FlacDirHandler.getMetadata() rompue:');
                            console.log(reason);
                            return Promise.should.be.rejectedWith(reason);
                        });
                    }).catch(reason => {
                        console.log('flac-dir-handler-test - promesse FlacDirHandler.setMetadata() rompue:');
                        console.log(reason);
                        return Promise.should.be.rejectedWith(reason);
                    });
                }
            });
        });
    });
});
*/
