#wordnet-to-sqlite

A utility for parsing the wordnet files into an sqlite database 
using Node.js. 

## Install it on node from npm

`npm install wordnet-to-sqlite`

## Usage

I don't advise you use this quite yet. It isn't finished. This module currently  
parses the `data` and `index` files into an array of objects but does not 
produce an SQLite database.

### Parsing Entries From `data` and `index` Files into Arrays.
```
var wnsql = require('wordnet-to-sqlite');
var wordnet = require('WNdb');
wnsql.wordnetToArrays(wordnet.path, function (filename, arr) {
    console.log(filename + ' =', arr.entries[0]); 
});
```

### Parsing Entries From `data` and `index` Files into an SQLite Database.
```
var wnsql = require('wordnet-to-sqlite');
wnsql.wordnetToSqliteDb();
```

## Intellisense Support and Documentation

Visual studio intellisense support is available in docs/vsdoc/OpenLayersAll.js
Full documentation may be found at [http://matthewkastor.github.com/wordnet-to-sqlite](http://matthewkastor.github.io/wordnet-to-sqlite)
