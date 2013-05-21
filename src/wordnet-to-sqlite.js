/*jslint
    white: true,
    node: true,
    stupid: true,
    nomen: true,
    vars: true,
    regexp: true
*/

/**
 * @fileOverview A utility for parsing the WordNet files into an sqlite database using Node.js
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @version 0.0.1
 * @requires fs
 * @requires WNdb
 * @requires sqlite3
 * @exports nothing yet
 */

/**
 * This regular expression tests for and separates the `word` from it's 
 *  syntactic marker.
 * 
 * The following notes are from wninput(5WN) at
 * http://wordnet.princeton.edu/man/wninput.5WN.html
 * 
 * ASCII form of a word as entered in the synset by the lexicographer, with 
 * spaces replaced by underscore characters (_). The text of the word is 
 * case sensitive, in contrast to its form in the corresponding index. pos 
 * file, that contains only lower-case forms. In data.adj , a word is 
 * followed by a syntactic marker if one was specified in the lexicographer 
 * file. A syntactic marker is appended, in parentheses, onto word without 
 * any intervening spaces. See wninput(5WN) for a list of the syntactic 
 * markers for adjectives.
 * 
 * The syntactic markers are:
 * 
 * (p)    predicate position
 * (a)    prenominal (attributive) position
 * (ip)   immediately postnominal position
 * 
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @version 20130521
 */
var syntactic_markers = /(.*)\((..?)\)/;
/**
 * This regular expression separates the source and target identifiers.
 * this pattern returns ["0a3b", "0a", "3b"]
 * for "0a3b".match(source_target);
 * 
 * The following notes are from
 * http://wordnet.princeton.edu/man/wninput.5WN.html
 * 
 * The source/target field distinguishes lexical and semantic pointers. It 
 * is a four byte field, containing two two-digit hexadecimal integers. The 
 * first two digits indicates the word number in the current (source) 
 * synset, the last two digits indicate the word number in the target 
 * synset. A value of 0000 means that pointer_symbol represents a semantic 
 * relation between the current (source) synset and the target synset 
 * indicated by synset_offset.
 * 
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @version 20130521
 */
