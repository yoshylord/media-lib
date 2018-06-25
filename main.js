const fs = require('fs');
const path = require('path');
var flac = require("flac-metadata");

var args = process.argv;
var dir = args[2];
var match = RegExp(args[3], 'g');
var replace = args[4];
var inc = args[5];
var test = args[6];
var option = args[7];
var files;
var OPT_DATE = false;

console.log('args:' + args);
console.log('dir:' + dir);
console.log('match:' + match);
console.log('replace:' + replace);
console.log('inc:' + inc);
console.log('test:' + test);
console.log('option:' + option);
var processor = new flac.Processor({parseMetaDataBlocks: true});
//reading the dir
files = fs.readdirSync(dir);
files.filter(function (file) {
    return file.match(match);
}).forEach(function (file) {
    if (inc.length < 2) {
        inc = '0' + inc;
    }
    //console.log('inc:'+inc);
    var filePath = path.join(dir, file),
        //newFilePath = path.join(dir, file.replace(match, replace + inc));
        newFilePath = path.join(dir, file.replace(match, replace));
    //console.log('   '+filePath);
    console.log('-->' + newFilePath);
    if (option.startsWith("date.") && option.length == 9 && filePath.endsWith(".flac")) {
        OPT_DATE = true;
        var date = parseInt(option.substring(5, 9));
        if (Number.isInteger(date)) {
            console.log('try process flac:' + filePath);
            var reader = fs.createReadStream(filePath);
            var writer = fs.createWriteStream(filePath);
            processor.on("postprocess", function (mdb) {
                console.log('processing flac : ' + filePath);
                //console.log(mdb.toString());
                console.log(mdb);
                if (Array.isArray(mdb.comments)) {
                    console.log('is ARRAY !!! ' + mdb.comments);
                    comments.push("DATE=" + date + "");
                }
            });
            processor.on('error', function (err) {
                console.log('error processing flac:' + err);
            });
            if (test != 'true') {
                reader.pipe(processor).pipe(writer);
            } else {
                reader.pipe(processor);
            }
        } else console.log('not integer');
    } else console.log('not date not flac not 9');

    //using fs.rename function to rename files
    if (test != 'true' && OPT_DATE == false) {
        //console.log('test is false');
        fs.renameSync(filePath, newFilePath);
    } else {
        //console.log('test is true')
    }
    inc++;
});