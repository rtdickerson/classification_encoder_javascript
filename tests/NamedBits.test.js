/**
 * TDD Tests for NamedBits
 * Tests for bit definitions and enum functionality
 */

const NamedBits = require('../src/NamedBits');

describe('NamedBits', () => {
  describe('Distribution Controls', () => {
    test('should have RELTO_NINEEYES bit', () => {
      expect(NamedBits.RELTO_NINEEYES).toBe(0x00000001);
    });

    test('should have RELTO_FOURTEENEYES bit', () => {
      expect(NamedBits.RELTO_FOURTEENEYES).toBe(0x00000002);
    });

    test('should have RELTO_C bit', () => {
      expect(NamedBits.RELTO_C).toBe(0x00000004);
    });

    test('should have RELTO_B bit', () => {
      expect(NamedBits.RELTO_B).toBe(0x00000008);
    });

    test('should have RELTO_A bit', () => {
      expect(NamedBits.RELTO_A).toBe(0x00000010);
    });

    test('should have RELTO_FVEY bit', () => {
      expect(NamedBits.RELTO_FVEY).toBe(0x00000020);
    });

    test('should have RELTO_NATO bit', () => {
      expect(NamedBits.RELTO_NATO).toBe(0x00000040);
    });

    test('should have NOFORN bit', () => {
      expect(NamedBits.NOFORN).toBe(0x00000080);
    });
  });

  describe('RELIDO', () => {
    test('should have RELIDO bit', () => {
      expect(NamedBits.RELIDO).toBe(0x00000100);
    });
  });

  describe('Special Markings', () => {
    test('should have SBU bit', () => {
      expect(NamedBits.SBU).toBe(0x00001000);
    });

    test('should have CUI bit', () => {
      expect(NamedBits.CUI).toBe(0x00002000);
    });

    test('should have HCS_O bit', () => {
      expect(NamedBits.HCS_O).toBe(0x00008000);
    });

    test('should have HCS_P bit', () => {
      expect(NamedBits.HCS_P).toBe(0x00004000);
    });
  });

  describe('SCI Compartments', () => {
    test('should have HCS bit', () => {
      expect(NamedBits.HCS).toBe(0x00010000);
    });

    test('should have SI bit', () => {
      expect(NamedBits.SI).toBe(0x00040000);
    });

    test('should have TK bit', () => {
      expect(NamedBits.TK).toBe(0x00080000);
    });
  });

  describe('SCI Containers', () => {
    test('should have GAMMA bit', () => {
      expect(NamedBits.GAMMA).toBe(0x00100000);
    });

    test('should have SI_GROUPA bit', () => {
      expect(NamedBits.SI_GROUPA).toBe(0x00200000);
    });

    test('should have SI_GROUPB bit', () => {
      expect(NamedBits.SI_GROUPB).toBe(0x00400000);
    });

    test('should have SI_GROUPC bit', () => {
      expect(NamedBits.SI_GROUPC).toBe(0x00800000);
    });
  });

  describe('SCI and SAP', () => {
    test('should have SCI bit', () => {
      expect(NamedBits.SCI).toBe(0x01000000);
    });

    test('should have SAP_A bit', () => {
      expect(NamedBits.SAP_A).toBe(0x02000000);
    });

    test('should have SAP_B bit', () => {
      expect(NamedBits.SAP_B).toBe(0x04000000);
    });

    test('should have SAP_C bit', () => {
      expect(NamedBits.SAP_C).toBe(0x08000000);
    });
  });

  describe('Classification Levels', () => {
    test('should have UNCLASSIFIED bit', () => {
      expect(NamedBits.UNCLASSIFIED).toBe(0x10000000);
    });

    test('should have CONFIDENTIAL bit', () => {
      expect(NamedBits.CONFIDENTIAL).toBe(0x20000000);
    });

    test('should have SECRET bit', () => {
      expect(NamedBits.SECRET).toBe(0x40000000);
    });

    test('should have TOPSECRET bit', () => {
      expect(NamedBits.TOPSECRET).toBe(0x80000000);
    });
  });

  describe('Utility Methods', () => {
    test('should get value for a bit', () => {
      expect(NamedBits.getValue('SECRET')).toBe(0x40000000);
    });

    test('should return null for unknown bit', () => {
      expect(NamedBits.getValue('UNKNOWN')).toBeNull();
    });

    test('should get name for a value', () => {
      expect(NamedBits.getName(0x40000000)).toBe('SECRET');
    });

    test('should return null for unknown value', () => {
      expect(NamedBits.getName(0xFFFFFFFF)).toBeNull();
    });

    test('should list all bits', () => {
      const allBits = NamedBits.getAllBits();
      expect(Array.isArray(allBits)).toBe(true);
      expect(allBits.length).toBeGreaterThan(0);
      expect(allBits).toContain('SECRET');
      expect(allBits).toContain('NOFORN');
    });
  });
});
