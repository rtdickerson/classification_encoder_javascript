/**
 * TDD Tests for CountryDatabase
 * Tests for country code handling and intelligence alliances
 */

const CountryDatabase = require('../src/CountryDatabase');

describe('CountryDatabase', () => {
  let db;

  beforeEach(() => {
    db = new CountryDatabase();
  });

  describe('Initialization', () => {
    test('should load country data', () => {
      expect(db.getCountries3().length).toBeGreaterThan(0);
      expect(db.getCountries2().length).toBeGreaterThan(0);
    });

    test('should have same number of alpha-2 and alpha-3 codes', () => {
      expect(db.getCountries2().length).toBe(db.getCountries3().length);
    });
  });

  describe('Country Lists', () => {
    test('should get all alpha-3 codes', () => {
      const codes = db.getCountries3();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes).toContain('USA');
      expect(codes).toContain('GBR');
      expect(codes).toContain('CAN');
    });

    test('should get all alpha-2 codes', () => {
      const codes = db.getCountries2();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes).toContain('US');
      expect(codes).toContain('GB');
      expect(codes).toContain('CA');
    });
  });

  describe('NATO Membership', () => {
    test('should get NATO members', () => {
      const nato = db.getNato();
      expect(Array.isArray(nato)).toBe(true);
      expect(nato).toContain('USA');
      expect(nato).toContain('GBR');
      expect(nato).toContain('FRA');
      expect(nato).toContain('DEU');
    });

    test('should check if countries are NATO', () => {
      const nato = ['USA', 'GBR', 'FRA', 'DEU', 'CAN', 'NOR', 'DNK', 'ISL', 'NLD', 'BEL', 'LUX', 'ITA', 'ESP', 'PRT', 'GRC', 'TUR', 'POL', 'CZE', 'HUN', 'ROU', 'BGR', 'SVK', 'SVN', 'HRV', 'ALB', 'MKD', 'MNE', 'EST', 'LVA', 'LTU', 'SWE', 'FIN', 'CHE'];
      expect(db.isNATO(nato)).toBe(true);
    });
  });

  describe('Five Eyes Membership', () => {
    test('should get Five Eyes members', () => {
      const fvey = db.getFvey();
      expect(Array.isArray(fvey)).toBe(true);
      expect(fvey).toContain('USA');
      expect(fvey).toContain('GBR');
      expect(fvey).toContain('CAN');
      expect(fvey).toContain('AUS');
      expect(fvey).toContain('NZL');
      expect(fvey.length).toBe(5);
    });

    test('should check if countries are Five Eyes', () => {
      const fvey = ['USA', 'GBR', 'CAN', 'AUS', 'NZL'];
      expect(db.isFVEY(fvey)).toBe(true);
    });

    test('should reject non-Five Eyes list', () => {
      const notFvey = ['USA', 'GBR', 'CAN', 'AUS'];
      expect(db.isFVEY(notFvey)).toBe(false);
    });
  });

  describe('Nine Eyes Membership', () => {
    test('should get Nine Eyes members', () => {
      const nineEyes = db.getNineEyes();
      expect(Array.isArray(nineEyes)).toBe(true);
      expect(nineEyes.length).toBe(9);
      expect(nineEyes).toContain('USA');
      expect(nineEyes).toContain('DNK');
      expect(nineEyes).toContain('NOR');
    });

    test('should check if countries are Nine Eyes', () => {
      const nineEyes = ['USA', 'GBR', 'CAN', 'AUS', 'NZL', 'DNK', 'FRA', 'NLD', 'NOR'];
      expect(db.isNineEyes(nineEyes)).toBe(true);
    });
  });

  describe('Fourteen Eyes Membership', () => {
    test('should get Fourteen Eyes members', () => {
      const fourteenEyes = db.getFourteenEyes();
      expect(Array.isArray(fourteenEyes)).toBe(true);
      expect(fourteenEyes.length).toBe(14);
    });

    test('should check if countries are Fourteen Eyes', () => {
      const fourteenEyes = ['USA', 'GBR', 'CAN', 'AUS', 'NZL', 'DNK', 'FRA', 'NLD', 'NOR', 'BEL', 'DEU', 'ITA', 'ESP', 'SWE'];
      expect(db.isFourteenEyes(fourteenEyes)).toBe(true);
    });
  });

  describe('Code Conversion', () => {
    test('should convert alpha-2 to alpha-3', () => {
      expect(db.getAlpha3ForAlpha2('US')).toBe('USA');
      expect(db.getAlpha3ForAlpha2('GB')).toBe('GBR');
      expect(db.getAlpha3ForAlpha2('CA')).toBe('CAN');
    });

    test('should handle case-insensitive conversion', () => {
      expect(db.getAlpha3ForAlpha2('us')).toBe('USA');
      expect(db.getAlpha3ForAlpha2('Us')).toBe('USA');
    });

    test('should return null for invalid code', () => {
      expect(db.getAlpha3ForAlpha2('XX')).toBeNull();
      expect(db.getAlpha3ForAlpha2('INVALID')).toBeNull();
    });

    test('should handle null input', () => {
      expect(db.getAlpha3ForAlpha2(null)).toBeNull();
    });
  });

  describe('RELTO Parsing', () => {
    test('should parse RELTO string with alpha-3 codes', () => {
      const result = db.parseAndValidateRelto('REL TO USA, GBR, CAN');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('USA');
      expect(result).toContain('GBR');
      expect(result).toContain('CAN');
    });

    test('should parse RELTO string with alpha-2 codes', () => {
      const result = db.parseAndValidateRelto('REL TO US, GB, CA');
      expect(result).toContain('USA');
      expect(result).toContain('GBR');
      expect(result).toContain('CAN');
    });

    test('should normalize to alpha-3', () => {
      const result = db.parseAndValidateRelto('REL TO US, GBR, CA');
      expect(result).toContain('USA');
      expect(result).toContain('GBR');
      expect(result).toContain('CAN');
    });

    test('should handle case-insensitive input', () => {
      const result = db.parseAndValidateRelto('rel to us, gb, ca');
      expect(result).toContain('USA');
      expect(result).toContain('GBR');
      expect(result).toContain('CAN');
    });

    test('should discard invalid codes', () => {
      const result = db.parseAndValidateRelto('REL TO USA, INVALID, GBR');
      expect(result).toContain('USA');
      expect(result).toContain('GBR');
      expect(result.length).toBe(2);
    });

    test('should handle empty input', () => {
      expect(db.parseAndValidateRelto('')).toEqual([]);
      expect(db.parseAndValidateRelto(null)).toEqual([]);
    });

    test('should handle without REL TO prefix', () => {
      const result = db.parseAndValidateRelto('USA, GBR, CAN');
      expect(result).toContain('USA');
      expect(result).toContain('GBR');
      expect(result).toContain('CAN');
    });
  });
});
