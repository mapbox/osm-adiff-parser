# osm-adiff-parser

Parsers OSM augmented diff (.osc) and returns elements grouped by changeset ID.
*Based on the parser in [planet-stream](https://github.com/developmentseed/planet-stream).*

## Setup

* npm install osm-adiff-parser

## Usage

```js

var parser = require('osm-adiff-parser');
parser(xml, function(err, data) {
    console.log(data);
});

```