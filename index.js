var R = require('ramda');
var expat = require('node-expat');

// Returns elements grouped by changeset ID.

function AugmentedDiffParser (xmlData, callback) {
  var xmlParser = new expat.Parser('UTF-8');
  var currentAction = '';
  var currentElement = {};
  var oldElement = {};
  var currentMember = {};
  var currentMode = '';
  var changesetMap = {};

  function isElement (symbol) {
    return (symbol === 'node' || symbol === 'way' || symbol === 'relation');
  }

  function endTag (symbol, attrs) {
    if (symbol === 'action') {
      var changeset = currentElement.changeset;
      if (changesetMap[changeset]) {
        changesetMap[changeset].push(currentElement);
      } else {
        changesetMap[changeset] = [currentElement];
      }
    }
    if (symbol === 'osm') {
      callback(null, changesetMap);
    }
  }

  function startTag (symbol, attrs) {
    if (symbol === 'action') {
      currentAction = attrs.type;
    }
    if (symbol === 'new' || symbol === 'old') {
      currentMode = symbol;
    }
    if (isElement(symbol)) {
      if (currentMode === 'new' && (currentAction === 'modify' ||
                                    currentAction === 'delete')) {
        oldElement = R.clone(currentElement);
        currentElement = attrs;
        currentElement.old = oldElement;
      } else {
        currentElement = attrs;
      }
      currentElement.action = currentAction;
      currentElement.type = symbol;
      currentElement.tags = {};
      if (symbol === 'way') {currentElement.nodes = []; }
      if (symbol === 'relation') {currentElement.members = []; currentMember = {};}
    }
    if (symbol === 'tag' && currentElement) {
      currentElement.tags[attrs.k] = attrs.v;
    }

    if (symbol === 'nd' && currentElement && currentElement.type === 'way') {
      currentElement.nodes.push(attrs);
    }

    if (symbol === 'nd' && currentElement && currentElement.type === 'relation') {
      currentMember.nodes.push(attrs);
    }

    if (symbol === 'member' && currentElement && currentElement.type === 'relation') {
      currentMember = R.clone(attrs);
      currentMember.nodes = [];
      currentElement.members.push(currentMember);
    }
  }

  xmlParser.on('startElement', startTag);
  xmlParser.on('endElement', endTag);
  xmlParser.on('error', function(err) { callback(err, null); });
  xmlParser.write(xmlData);

}

module.exports = AugmentedDiffParser;

