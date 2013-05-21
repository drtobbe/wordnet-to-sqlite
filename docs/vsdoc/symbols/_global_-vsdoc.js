
/* vsdoc for _global_ */

(function (window) {
    

    window._global_ = {
        /// <summary></summary>
        /// <field name="syntactic_markers" type="">This regular expression tests for and separates the `word` from it&apos;s 
        ///  syntactic marker.
        /// 
        /// The following notes are from wninput(5WN) at
        /// http://wordnet.princeton.edu/man/wninput.5WN.html
        /// 
        /// ASCII form of a word as entered in the synset by the lexicographer, with 
        /// spaces replaced by underscore characters (_). The text of the word is 
        /// case sensitive, in contrast to its form in the corresponding index. pos 
        /// file, that contains only lower-case forms. In data.adj , a word is 
        /// followed by a syntactic marker if one was specified in the lexicographer 
        /// file. A syntactic marker is appended, in parentheses, onto word without 
        /// any intervening spaces. See wninput(5WN) for a list of the syntactic 
        /// markers for adjectives.
        /// 
        /// The syntactic markers are:
        /// 
        /// (p)    predicate position
        /// (a)    prenominal (attributive) position
        /// (ip)   immediately postnominal position</field>
        /// <field name="source_target" type="">This regular expression separates the source and target identifiers.
        /// this pattern returns [&quot;0a3b&quot;, &quot;0a&quot;, &quot;3b&quot;]
        /// for &quot;0a3b&quot;.match(source_target);
        /// 
        /// The following notes are from
        /// http://wordnet.princeton.edu/man/wninput.5WN.html
        /// 
        /// The source/target field distinguishes lexical and semantic pointers. It 
        /// is a four byte field, containing two two-digit hexadecimal integers. The 
        /// first two digits indicates the word number in the current (source) 
        /// synset, the last two digits indicate the word number in the target 
        /// synset. A value of 0000 means that pointer_symbol represents a semantic 
        /// relation between the current (source) synset and the target synset 
        /// indicated by synset_offset.</field>
        /// <returns type="_global_"/>
                
        parseDataFileFormat: function(record) {
            /// <summary>Parses the `data.` file&apos;s individual records.</summary>
            /// <param name="record" type="String">A line of information from the `data.` file.</param>
            /// <returns type="Object">Returns an object containing properties whose values are 
            ///  determined by the parsed data.</returns>
        }, 
        
        wordNetDataFileToArray: function(fileContents) {
            /// <summary>Converts `data.` files into an array.</summary>
            /// <param name="fileContents" type="String">The contents of the file to parse.</param>
            /// <returns type="Object">Returns an object with two properties: license and entries.
            ///  The license property contains the license header from the file. The entries
            ///  property contains the array of parsed information.</returns>
        }
        
    };

    var $x = window._global_;
    $x.__namespace = "true";
    $x.__typeName = "_global_";
})(this);
