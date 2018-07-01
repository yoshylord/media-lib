const Configuration = require('./app/utils/configuration.js');
const FlacDirHandler = require('./app/dir-handlers/flac-dir-handler.js');


const srcdir = process.argv[2];
const year = process.argv[3];

function getBool(val) {
    let num = +val;
    return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
}

const test = getBool(process.argv[4]);

console.log('STARTING SCRIPT...');
console.log('Working directory : '+Configuration.get('filesystem:tmp'));
console.log('Source directory : ' + srcdir);
console.log('Year : ' + year);
console.log('test : ' + test);

if (test) {
    console.log('It\'s a test !');
} else {
    console.log('It\'s not a test !');
}

FlacDirHandler.setMetadata(srcdir,
    Configuration.get('filesystem:tmp'),
    test, // it's a test
    year);