var source_target = /([0-9a-f]{2})([0-9a-f]{2})/;
/**
 * Parses the `data.` file's individual records.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @version 20130521
 * @param {String} record A line of information from the `data.` file.
 * @returns {Object} Returns an object containing properties whose values are 
 *  determined by the parsed data.
 * @example
 * // This is example output
 * 
 * { gloss: 'without musical accompaniment; "they performed a cappella"',
 *   synset_offset: '00001740',
 *   lex_filenum: '02',
 *   ss_type: 'r',
 *   w_cnt: '01',
 *   words: [ { word: 'a_cappella', syntactic_markers: '', lex_id: '0' } ],
 *   p_cnt: '000',
 *   pointers: [],
 *   f_cnt: 0,
 *   frames: [] }
 *
 * @example
 * // This is example output
 * 
 * { gloss: 'draw air into, and expel out of, the lungs; "I can breathe 
 *  better when the air is clean"; "The patient is respiring"',
 *   synset_offset: '00001740',
 *   lex_filenum: '29',
 *   ss_type: 'v',
 *   w_cnt: '04',
 *   words: 
 *    [ { word: 'breathe', syntactic_markers: '', lex_id: '0' },
 *      { word: 'take_a_breath', syntactic_markers: '', lex_id: '0' },
 *      { word: 'respire', syntactic_markers: '', lex_id: '0' },
 *      { word: 'suspire', syntactic_markers: '', lex_id: '3' } ],
 *   p_cnt: '021',
 *   pointers: 
 *    [ { pointer_symbol: '*',
 *        synset_offset: '00005041',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '*',
 *        synset_offset: '00004227',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '+',
 *        synset_offset: '03110322',
 *        ss_type: 'a',
 *        source_target: '0301',
 *        source: '03',
 *        target: '01' },
 *      { pointer_symbol: '+',
 *        synset_offset: '00831191',
 *        ss_type: 'n',
 *        source_target: '0303',
 *        source: '03',
 *        target: '03' },
 *      { pointer_symbol: '+',
 *        synset_offset: '04080833',
 *        ss_type: 'n',
 *        source_target: '0301',
 *        source: '03',
 *        target: '01' },
 *      { pointer_symbol: '+',
 *        synset_offset: '04250850',
 *        ss_type: 'n',
 *        source_target: '0105',
 *        source: '01',
 *        target: '05' },
 *      { pointer_symbol: '+',
 *        synset_offset: '00831191',
 *        ss_type: 'n',
 *        source_target: '0101',
 *        source: '01',
 *        target: '01' },
 *      { pointer_symbol: '^',
 *        synset_offset: '00004227',
 *        ss_type: 'v',
 *        source_target: '0103',
 *        source: '01',
 *        target: '03' },
 *      { pointer_symbol: '^',
 *        synset_offset: '00005041',
 *        ss_type: 'v',
 *        source_target: '0103',
 *        source: '01',
 *        target: '03' },
 *      { pointer_symbol: '$',
 *        synset_offset: '00002325',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '$',
 *        synset_offset: '00002573',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00002573',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00002724',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00002942',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00003826',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00004032',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00004227',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00005041',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00006697',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00007328',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00017031',
 *        ss_type: 'v',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' } ],
 *   f_cnt: '02',
 *   frames: [ { f_num: '02', w_num: '00' }, { f_num: '08', w_num: '00' } ] }
 * 
 * @example
 * // This is example output
 * 
 * { gloss: '(usually followed by `to\') having the necessary means or 
 *  skill or know-how or authority to do something; "able to swim"; 
 *  "she was able to program her computer"; "we were at last able to 
 *  buy a car"; "able to get a grant for the project"',
 *   synset_offset: '00001740',
 *   lex_filenum: '00',
 *   ss_type: 'a',
 *   w_cnt: '01',
 *   words: [ { word: 'able', syntactic_markers: '', lex_id: '0' } ],
 *   p_cnt: '005',
 *   pointers: 
 *    [ { pointer_symbol: '=',
 *        synset_offset: '05200169',
 *        ss_type: 'n',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '=',
 *        synset_offset: '05616246',
 *        ss_type: 'n',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '+',
 *        synset_offset: '05616246',
 *        ss_type: 'n',
 *        source_target: '0101',
 *        source: '01',
 *        target: '01' },
 *      { pointer_symbol: '+',
 *        synset_offset: '05200169',
 *        ss_type: 'n',
 *        source_target: '0101',
 *        source: '01',
 *        target: '01' },
 *      { pointer_symbol: '!',
 *        synset_offset: '00002098',
 *        ss_type: 'a',
 *        source_target: '0101',
 *        source: '01',
 *        target: '01' } ],
 *   f_cnt: 0,
 *   frames: [] }
 * 
 * @example
 * // This is example output
 * 
 * { gloss: 'that which is perceived or known or inferred to have its 
 *  own distinct existence (living or nonliving)',
 *   synset_offset: '00001740',
 *   lex_filenum: '03',
 *   ss_type: 'n',
 *   w_cnt: '01',
 *   words: [ { word: 'entity', syntactic_markers: '', lex_id: '0' } ],
 *   p_cnt: '003',
 *   pointers: 
 *    [ { pointer_symbol: '~',
 *        synset_offset: '00001930',
 *        ss_type: 'n',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '00002137',
 *        ss_type: 'n',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' },
 *      { pointer_symbol: '~',
 *        synset_offset: '04424418',
 *        ss_type: 'n',
 *        source_target: '0000',
 *        source: '00',
 *        target: '00' } ],
 *   f_cnt: 0,
 *   frames: [] }
 * 
 */
