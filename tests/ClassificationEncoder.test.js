/**
 * TDD Tests for ClassificationEncoder
 * Tests for encoding and decoding classification strings
 */

const ClassificationEncoder = require('../src/ClassificationEncoder');
const NamedBits = require('../src/NamedBits');

describe('ClassificationEncoder', () => {
  let encoder;
  let customEncoder;

  beforeEach(() => {
    encoder = new ClassificationEncoder();
    const config = {
        'sap-a': 'ALPHA',
        'si-groupa': 'CODEWORDONE',
        'si-groupb': 'CODEWORDTWO',
        'si-groupc': 'CODEWORDTHREE'
      };
    customEncoder = new ClassificationEncoder(config);
  });

  describe('Initialization', () => {
    test('should initialize with default config', () => {
      expect(encoder).toBeDefined();
    });

    test('should initialize with custom config', () => {
      const config = {
        'sap-a': 'ALPHA',
        'si-groupa': 'CODEWORDONE',
        'si-groupb': 'CODEWORDTWO',
        'si-groupc': 'CODEWORDTHREE'
      };
      const customEncoder = new ClassificationEncoder(config);
      expect(customEncoder).toBeDefined();
    });
  });

  describe('Classification Levels', () => {
    test('should encode UNCLASSIFIED', () => {
      const mask = encoder.encode('UNCLASSIFIED');
      expect(mask).toBe(0x10000000);
    });

    test('should encode CONFIDENTIAL', () => {
      const mask = encoder.encode('CONFIDENTIAL');
      expect(mask).toBe(0x20000000);
    });

    test('should encode SECRET', () => {
      const mask = encoder.encode('SECRET');
      expect(mask).toBe(0x40000000);
    });

    test('should encode TOP SECRET', () => {
      const mask = encoder.encode('TOP SECRET');
      expect(mask).toBe(0x80000000);
    });

    test('should handle case-insensitive input', () => {
      expect(encoder.encode('secret')).toBe(0x40000000);
      expect(encoder.encode('Secret')).toBe(0x40000000);
      expect(encoder.encode('SECRET')).toBe(0x40000000);
    });
  });

  describe('Special Markings', () => {
    test('should encode CUI', () => {
      const mask = encoder.encode('UNCLASSIFIED//CUI');
      expect((mask & NamedBits.CUI) !== 0).toBe(true);
      expect((mask & NamedBits.UNCLASSIFIED) !== 0).toBe(true);
    });

    test('should encode SBU', () => {
      const mask = encoder.encode('UNCLASSIFIED//SBU');
      expect((mask & NamedBits.SBU) !== 0).toBe(true);
    });

    test('should encode HCS-O', () => {
      const mask = encoder.encode('UNCLASSIFIED//HCS-O');
      expect((mask & NamedBits.HCS_O) !== 0).toBe(true);
    });

    test('should encode HCS-P', () => {
      const mask = encoder.encode('UNCLASSIFIED//HCS-P');
      expect((mask & NamedBits.HCS_P) !== 0).toBe(true);
    });
  });

  describe('Distribution Controls', () => {
    test('should encode NOFORN', () => {
      const mask = encoder.encode('SECRET//NOFORN');
      expect(mask).toBe(0x40000080);
    });

    test('should encode REL TO FVEY', () => {
      const mask = encoder.encode('SECRET//REL TO FVEY');
      expect((mask & NamedBits.RELTO_FVEY) !== 0).toBe(true);
    });

    test('should encode REL TO NATO', () => {
      const mask = encoder.encode('SECRET//REL TO NATO');
      expect((mask & NamedBits.RELTO_NATO) !== 0).toBe(true);
    });

    test('should encode REL TO 9EYES', () => {
      const mask = encoder.encode('SECRET//REL TO 9EYES');
      expect((mask & NamedBits.RELTO_NINEEYES) !== 0).toBe(true);
    });

    test('should encode REL TO 14EYES', () => {
      const mask = encoder.encode('SECRET//REL TO 14EYES');
      expect((mask & NamedBits.RELTO_FOURTEENEYES) !== 0).toBe(true);
    });
  });

  describe('SCI Compartments', () => {
    test('should encode SCI', () => {
      const mask = encoder.encode('SECRET//SCI//NOFORN');
      expect((mask & NamedBits.SECRET) !== 0).toBe(true);
      expect((mask & NamedBits.SCI) !== 0).toBe(true);
      export((mask & NamedBits.NOFORN) !== 0).toBe(true);
    });

    test('should encode SI', () => {
      const mask = encoder.encode('SECRET//SCI//SI//NOFORN');
      expect((mask & NamedBits.SI) !== 0).toBe(true);
      expect((mask & NamedBits.SCI) !== 0).toBe(true);
    });

    test('should encode TK', () => {
      const mask = encoder.encode('SECRET//SCI//TK//NOFORN');
      expect((mask & NamedBits.TK) !== 0).toBe(true);
    });

    test('should encode HCS', () => {
      const mask = encoder.encode('SECRET//SCI//HCS//NOFORN');
      expect((mask & NamedBits.HCS) !== 0).toBe(true);
    });

    test('should encode multiple compartments', () => {
      const mask = encoder.encode('SECRET//SCI//SI/TK//NOFORN');
      expect((mask & NamedBits.SI) !== 0).toBe(true);
      expect((mask & NamedBits.TK) !== 0).toBe(true);
    });
  });

  describe('SCI Codewords', () => {
    test('should encode SI-GAMMA', () => {
      const mask = encoder.encode('SECRET//SCI//SI-GAMMA//NOFORN');
      expect((mask & NamedBits.GAMMA) !== 0).toBe(true);
    });

    test('should encode SI-CODEWORDONE', () => {
      const mask = customEncoder.encode('SECRET//SCI//SI-CODEWORDONE//NOFORN');
      expect((mask & NamedBits.SI_GROUPA) !== 0).toBe(true);
    });

    test('should encode SI-CODEWORDTWO', () => {
      const mask = customEncoder.encode('SECRET//SCI//SI-CODEWORDTWO//NOFORN');
      expect((mask & NamedBits.SI_GROUPB) !== 0).toBe(true);
    });

    test('should encode SI-CODEWORDTHREE', () => {
      const mask = customEncoder.encode('SECRET//SCI//SI-CODEWORDTHREE//NOFORN');
      expect((mask & NamedBits.SI_GROUPC) !== 0).toBe(true);
    });

    test('should encode multiple codewords', () => {
      const mask = customEncoder.encode('SECRET//SCI//SI-GAMMA-CODEWORDONE//NOFORN');
      expect((mask & NamedBits.GAMMA) !== 0).toBe(true);
      expect((mask & NamedBits.SI_GROUPA) !== 0).toBe(true);
    });
  });

  describe('Decoding', () => {
    test('should decode UNCLASSIFIED', () => {
      const result = encoder.decode(0x10000000);
      expect(result).toBe('UNCLASSIFIED');
    });

    test('should decode SECRET', () => {
      const result = encoder.decode(0x40000000);
      expect(result).toBe('SECRET');
    });

    test('should decode SECRET//NOFORN', () => {
      const result = encoder.decode(0x40000080);
      expect(result).toBe('SECRET//NOFORN');
    });

    test('should decode TOP SECRET//SCI//NOFORN', () => {
      const result = encoder.decode(0x81000080);
      expect(result).toBe('TOP SECRET//SCI//NOFORN');
    });
  });

  describe('Round-trip Encoding', () => {
    test('should encode and decode consistently', () => {
      const classifications = [
        'UNCLASSIFIED',
        'SECRET',
        'SECRET//NOFORN',
        'TOP SECRET//SCI//NOFORN'
      ];

      for (const classification of classifications) {
        const mask = encoder.encode(classification);
        const decoded = encoder.decode(mask);
        const mask2 = encoder.encode(decoded);
        expect(mask2).toBe(mask);
      }
    });
  });

  describe('Error Handling', () => {
    test('should throw on null input', () => {
      expect(() => encoder.encode(null)).toThrow();
    });

    test('should throw on empty string', () => {
      expect(() => encoder.encode('')).toThrow();
    });

    test('should throw on invalid classification', () => {
      expect(() => encoder.encode('INVALID')).toThrow();
    });

    test('should provide helpful error messages', () => {
      try {
        encoder.encode(null);
      } catch (e) {
        expect(e.message).toContain('cannot be null');
      }
    });
  });

  describe('Complex Classifications', () => {
    test('should encode complex classification', () => {
      const mask = encoder.encode('TOP SECRET//SCI//SI-GAMMA/TK//NOFORN');
      expect((mask & NamedBits.TOPSECRET) !== 0).toBe(true);
      expect((mask & NamedBits.SCI) !== 0).toBe(true);
      expect((mask & NamedBits.GAMMA) !== 0).toBe(true);
      expect((mask & NamedBits.TK) !== 0).toBe(true);
      expect((mask & NamedBits.NOFORN) !== 0).toBe(true);
    });

    test('should handle whitespace variations', () => {
      const mask1 = encoder.encode('SECRET//NOFORN');
      const mask2 = encoder.encode('SECRET // NOFORN');
      const mask3 = encoder.encode('SECRET  //  NOFORN');
      expect(mask2).toBe(mask1);
      expect(mask3).toBe(mask1);
    });
  });
});
