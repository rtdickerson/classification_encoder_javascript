/**
 * Classification Encoder - JavaScript/Node.js Library
 * 
 * Main entry point for the classification encoder library.
 * Exports all public classes and utilities.
 */

const NamedBits = require('./NamedBits');
const BitmaskManager = require('./BitmaskManager');
const CountryDatabase = require('./CountryDatabase');
const ClassificationEncoder = require('./ClassificationEncoder');

module.exports = {
  NamedBits,
  BitmaskManager,
  CountryDatabase,
  ClassificationEncoder
};

// Export for CommonJS and ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NamedBits,
    BitmaskManager,
    CountryDatabase,
    ClassificationEncoder
  };
}
