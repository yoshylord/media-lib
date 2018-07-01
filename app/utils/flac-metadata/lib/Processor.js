var util = require("util");
var stream = require('stream');
var Transform = stream.Transform || require('readable-stream').Transform;

var MetaDataBlock = require("./data/MetaDataBlock");
var MetaDataBlockStreamInfo = require("./data/MetaDataBlockStreamInfo");
var MetaDataBlockVorbisComment = require("./data/MetaDataBlockVorbisComment");
var MetaDataBlockPicture = require("./data/MetaDataBlockPicture");

const STATE_IDLE = 0;
const STATE_MARKER = 1;
const STATE_MDB_HEADER = 2;
const STATE_MDB = 3;
const STATE_PASS_THROUGH = 4;

var Processor = function(options) {
    this.isFlac = false;
    this.buf;
    this.bufPos = 0;
    this.mdb;
    this.mdbLen = 0;
    this.mdbLast = false;
    this.mdbPush = false;
    this.mdbLastWritten = false;
    this.state = STATE_IDLE;
    this.parseMetaDataBlocks = false;

    console.log("XXX Processor constructore :" + options);
    if(!(this instanceof Processor)) {
        console.log("XXX Processor !(this instanceof Processor)");
        return new Processor(options);
    }
    if(options && !!options.parseMetaDataBlocks) {
        console.log("XXX Processor options && !!options.parseMetaDataBlocks");
        this.parseMetaDataBlocks = true;
    }
    Transform.call(this, options);
}

util.inherits(Processor, Transform);

// MDB types
Processor.MDB_TYPE_STREAMINFO = 0;
Processor.MDB_TYPE_PADDING = 1;
Processor.MDB_TYPE_APPLICATION = 2;
Processor.MDB_TYPE_SEEKTABLE = 3;
Processor.MDB_TYPE_VORBIS_COMMENT = 4;
Processor.MDB_TYPE_CUESHEET = 5;
Processor.MDB_TYPE_PICTURE = 6;
Processor.MDB_TYPE_INVALID = 127;

Processor.prototype.setParseBlocks= function() {
    this.parseMetaDataBlocks = true;
}

Processor.prototype._transform = function(chunk, enc, done) {
    var chunkPos = 0;
    var chunkLen = chunk.length;
    var isChunkProcessed = false;
    var _this = this;

    function safePush(minCapacity, persist, validate) {
        var slice;
        var chunkAvailable = chunkLen - chunkPos;
        var isDone = (chunkAvailable + _this.bufPos >= minCapacity);
        validate = (typeof validate === "function") ? validate : function() {
            return true;
        };
        if(isDone) {
            // Enough data available
            if(persist) {
                // Persist the entire block so it can be parsed
                if(_this.bufPos > 0) {
                    // Part of this block's data is in backup buffer, copy rest over
                    chunk.copy(_this.buf, _this.bufPos, chunkPos, chunkPos + minCapacity - _this.bufPos);
                    slice = _this.buf.slice(0, minCapacity);
                } else {
                    // Entire block fits in current chunk
                    slice = chunk.slice(chunkPos, chunkPos + minCapacity);
                }
            } else {
                slice = chunk.slice(chunkPos, chunkPos + minCapacity - _this.bufPos);
            }
            // Push block after validation
            validate(slice, isDone) && _this.push(slice);
            chunkPos += minCapacity - _this.bufPos;
            _this.bufPos = 0;
            _this.buf = null;
        } else {
            // Not enough data available
            if(persist) {
                // Copy/append incomplete block to backup buffer
                _this.buf = _this.buf || new Buffer(minCapacity);
                chunk.copy(_this.buf, _this.bufPos, chunkPos, chunkLen);
            } else {
                // Push incomplete block after validation
                slice = chunk.slice(chunkPos, chunkLen);
                validate(slice, isDone) && _this.push(slice);
            }
            _this.bufPos += chunkLen - chunkPos;
        }
        return isDone;
    }

    //console.log("XXX Processor.prototype._transform path:"+this._readableState.pipes.path);
    while(!isChunkProcessed) {
        switch(_this.state) {
        case STATE_IDLE:
            _this.state = STATE_MARKER;
            break;
        case STATE_MARKER:
            if(safePush(4, true, this._validateMarker.bind(this))) {
                _this.state = _this.isFlac ? STATE_MDB_HEADER : STATE_PASS_THROUGH;
            } else {
                isChunkProcessed = true;
            }
            break;
        case STATE_MDB_HEADER:
            //console.log("XXX Processor.prototype._transform : STATE_MDB_HEADER path:"+this._readableState.pipes.path);
            if(safePush(4, true, this._validateMDBHeader.bind(this))) {
                _this.state = STATE_MDB;
            } else {
                isChunkProcessed = true;
            }
            break;
        case STATE_MDB:
            if(safePush(_this.mdbLen, _this.parseMetaDataBlocks, this._validateMDB.bind(this))) {
                if(_this.mdb.isLast) {
                    // This MDB has the isLast flag set to true.
                    // Ignore all following MDBs.
                    _this.mdbLastWritten = true;
                }
                this.emit("postprocess", _this.mdb);
                _this.state = _this.mdbLast ? STATE_PASS_THROUGH : STATE_MDB_HEADER;
            } else {
                isChunkProcessed = true;
            }
            break;
        case STATE_PASS_THROUGH:
            safePush(chunkLen - chunkPos, false);
            isChunkProcessed = true;
            break;
        }
    }

    done();
}

