/**
 * TDD Tests for BitmaskManager
 * Tests for bitmask operations
 * 
 * Nibble Layout (rightmost = First, leftmost = Eighth):
 * Eighth (31-28) | Seventh (27-24) | Sixth (23-20) | Fifth (19-16) |
 * Fourth (15-12) | Third (11-8) | Second (7-4) | First (3-0)
 */

const BitmaskManager = require('../src/BitmaskManager');
const NamedBits = require('../src/NamedBits');

describe('BitmaskManager', () => {
  let bitmask;

  beforeEach(() => {
    bitmask = new BitmaskManager();
  });

  describe('Initialization', () => {
    test('should initialize with zero', () => {
      expect(bitmask.getBitmask()).toBe(0);
    });

    test('should initialize with provided value', () => {
      const bm = new BitmaskManager(0x40000080);
      expect(bm.getBitmask()).toBe(0x40000080);
    });
  });

  describe('Basic Operations', () => {
    test('should set bitmask', () => {
      bitmask.setBitmask(0x40000080);
      expect(bitmask.getBitmask()).toBe(0x40000080);
    });

    test('should reset bitmask to zero', () => {
      bitmask.setBitmask(0x40000080);
      bitmask.reset();
      expect(bitmask.getBitmask()).toBe(0);
    });
  });

  describe('Bit Operations', () => {
    test('should set a single bit', () => {
      bitmask.setBit(0x40000000);
      expect(bitmask.getBitmask()).toBe(0x40000000);
    });

    test('should set multiple bits', () => {
      bitmask.setBit(0x40000000);
      bitmask.setBit(0x00000080);
      expect(bitmask.getBitmask()).toBe(0x40000080);
    });

    test('should clear a bit', () => {
      bitmask.setBitmask(0x40000080);
      bitmask.clearBit(0x00000080);
      expect(bitmask.getBitmask()).toBe(0x40000000);
    });

    test('should check if bit is set', () => {
      bitmask.setBit(0x40000000);
      expect(bitmask.isBitSet(0x40000000)).toBe(true);
      expect(bitmask.isBitSet(0x00000080)).toBe(false);
    });
  });

  describe('NamedBits Operations', () => {
    test('should set named bit', () => {
      bitmask.setNamedBit('SECRET');
      expect(bitmask.isBitSet(NamedBits.SECRET)).toBe(true);
    });

    test('should clear named bit', () => {
      bitmask.setNamedBit('SECRET');
      bitmask.clearNamedBit('SECRET');
      expect(bitmask.isBitSet(NamedBits.SECRET)).toBe(false);
    });

    test('should throw on invalid named bit', () => {
      expect(() => bitmask.setNamedBit('INVALID')).toThrow();
    });
  });

  describe('Multiple Bit Checking', () => {
    test('should check if any bit is set', () => {
      bitmask.setBit(0x40000000);
      expect(bitmask.anySet([0x40000000, 0x00000080])).toBe(true);
      expect(bitmask.anySet([0x00000080, 0x00000001])).toBe(false);
    });

    test('should check if any SCI bit is set', () => {
      bitmask.setNamedBit('SI');
      expect(bitmask.anySCISet()).toBe(true);
      
      const bm2 = new BitmaskManager();
      expect(bm2.anySCISet()).toBe(false);
    });

    test('should check if any SI group is set', () => {
      bitmask.setNamedBit('SI_GROUPA');
      expect(bitmask.anySIGroup()).toBe(true);
      
      const bm2 = new BitmaskManager();
      expect(bm2.anySIGroup()).toBe(false);
    });

    test('should check if any RELTO is set', () => {
      bitmask.setNamedBit('RELTO_FVEY');
      expect(bitmask.anyRelto()).toBe(true);
      
      const bm2 = new BitmaskManager();
      expect(bm2.anyRelto()).toBe(false);
    });
  });

  describe('Nibble Extraction (Rightmost = First, Leftmost = Eighth)', () => {
    test('should extract first nibble (bits 0-3, rightmost/least significant)', () => {
      bitmask.setBitmask(0x00000005);
      expect(bitmask.getFirstNibble()).toBe(0x5);
    });

    test('should extract second nibble (bits 4-7)', () => {
      bitmask.setBitmask(0x00000050);
      expect(bitmask.getSecondNibble()).toBe(0x5);
    });

    test('should extract third nibble (bits 8-11)', () => {
      bitmask.setBitmask(0x00000500);
      expect(bitmask.getThirdNibble()).toBe(0x5);
    });

    test('should extract fourth nibble (bits 12-15)', () => {
      bitmask.setBitmask(0x00005000);
      expect(bitmask.getFourthNibble()).toBe(0x5);
    });

    test('should extract fifth nibble (bits 16-19)', () => {
      bitmask.setBitmask(0x00050000);
      expect(bitmask.getFifthNibble()).toBe(0x5);
    });

    test('should extract sixth nibble (bits 20-23)', () => {
      bitmask.setBitmask(0x00500000);
      expect(bitmask.getSixthNibble()).toBe(0x5);
    });

    test('should extract seventh nibble (bits 24-27)', () => {
      bitmask.setBitmask(0x05000000);
      expect(bitmask.getSeventhNibble()).toBe(0x5);
    });

    test('should extract eighth nibble (bits 28-31, leftmost/most significant)', () => {
      bitmask.setBitmask(0x80000000);
      expect(bitmask.getEighthNibble()).toBe(0x8);
    });

    test('should extract all nibbles from complex mask', () => {
      bitmask.setBitmask(0x87654321);
      expect(bitmask.getEighthNibble()).toBe(0x8);
      expect(bitmask.getSeventhNibble()).toBe(0x7);
      expect(bitmask.getSixthNibble()).toBe(0x6);
      expect(bitmask.getFifthNibble()).toBe(0x5);
      expect(bitmask.getFourthNibble()).toBe(0x4);
      expect(bitmask.getThirdNibble()).toBe(0x3);
      expect(bitmask.getSecondNibble()).toBe(0x2);
      expect(bitmask.getFirstNibble()).toBe(0x1);
    });
  });

  describe('Byte Extraction (Rightmost = First, Leftmost = Fourth)', () => {
    test('should extract first byte (bits 0-7, rightmost)', () => {
      bitmask.setBitmask(0x00000080);
      expect(bitmask.getFirstByte()).toBe(0x80);
    });

    test('should extract second byte (bits 8-15)', () => {
      bitmask.setBitmask(0x00100000);
      expect(bitmask.getSecondByte()).toBe(0x10);
    });

    test('should extract third byte (bits 16-23)', () => {
      bitmask.setBitmask(0x00100000);
      expect(bitmask.getThirdByte()).toBe(0x10);
    });

    test('should extract fourth byte (bits 24-31, leftmost)', () => {
      bitmask.setBitmask(0x40000000);
      expect(bitmask.getFourthByte()).toBe(0x40);
    });

    test('should extract all bytes from complex mask', () => {
      bitmask.setBitmask(0x12345678);
      expect(bitmask.getFourthByte()).toBe(0x12);
      expect(bitmask.getThirdByte()).toBe(0x34);
      expect(bitmask.getSecondByte()).toBe(0x56);
      expect(bitmask.getFirstByte()).toBe(0x78);
    });
  });

  describe('String Representation', () => {
    test('should convert to hex string', () => {
      bitmask.setBitmask(0x40000080);
      expect(bitmask.toString()).toBe('0x40000080');
    });

    test('should handle zero', () => {
      expect(bitmask.toString()).toBe('0x00000000');
    });

    test('should pad with leading zeros', () => {
      bitmask.setBitmask(0x00000001);
      expect(bitmask.toString()).toBe('0x00000001');
    });

    test('should use uppercase hex', () => {
      bitmask.setBitmask(0xABCDEF00);
      expect(bitmask.toString()).toBe('0xABCDEF00');
    });
  });
});
