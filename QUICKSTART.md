# Quick Start Guide - Classification Encoder JavaScript

## 🚀 Get Started in 5 Minutes

### Prerequisites

- Node.js 14+ 
- NPM 6+

Check your versions:
```bash
node --version
npm --version
```

### Step 1: Install Dependencies

```bash
npm install
```

Expected output:
```
added X packages
```

### Step 2: Run the Tests

```bash
npm test
```

Expected output:
```
PASS  tests/NamedBits.test.js
PASS  tests/BitmaskManager.test.js
PASS  tests/CountryDatabase.test.js
PASS  tests/ClassificationEncoder.test.js

Test Suites: 4 passed, 4 total
Tests:       115 passed, 115 total
```

### Step 3: Try It Out

Create a file `example.js`:

```javascript
const { ClassificationEncoder, NamedBits, BitmaskManager, CountryDatabase } = require('./src/index.js');

// Example 1: Basic Encoding
console.log('=== Example 1: Basic Encoding ===');
const encoder = new ClassificationEncoder();

const mask = encoder.encode('SECRET//NOFORN');
console.log('Encoded: 0x' + mask.toString(16).padStart(8, '0'));

const classification = encoder.decode(mask);
console.log('Decoded: ' + classification);

// Example 2: Different Classifications
console.log('\n=== Example 2: Different Classifications ===');
const examples = [
  'UNCLASSIFIED',
  'CONFIDENTIAL',
  'SECRET',
  'TOP SECRET',
  'SECRET//NOFORN',
  'TOP SECRET//SCI//NOFORN'
];

for (const example of examples) {
  const m = encoder.encode(example);
  const d = encoder.decode(m);
  console.log(`${example.padEnd(40)} -> 0x${m.toString(16).padStart(8, '0')} -> ${d}`);
}

// Example 3: Bitmask Operations
console.log('\n=== Example 3: Bitmask Operations ===');
const bitmask = new BitmaskManager();
bitmask.setNamedBit('SECRET');
bitmask.setNamedBit('NOFORN');
console.log('Bitmask: ' + bitmask.toString());
console.log('Has SECRET: ' + bitmask.isBitSet(NamedBits.SECRET));
console.log('Has NOFORN: ' + bitmask.isBitSet(NamedBits.NOFORN));

// Example 4: Country Codes
console.log('\n=== Example 4: Country Codes ===');
const db = new CountryDatabase();

const alpha3 = db.getAlpha3ForAlpha2('US');
console.log('US -> ' + alpha3);

const fvey = db.getFvey();
console.log('Five Eyes: ' + fvey.join(', '));

const countries = db.parseAndValidateRelto('REL TO USA, GBR, CA');
console.log('Parsed RELTO: ' + countries.join(', '));

// Example 5: SCI Compartments
console.log('\n=== Example 5: SCI Compartments ===');
const sciExamples = [
  'SECRET//SCI//NOFORN',
  'SECRET//SCI//SI//NOFORN',
  'SECRET//SCI//SI-GAMMA//NOFORN',
  'SECRET//SCI//SI-GAMMA/TK//NOFORN',
  'TOP SECRET//SCI//SI-GAMMA/TK/HCS//NOFORN'
];

for (const sci of sciExamples) {
  const m = encoder.encode(sci);
  const d = encoder.decode(m);
  console.log(`${d.padEnd(50)} (0x${m.toString(16).padStart(8, '0')})`);
}
```

Run it:
```bash
node example.js
```

Expected output:
```
=== Example 1: Basic Encoding ===
Encoded: 0x40000080
Decoded: SECRET//NOFORN

=== Example 2: Different Classifications ===
UNCLASSIFIED                         -> 0x10000000 -> UNCLASSIFIED
CONFIDENTIAL                         -> 0x20000000 -> CONFIDENTIAL
SECRET                               -> 0x40000000 -> SECRET
TOP SECRET                           -> 0x80000000 -> TOP SECRET
SECRET//NOFORN                       -> 0x40000080 -> SECRET//NOFORN
TOP SECRET//SCI//NOFORN              -> 0x81000080 -> TOP SECRET//SCI//NOFORN

=== Example 3: Bitmask Operations ===
Bitmask: 0x40000080
Has SECRET: true
Has NOFORN: true

=== Example 4: Country Codes ===
US -> USA
Five Eyes: USA, GBR, CAN, AUS, NZL
Parsed RELTO: USA, GBR, CAN

=== Example 5: SCI Compartments ===
SECRET//SCI//NOFORN                                (0x41000080)
SECRET//SCI//SI//NOFORN                            (0x41040080)
SECRET//SCI//SI-GAMMA//NOFORN                      (0x41140080)
SECRET//SCI//SI-GAMMA/TK//NOFORN                   (0x411c0080)
TOP SECRET//SCI//SI-GAMMA/TK/HCS//NOFORN           (0x811d0080)
```

## 📚 Common Usage Patterns

### Pattern 1: Basic Encoding

