# osm-adiff-parser

Parsers OSM augmented diff (.osc) and returns elements grouped by changeset ID.
*Based on the parser in [planet-stream](https://github.com/developmentseed/planet-stream).*

## Setup

* npm install osm-adiff-parser

## Usage

```js

var parser = require('osm-adiff-parser');

// to filter certain changesets

parser(xml, ['46613588', '46613589'], function(err,data) {
    console.log(data);
});

// to get all changesets

parser(xml, null, function(err,data) {
    console.log(data);
});

```