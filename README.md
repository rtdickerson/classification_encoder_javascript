# Classification Encoder - JavaScript

A JavaScript/Node.js library to encode/decode classification strings to/from unsigned 32-bit integers. This is a port of the Python classification encoder library, built using Test-Driven Development (TDD) with Jest.

## Features

- ✅ Encode classification strings to 32-bit integers
- ✅ Decode integers back to classification strings
- ✅ Support for all classification levels (UNCLASSIFIED, CONFIDENTIAL, SECRET, TOP SECRET)
- ✅ Support for SCI compartments (SI, TK, HCS)
- ✅ Support for SCI codewords (GAMMA, SI-GROUPA, SI-GROUPB, SI-GROUPC)
- ✅ Support for distribution controls (NOFORN, RELTO FVEY, NATO, 9EYES, 14EYES)
- ✅ Support for special markings (CUI, SBU, FOUO)
- ✅ Country code conversion (alpha-2 to alpha-3)
- ✅ Intelligence alliance detection (FVEY, NATO, 9EYES, 14EYES)
- ✅ Custom configuration support
- ✅ Full TypeScript support

## Installation

```bash
npm install classification-encoder
```

## Quick Start

### Basic Usage

```javascript
const { ClassificationEncoder } = require('classification-encoder');

const encoder = new ClassificationEncoder();

// Encode
const mask = encoder.encode('SECRET//NOFORN');
console.log(mask);  // 1073741952
console.log('0x' + mask.toString(16));  // 0x40000080

// Decode
const classification = encoder.decode(mask);
console.log(classification);  // SECRET//NOFORN
```

### Using Named Bits

```javascript
const { NamedBits, BitmaskManager } = require('classification-encoder');

const bitmask = new BitmaskManager();
bitmask.setNamedBit('SECRET');
bitmask.setNamedBit('NOFORN');

console.log(bitmask.toString());  // 0x40000080
console.log(bitmask.isBitSet(NamedBits.SECRET));  // true
```

### Country Code Conversion

```javascript
const { CountryDatabase } = require('classification-encoder');

const db = new CountryDatabase();

// Convert alpha-2 to alpha-3
const alpha3 = db.getAlpha3ForAlpha2('US');
console.log(alpha3);  // USA

// Check alliance membership
const fvey = db.getFvey();
console.log(fvey);  // ['USA', 'GBR', 'CAN', 'AUS', 'NZL']

const isFVEY = db.isFVEY(['USA', 'GBR', 'CAN', 'AUS', 'NZL']);
console.log(isFVEY);  // true
```

## API Documentation

### ClassificationEncoder

#### `encode(classificationString)`
Encode a classification string to a 32-bit integer.

```javascript
const mask = encoder.encode('SECRET//NOFORN');
// Returns: 1073741952 (0x40000080)
```

#### `decode(classificationMask)`
Decode a 32-bit integer to a classification string.

```javascript
const classification = encoder.decode(0x40000080);
// Returns: 'SECRET//NOFORN'
```

#### `compare(classification1, classification2)`
Compare two classification strings.

```javascript
const result = encoder.compare('SECRET//NOFORN', 'TOP SECRET//NOFORN');
// Returns: 1 (second is more restrictive)
```

### BitmaskManager

#### `setBit(bit)`
Set a specific bit in the mask.

```javascript
const bm = new BitmaskManager();
bm.setBit(0x40000000);  // Set SECRET bit
```

#### `isBitSet(bit)`
Check if a specific bit is set.

```javascript
const isSet = bm.isBitSet(0x40000000);
// Returns: true
```

#### `setNamedBit(name)`
Set a named bit.

```javascript
bm.setNamedBit('SECRET');
bm.setNamedBit('NOFORN');
```

#### Nibble Extraction (Rightmost = First, Leftmost = Eighth)

```javascript
const bm = new BitmaskManager(0x87654321);

// First Nibble (bits 0-3, rightmost/least significant)
bm.getFirstNibble();   // 0x1

// Second Nibble (bits 4-7)
bm.getSecondNibble();  // 0x2

// ... through ...

// Eighth Nibble (bits 28-31, leftmost/most significant)
bm.getEighthNibble();  // 0x8
```

#### Byte Extraction (Rightmost = First, Leftmost = Fourth)

```javascript
const bm = new BitmaskManager(0x12345678);

// First Byte (bits 0-7, rightmost)
bm.getFirstByte();   // 0x78

// Second Byte (bits 8-15)
bm.getSecondByte();  // 0x56

// Third Byte (bits 16-23)
bm.getThirdByte();   // 0x34

// Fourth Byte (bits 24-31, leftmost)
bm.getFourthByte();  // 0x12
```

### CountryDatabase

#### `getAlpha3ForAlpha2(alpha2)`
Convert alpha-2 country code to alpha-3.

```javascript
const alpha3 = db.getAlpha3ForAlpha2('US');
// Returns: 'USA'
```

#### `parseAndValidateRelto(reltoString)`
Parse and validate a RELTO string.

```javascript
const countries = db.parseAndValidateRelto('REL TO USA, GBR, CAN');
// Returns: ['USA', 'GBR', 'CAN']
```

#### `isFVEY(countries)`
Check if countries represent Five Eyes alliance.

```javascript
const isFVEY = db.isFVEY(['USA', 'GBR', 'CAN', 'AUS', 'NZL']);
// Returns: true
```

