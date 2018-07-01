/* eslint-env node, mocha */
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
require('chai').should();
const FlacFileHandler = require('../../app/file-handlers/flac-file-handler.js');
const fs = require('fs');
Chai.use(ChaiAsPromised);

/*
describe('FlacFileHandler', () => {
    describe('setMetadata()', () => {
        it('should replace &lt;br&gt; tags by \n', () => {
            function ensureDirExists(path, mask, cb) {
                console.log('AHHHHHH create dir:'+path);
                if (typeof mask == 'function') { // allow the `mask` parameter to be optional
                    cb = mask;
                    mask = '0777';
                }
                fs.mkdir(path, mask, function(err) {
                    if (err) {
                        if (err.code == 'EEXIST') {
                            console.log('directory already exists:'+err);
                            cb(null);
                        } // ignore the error if the folder already exists
                        else cb(err); // something else went wrong
                    } else cb(null); // successfully created folder
                });
            };
            ensureDirExists(__dirname+'/../tmp', '0744', function(err) {
                if (err) {
                    console.log('cannot create tmp directory:' + err);
                } else {
                    let promSet = FlacFileHandler.setMetadata(__dirname + '/../input-sample/Twisted Sister - Under The Blade - [2011][SHM-CD VQCD-10250, Japan]/01 - What You Don\'t Know (Sure Can Hurt You).flac',
                        __dirname + '/../tmp/01 - What You Don\'t Know (Sure Can Hurt You).flac',
                        'Twisted Sister',
                        'What You Don\'t Know (Sure Can Hurt You)',
                        'Under The Blade',
                        '01',
                        '1982');
                    //sleep.sleep(5)
                    console.log('finished! create flac');

                    promSet.then(function(res) {
                        console.log('XXX promesse tenue');
                        let comments = FlacFileHandler.getMetadata(
                            __dirname
                            + '/../tmp/01 - What You Don\'t Know (Sure Can Hurt You).flac');
                        console.log('comments:' + comments);
                        let promGet = FlacFileHandler.getMetadata(__dirname + '/../tmp/01 - What You Don\'t Know (Sure Can Hurt You).flac');
                        promGet.then(function(res) {
                            return res.should.equal({
                                isLast: false,
                                type: 4,
                                error: null,
                                hasData: true,
                                removed: false,
                                vendor: 'reference libFLAC 1.3.0 20130526',
                                comments: [
                                    'ARTIST=Twisted Sister',
                                    'TITLE=What You Don\'t Know (Sure Can Hurt You)',
                                    'ALBUM=Under The Blade',
                                    'TRACKNUMBER=01',
                                    'DATE=1982'],
                            });
                        });
                    }).catch(
                        // Promesse rejetée
                        function(err) {
                            console.log('XXX promesse rompue:' + err);
                        });
                }
            });
        });
    });
});
*/