```javascript
const { ClassificationEncoder } = require('classification-encoder');

const encoder = new ClassificationEncoder();

// Encode a classification
const mask = encoder.encode('SECRET//NOFORN');
// Result: 0x40000080

// Decode it back
const classification = encoder.decode(mask);
// Result: 'SECRET//NOFORN'
```

### Pattern 2: Validation

```javascript
try {
  const mask = encoder.encode('SECRET//NOFORN');
  console.log('Valid classification');
} catch (error) {
  console.log('Invalid classification: ' + error.message);
}
```

### Pattern 3: Batch Processing

```javascript
const classifications = [
  'UNCLASSIFIED',
  'SECRET//NOFORN',
  'TOP SECRET//SCI//NOFORN'
];

const masks = classifications.map(cls => encoder.encode(cls));
console.log(masks);  // [0x10000000, 0x40000080, 0x81000080]
```

### Pattern 4: Working with Bitmasks

```javascript
const { BitmaskManager, NamedBits } = require('classification-encoder');

const bitmask = new BitmaskManager();

// Set bits
bitmask.setNamedBit('SECRET');
bitmask.setNamedBit('NOFORN');

// Check bits
const isSecret = bitmask.isBitSet(NamedBits.SECRET);

// Get the mask
const mask = bitmask.getBitmask();  // 0x40000080
```

### Pattern 5: Country Codes

```javascript
const { CountryDatabase } = require('classification-encoder');

const db = new CountryDatabase();

// Convert alpha-2 to alpha-3
const alpha3 = db.getAlpha3ForAlpha2('US');  // 'USA'

// Parse RELTO string
const countries = db.parseAndValidateRelto('REL TO US, GB, CA');
// Result: ['USA', 'GBR', 'CAN']

// Check if it's Five Eyes
const isFVEY = db.isFVEY(countries);  // false (missing AUS, NZL)
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test -- NamedBits.test.js
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Run in Watch Mode
```bash
npm run test:watch
```

## 📖 Exploring the Code

### Main Classes

1. **NamedBits** - Bit definitions
   ```javascript
   NamedBits.SECRET         // 0x40000000
   NamedBits.NOFORN         // 0x00000080
   NamedBits.getValue('SECRET')  // 0x40000000
   ```

2. **BitmaskManager** - Bit manipulation
   ```javascript
   const bm = new BitmaskManager();
   bm.setBit(0x40000000);
   bm.isBitSet(0x40000000);  // true
   ```

3. **CountryDatabase** - Country codes
   ```javascript
   const db = new CountryDatabase();
   db.getAlpha3ForAlpha2('US');  // 'USA'
   db.getFvey();  // ['USA', 'GBR', 'CAN', 'AUS', 'NZL']
   ```

4. **ClassificationEncoder** - Main encoder
   ```javascript
   const encoder = new ClassificationEncoder();
   encoder.encode('SECRET//NOFORN');  // 0x40000080
   encoder.decode(0x40000080);  // 'SECRET//NOFORN'
   ```

### Test Files

1. **NamedBits.test.js** - Tests for enum values
2. **BitmaskManager.test.js** - Tests for bit operations
3. **CountryDatabase.test.js** - Tests for country codes
4. **ClassificationEncoder.test.js** - Tests for encoding/decoding

## 🎯 Quick Reference

### Classification Levels
- `UNCLASSIFIED` = 0x10000000
- `CONFIDENTIAL` = 0x20000000
- `SECRET` = 0x40000000
- `TOP SECRET` = 0x80000000

### Special Markings
- `CUI` = UNCLASSIFIED + 0x00002000
- `SBU` = UNCLASSIFIED + 0x00001000

### Distribution
- `NOFORN` = 0x00000080
- `REL TO FVEY` = 0x00000020
- `REL TO NATO` = 0x00000040

### Format
```
CLASSIFICATION // [SAP] // [SCI] // [DISTRIBUTION]

Examples:
SECRET//NOFORN
TOP SECRET//SCI//NOFORN
SECRET//SCI//SI-GAMMA/TK//NOFORN
```

### Separators
- `//` = Main sections
- `/` = Compartments (SI, TK, HCS)
- `-` = Codewords within compartment

## 📦 NPM Scripts

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:verbose  # Run tests with verbose output
npm run lint          # Check code style
npm run lint:fix      # Fix code style issues
npm run build         # Run lint and tests
npm run dev           # Run example.js
```

## 🔗 Next Steps

1. **Read the full README**: `README.md`
2. **Review the tests**: `tests/`
3. **Explore the source**: `src/`
4. **Check the summary**: `PROJECT_SUMMARY.md`

## 🐛 Troubleshooting

### Tests fail to run
```bash
# Make sure dependencies are installed
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Linting errors
```bash
# Fix linting issues automatically
npm run lint:fix
```

### Import errors
```bash
# Make sure you're using the correct path
const { ClassificationEncoder } = require('./src/index.js');
// or
const { ClassificationEncoder } = require('classification-encoder');
```

---

**Ready to code!** 🚀

For more details, see `README.md` and `PROJECT_SUMMARY.md`.