## Classification Format

The classification string format follows the standard US government classification marking format:

```
CLASSIFICATION // [SAP] // [SCI] // [DISTRIBUTION]
```

Examples:
- `UNCLASSIFIED`
- `SECRET//NOFORN`
- `TOP SECRET//SCI//SI-GAMMA//TK//NOFORN`
- `SECRET//REL TO FVEY`

### Classification Levels
- `UNCLASSIFIED`
- `CONFIDENTIAL`
- `SECRET`
- `TOP SECRET`

### Special Markings
- `CUI` - Controlled Unclassified Information
- `SBU` - Sensitive But Unclassified
- `FOUO` - For Official Use Only

### SCI Compartments
- `SCI` - Sensitive Compartmented Information
- `SI` - Special Intelligence
- `TK` - TALENT KEYHOLE
- `HCS` - HUMINT Control System

### SCI Codewords
- `SI-GAMMA` - Special Intelligence GAMMA
- `SI-GROUPA` - Special Intelligence Group A
- `SI-GROUPB` - Special Intelligence Group B
- `SI-GROUPC` - Special Intelligence Group C

### Distribution Controls
- `NOFORN` - Not Releasable to Foreign Nationals
- `REL TO FVEY` - Release to Five Eyes
- `REL TO NATO` - Release to NATO
- `REL TO 9EYES` - Release to Nine Eyes
- `REL TO 14EYES` - Release to Fourteen Eyes

## Bit Layout

The 32-bit integer is organized as follows (rightmost = First/Least Significant):

```
Eighth Nibble  (bits 31-28): Classification Level
                             UNCLASSIFIED (0x10000000)
                             CONFIDENTIAL (0x20000000)
                             SECRET (0x40000000)
                             TOP SECRET (0x80000000)

Seventh Nibble (bits 27-24): SAP Programs
                             SAP_A (0x02000000)
                             SAP_B (0x04000000)
                             SAP_C (0x08000000)

Sixth Nibble   (bits 23-20): SCI Containers
                             GAMMA (0x00100000)
                             SI_GROUPA (0x00200000)
                             SI_GROUPB (0x00400000)
                             SI_GROUPC (0x00800000)

Fifth Nibble   (bits 19-16): SCI Compartments
                             HCS (0x00010000)
                             SI (0x00040000)
                             TK (0x00080000)

Fourth Nibble  (bits 15-12): Special Markings
                             SBU (0x00001000)
                             CUI (0x00002000)
                             FOUO (0x00004000)
                             PROTECTED (0x00008000)

Third Nibble   (bits 11-8):  RELIDO
                             RELIDO (0x00000100)

Second Nibble  (bits 7-4):   Distribution Controls (High)
                             NOFORN (0x00000080)
                             RELTO_NATO (0x00000040)
                             RELTO_FVEY (0x00000020)
                             RELTO_A (0x00000010)

First Nibble   (bits 3-0):   Distribution Controls (Low)
                             RELTO_B (0x00000008)
                             RELTO_C (0x00000004)
                             RELTO_FOURTEENEYES (0x00000002)
                             RELTO_NINEEYES (0x00000001)
```

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with verbose output:

```bash
npm run test:verbose
```

### Test Coverage

The project includes comprehensive tests for all components:

- **NamedBits.test.js** - 20+ tests for bit definitions
- **BitmaskManager.test.js** - 25+ tests for bitmask operations
- **CountryDatabase.test.js** - 30+ tests for country code handling
- **ClassificationEncoder.test.js** - 40+ tests for encoding/decoding

Total: **115+ tests** covering all functionality

## Development

### Linting

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

### Build

```bash
npm run build
```

This runs linting and tests to ensure code quality.

## Project Structure

```
classification-encoder-javascript/
├── src/
│   ├── index.js                    # Main entry point
│   ├── index.d.ts                  # TypeScript definitions
│   ├── NamedBits.js                # Bit definitions
│   ├── BitmaskManager.js           # Bitmask operations
│   ├── CountryDatabase.js          # Country code database
│   └── ClassificationEncoder.js    # Main encoder/decoder
├── tests/
│   ├── NamedBits.test.js
│   ├── BitmaskManager.test.js
│   ├── CountryDatabase.test.js
│   └── ClassificationEncoder.test.js
├── package.json                    # NPM configuration
├── jest.config.js                  # Jest configuration
├── .eslintrc.json                  # ESLint configuration
├── .gitignore
└── README.md                        # This file
```

## TDD Approach

This project was developed using Test-Driven Development (TDD):

1. **RED** - Write failing tests first
2. **GREEN** - Implement minimal code to pass tests
3. **REFACTOR** - Improve code while keeping tests green

All tests were written before implementation, ensuring:
- ✅ Complete test coverage
- ✅ Clear API design
- ✅ Confidence in refactoring
- ✅ Living documentation

## Comparison with Python Version

This JavaScript implementation is functionally equivalent to the Python version with the following differences:

- JavaScript uses `Number` (64-bit float) for integers, but operations use bitwise operators which work with 32-bit integers
- No external dependencies required
- Full TypeScript support included
- Jest for testing instead of pytest

## License

GPL-3.0

## Contributing

Contributions are welcome! Please ensure:
- All tests pass
- New features include tests
- Code follows ESLint rules
- Tests are written before implementation (TDD)

---

**UNCLASSIFIED** - Classification markings are for code purposes only.