function parseDataFileFormat (record) {
    'use strict';
    var out = {};
    var tmp = record.split('|');
    out.gloss = tmp[1].trim();
    tmp = tmp[0].trim().split(' ');
    out.synset_offset = tmp.shift();
    out.lex_filenum = tmp.shift();
    out.ss_type = tmp.shift();
    out.w_cnt = tmp.shift();
    var numWords = parseInt(out.w_cnt, 16);
    out.words = [];
    var wrd = '';
    var synMark = '';
    while (numWords > 0) {
        wrd = tmp.shift();
        synMark = '';
        if (syntactic_markers.test(wrd)) {
            synMark = wrd.match(syntactic_markers)[2];
            wrd = wrd.match(syntactic_markers)[1];
        }
        out.words.push({
            "word" : wrd,
            "syntactic_markers" : synMark,
            "lex_id" : tmp.shift()
        });
        numWords -= 1;
    }
    out.p_cnt = tmp.shift();
    var numPtr = parseInt(out.p_cnt, 10);
    var drawer = '';
    out.pointers = [];
    while (numPtr > 0) {
        drawer = {
            "pointer_symbol" : tmp.shift(),
            "synset_offset" : tmp.shift(),
            "ss_type" : tmp.shift(),
            "source_target" : tmp.shift()
        };
        drawer.source = drawer.source_target.match(source_target)[1];
        drawer.target = drawer.source_target.match(source_target)[2];
        out.pointers.push(drawer);
        numPtr -= 1;
    }
    out.f_cnt = 0;
    out.frames = [];
    if (tmp.length > 0) {
        out.f_cnt = tmp.shift();
        var numFrames = parseInt(out.f_cnt, 10);
        while (numFrames > 0) {
            tmp.shift(); // throw away superfluous + sign, there's a count.
            out.frames.push({
                "f_num" : tmp.shift(), 
                "w_num" : tmp.shift()
            });
            numFrames -= 1;
        }
    }
    return out;
}
/**
 * Converts `data.` files into an array.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @version 20130521
 * @param {String} fileContents The contents of the file to parse.
 * @returns {Object} Returns an object with two properties: license and entries.
 *  The license property contains the license header from the file. The entries
 *  property contains the array of parsed information.
 * @example
 * var wordnet = require('WNdb');
 * var path = require('path');
 * var fs = require('fs');
 * 
 * wordnet.files.forEach(function (filename) {
 *     'use strict';
 *     var fname = path.resolve(wordnet.path, filename);
 *     
 *     fs.readFile(fname, 'utf8', function (err, contents) {
 *         if (err) {
 *             throw err;
 *         }
 *         if (/data/.test(filename)) {
 *             console.log(
 *                 // let's not get carried away here. we'll look at the first
 *                 // entry parsed from each file.
 *                 wordNetDataFileToArray(contents).entries[0]
 *             );
 *         }
 *     });
 * });
 * // see the example for `parseDataFileFormat` and imagine those massive 
 * // objects in an array... 
 * @see parseDataFileFormat
 */
function wordNetDataFileToArray (fileContents) {
    'use strict';
    var comments = /^ {2}.*$/gm;
    var out = {
        "license" : fileContents.match(comments).join('\n'),
        "entries" : fileContents.replace(comments, '')
            .replace(/(\r\n|\r|\n)+/g, '\n')
            .trim()
            .split('\n')
            .map(function (entry) {
                return parseDataFileFormat(entry);
            })
    };
    return out;
}




// ############# converts `data.` files into an array but does not work on 
// `index.` files yet.
var wordnet = require('WNdb');
var path = require('path');
var fs = require('fs');

wordnet.files.forEach(function (filename) {
    'use strict';
    var fname = path.resolve(wordnet.path, filename);
    
    fs.readFile(fname, 'utf8', function (err, contents) {
        if (err) {
            throw err;
        }
        if (/data/.test(filename)) {
            console.log(
                wordNetDataFileToArray(contents).entries[0]
            );
        }
    });
});


