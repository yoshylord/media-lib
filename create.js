var fs = require("fs");
var flac = require("app/utils/flac-metadata/index");

var reader = fs.createReadStream("/Users/antoinechantalou/Documents/Workspaces/media-lib/test/unit/../input-sample/Twisted Sister - Under The Blade - [2011][SHM-CD VQCD-10250, Japan]/01 - What You Don't Know (Sure Can Hurt You).flac");
var writer = fs.createWriteStream("/Users/antoinechantalou/Documents/Workspaces/media-lib/test/unit/../tmp/01 - What You Don't Know (Sure Can Hurt You).flac");
var processor = new flac.Processor();

var vendor = "reference libFLAC 1.2.1 20070917";
var comments = [
    "ARTIST=Boyracer",
    "TITLE=I've Got It And It's Not Worth Having",
    "ALBUM=B Is For Boyracer",
    "TRACKNUMBER=A1",
    "DATE=1993",
    "DISCOGS=22379"
];

processor.on("preprocess", function(mdb) {
    // Remove existing VORBIS_COMMENT block, if any.
    if (mdb.type === flac.Processor.MDB_TYPE_VORBIS_COMMENT) {
        mdb.remove();
    }
    // Inject new VORBIS_COMMENT block.
    if (mdb.removed || mdb.isLast) {
        var mdbVorbis = flac.data.MetaDataBlockVorbisComment.create(mdb.isLast, vendor, comments);
        this.push(mdbVorbis.publish());
    }
});

reader.pipe(processor).pipe(writer);