Processor.prototype._validateMarker = function(slice, isDone) {
    this.isFlac = (slice.toString("utf8", 0) === "fLaC");
    // TODO: completely bail out if file is not a FLAC?
    return true;
}

Processor.prototype._validateMDBHeader = function(slice, isDone) {
    console.log("XXX Processor.prototype._validateMDBHeader");
    // Parse MDB header
    var header = slice.readUInt32BE(0);
    var type = (header >>> 24) & 0x7f;
    this.mdbLast = (((header >>> 24) & 0x80) !== 0);
    this.mdbLen = header & 0xffffff;

    // Create appropriate MDB object
    // (data is injected later in _validateMDB, if parseMetaDataBlocks option is set to true)
    switch(type) {
    case Processor.MDB_TYPE_STREAMINFO:
        this.mdb = new MetaDataBlockStreamInfo(this.mdbLast);
        break;
    case Processor.MDB_TYPE_VORBIS_COMMENT:
        console.log("XXX YYYYYY Processor.prototype._validateMDBHeader building comments" + this.mdbLast);
        this.mdb = new MetaDataBlockVorbisComment(this.mdbLast);
        break;
    case Processor.MDB_TYPE_PICTURE:
        this.mdb = new MetaDataBlockPicture(this.mdbLast);
        break;
    case Processor.MDB_TYPE_PADDING:
    case Processor.MDB_TYPE_APPLICATION:
    case Processor.MDB_TYPE_SEEKTABLE:
    case Processor.MDB_TYPE_CUESHEET:
    case Processor.MDB_TYPE_INVALID:
    default:
        this.mdb = new MetaDataBlock(this.mdbLast, type);
        break
    }

    // ACH
    //const achPath = this.ReadableState.pipes[Ø].path;
    //ACH
    //console.log("XXX Processor : emit preprocess:-----path:"+this._readableState.pipes.path);
    console.log("-----");
    this.emit("preprocess", this.mdb);

    if(this.mdbLastWritten) {
        // A previous MDB had the isLast flag set to true.
        // Ignore all following MDBs.
        this.mdb.remove();
    } else {
        // The consumer may change the MDB's isLast flag in the preprocess handler.
        // Here that flag is updated in the MDB header.
        if(this.mdbLast !== this.mdb.isLast) {
            if(this.mdb.isLast) {
                header |= 0x80000000;
            } else {
                header &= 0x7fffffff;
            }
            slice.writeUInt32BE(header >>> 0, 0);
        }
    }
    this.mdbPush = !this.mdb.removed;
    return this.mdbPush;
}

Processor.prototype._validateMDB = function(slice, isDone) {
    // Parse the MDB if parseMetaDataBlocks option is set to true
    if(this.parseMetaDataBlocks && isDone) {
        this.mdb.parse(slice);
    }
    return this.mdbPush;
}

Processor.prototype._flush = function(done) {
    // All chunks have been processed
    // Clean up
    this.state = STATE_IDLE;
    this.mdbLastWritten = false;
    this.isFlac = false;
    this.bufPos = 0;
    this.buf = null;
    this.mdb = null;
    done();
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX _Process._flush()');
}

module.exports = Processor;
