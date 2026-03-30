/**
 * Named constants for each bit in the classification bitmask.
 * 
 * Bit Layout (32-bit integer, rightmost = First/Least Significant):
 * 
 * Eighth Nibble (31-28): Classification Level
 *   - UNCLASSIFIED (0x10000000)
 *   - CONFIDENTIAL (0x20000000)
 *   - SECRET (0x40000000)
 *   - TOP SECRET (0x80000000)
 * 
 * Seventh Nibble (27-24): SAP Programs
 *   - SAP_A (0x02000000)
 *   - SAP_B (0x04000000)
 *   - SAP_C (0x08000000)
 * 
 * Sixth Nibble (23-20): SCI Containers
 *   - GAMMA (0x00100000)
 *   - SI_GROUPA (0x00200000)
 *   - SI_GROUPB (0x00400000)
 *   - SI_GROUPC (0x00800000)
 * 
 * Fifth Nibble (19-16): SCI Compartments
 *   - HCS (0x00010000)
 *   - SI (0x00040000)
 *   - TK (0x00080000)
 * 
 * Fourth Nibble (15-12): Special Markings
 *   - SBU (0x00001000)
 *   - CUI (0x00002000)
 * 
 * Third Nibble (11-8): RELIDO
 *   - RELIDO (0x00000100)
 * 
 * Second Nibble (7-4): Distribution Controls (High)
 *   - NOFORN (0x00000080)
 *   - RELTO_NATO (0x00000040)
 *   - RELTO_FVEY (0x00000020)
 *   - RELTO_A (0x00000010)
 * 
 * First Nibble (3-0): Distribution Controls (Low)
 *   - RELTO_B (0x00000008)
 *   - RELTO_C (0x00000004)
 *   - RELTO_FOURTEENEYES (0x00000002)
 *   - RELTO_NINEEYES (0x00000001)
 * 
 * Note: SCI bit (0x01000000) indicates presence of SCI compartments
 */

const NamedBits = {
  // Distribution Controls - First Nibble (bits 0-3, rightmost/least significant)
  RELTO_NINEEYES: 0x00000001,
  RELTO_FOURTEENEYES: 0x00000002,
  RELTO_C: 0x00000004,
  RELTO_B: 0x00000008,

  // Distribution Controls - Second Nibble (bits 4-7)
  RELTO_A: 0x00000010,
  RELTO_FVEY: 0x00000020,
  RELTO_NATO: 0x00000040,
  NOFORN: 0x00000080,

  // RELIDO - Third Nibble (bits 8-11)
  RELIDO: 0x00000100,

  // Special Markings - Fourth Nibble (bits 12-15)
  SBU: 0x00001000,
  CUI: 0x00002000,
  HCS_P : 0x00004000, // Special Marking for HCS-P
  HCS_O : 0x00008000, // Special Marking for HCS-O

  // SCI Compartments - Fifth Nibble (bits 16-19)
  HCS: 0x00010000,
  SI: 0x00040000,
  TK: 0x00080000,

  // SCI Containers - Sixth Nibble (bits 20-23)
  GAMMA: 0x00100000,
  SI_GROUPA: 0x00200000,
  SI_GROUPB: 0x00400000,
  SI_GROUPC: 0x00800000,

  // SCI and SAP - Seventh Nibble (bits 24-27)
  SCI: 0x01000000,
  SAP_A: 0x02000000,
  SAP_B: 0x04000000,
  SAP_C: 0x08000000,

  // Classification Levels - Eighth Nibble (bits 28-31, leftmost/most significant)
  UNCLASSIFIED: 0x10000000,
  CONFIDENTIAL: 0x20000000,
  SECRET: 0x40000000,
  TOPSECRET: 0x80000000,

  /**
   * Get the integer value of a named bit.
   * @param {string} name - The bit name
   * @returns {number|null} The bit value, or null if not found
   */
  getValue(name) {
    return this[name] || null;
  },

  /**
   * Get the name of a bit by its value.
   * @param {number} value - The bit value
   * @returns {string|null} The bit name, or null if not found
   */
  getName(value) {
    for (const [key, val] of Object.entries(this)) {
      if (typeof val === 'number' && val === value) {
        return key;
      }
    }
    return null;
  },

  /**
   * Get all bit names.
   * @returns {string[]} Array of all bit names
   */
  getAllBits() {
    return Object.keys(this).filter(key => typeof this[key] === 'number');
  }
};

module.exports = NamedBits;
