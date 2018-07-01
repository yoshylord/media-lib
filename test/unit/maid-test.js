/* eslint-env mocha */
'use strict';

const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
require('chai').should();
const Maid = require('../../app/utils/maid.js');
Chai.use(ChaiAsPromised);


describe('Maid', () => {
    describe('replaceUglyHTML()', () => {
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01-foo1.flac').path.should.equal('./01 - foo1.flac');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01-foo1.flac').track.should.equal('01');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01-foo1.flac').title.should.equal('foo1');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01-foo1-foo2.flac').path.should.equal('./01 - foo1 foo2.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01-foo1-foo2-foo3.flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01 -foo1-foo2-foo3.flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename(' 01-foo1-foo2-foo3.flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename(' 01 -foo1-foo2-foo3.flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename(' 01  -foo1-foo2-foo3.flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01- foo1-foo2-foo3.flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01-foo1-foo2-foo3 .flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01- foo1-foo2-foo3 .flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });

        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyFilename('01-  foo1- foo2 foo3  .flac').path.should.equal('./01 - foo1 foo2 foo3.flac');
        });
    });

    describe('replaceUglyDirname()', () => {
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister - Under The Blade').path.should.equal('./Twisted Sister - Under The Blade');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister - Under The Blade').artist.should.equal('Twisted Sister');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister - Under The Blade').album.should.equal('Under The Blade');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister - Under The Blade').metadata.should.equal('');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister- Under The Blade').path.should.equal('./Twisted Sister - Under The Blade');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister -Under The Blade').path.should.equal('./Twisted Sister - Under The Blade');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister-Under The Blade').path.should.equal('./Twisted Sister - Under The Blade');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister - Under The Blade - [2011][SHM-CD VQCD-10250, Japan]').path.should.equal('./Twisted Sister - Under The Blade - [2011][SHM CD VQCD 10250, Japan]');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister - Under The Blade - [2011][SHM-CD VQCD-10250, Japan]').artist.should.equal('Twisted Sister');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister - Under The Blade - [2011][SHM-CD VQCD-10250, Japan]').album.should.equal('Under The Blade');
        });
        it('should replace &lt;br&gt; tags by \n', () => {
            return Maid.replaceUglyDirname('Twisted Sister - Under The Blade - [2011][SHM-CD VQCD-10250, Japan]').metadata.should.equal('[2011][SHM CD VQCD 10250, Japan]');
        });
    });
});
