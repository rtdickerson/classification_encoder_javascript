/**
 * Manages 32-bit integer bitmasks for classification operations.
 * Provides methods to set, clear, and check individual bits.
 * 
 * Bit Layout (32-bit integer):
 * Bits 31-28: Eighth Nibble (Classification Level)
 * Bits 27-24: Seventh Nibble (SAP Programs)
 * Bits 23-20: Sixth Nibble (SCI Containers)
 * Bits 19-16: Fifth Nibble (SCI Compartments)
 * Bits 15-12: Fourth Nibble (Special Markings)
 * Bits 11-8:  Third Nibble (RELIDO)
 * Bits 7-4:   Second Nibble (Distribution Controls High)
 * Bits 3-0:   First Nibble (Distribution Controls Low)
 * 
 * Note: First Nibble = Rightmost (Least Significant)
 *       Eighth Nibble = Leftmost (Most Significant)
 */

const NamedBits = require('./NamedBits');

class BitmaskManager {
  /**
   * Create a new BitmaskManager.
   * @param {number} initialMask - Initial bitmask value (default: 0)
   */
  constructor(initialMask = 0) {
    this.mask = initialMask >>> 0; // Ensure unsigned 32-bit
  }

  /**
   * Get the current bitmask value.
   * @returns {number} The bitmask
   */
  getBitmask() {
    return this.mask;
  }

  /**
   * Set the bitmask value.
   * @param {number} value - The new bitmask value
   */
  setBitmask(value) {
    this.mask = value >>> 0; // Ensure unsigned 32-bit
  }

  /**
   * Reset the bitmask to zero.
   */
  reset() {
    this.mask = 0;
  }

  /**
   * Set a specific bit.
   * @param {number} bit - The bit value to set
   */
  setBit(bit) {
    this.mask = (this.mask | bit) >>> 0;
  }

  /**
   * Clear a specific bit.
   * @param {number} bit - The bit value to clear
   */
  clearBit(bit) {
    this.mask = (this.mask & ~bit) >>> 0;
  }

  /**
   * Check if a specific bit is set.
   * @param {number} bit - The bit value to check
   * @returns {boolean} True if the bit is set
   */
  isBitSet(bit) {
    return (this.mask & bit) !== 0;
  }

  /**
   * Set a named bit.
   * @param {string} name - The bit name
   * @throws {Error} If the bit name is invalid
   */
  setNamedBit(name) {
    const bit = NamedBits.getValue(name);
    if (bit === null) {
      throw new Error(`Invalid bit name: ${name}`);
    }
    this.setBit(bit);
  }

  /**
   * Clear a named bit.
   * @param {string} name - The bit name
   * @throws {Error} If the bit name is invalid
   */
  clearNamedBit(name) {
    const bit = NamedBits.getValue(name);
    if (bit === null) {
      throw new Error(`Invalid bit name: ${name}`);
    }
    this.clearBit(bit);
  }

  /**
   * Check if any of the provided bits are set.
   * @param {number[]} bits - Array of bit values
   * @returns {boolean} True if any bit is set
   */
  anySet(bits) {
    return bits.some(bit => this.isBitSet(bit));
  }

  /**
   * Check if any SCI bit is set.
   * @returns {boolean} True if any SCI bit is set
   */
  anySCISet() {
    return this.anySet([
      NamedBits.SCI,
      NamedBits.SI,
      NamedBits.TK,
      NamedBits.HCS
    ]);
  }

  /**
   * Check if any SI group is set.
   * @returns {boolean} True if any SI group is set
   */
  anySIGroup() {
    return this.anySet([
      NamedBits.SI_GROUPA,
      NamedBits.SI_GROUPB,
      NamedBits.SI_GROUPC,
      NamedBits.GAMMA
    ]);
  }

  /**
   * Check if any RELTO bit is set.
   * @returns {boolean} True if any RELTO bit is set
   */
  anyRelto() {
    return this.anySet([
      NamedBits.RELTO_NINEEYES,
      NamedBits.RELTO_FOURTEENEYES,
      NamedBits.RELTO_C,
      NamedBits.RELTO_B,
      NamedBits.RELTO_A,
      NamedBits.RELTO_FVEY,
      NamedBits.RELTO_NATO,
      NamedBits.NOFORN
    ]);
  }

  /**
   * Extract the first nibble (bits 0-3, rightmost/least significant).
   * @returns {number} The first nibble
   */
  getFirstNibble() {
    return this.mask & 0xF;
  }

  /**
   * Extract the second nibble (bits 4-7).
   * @returns {number} The second nibble
   */
  getSecondNibble() {
    return (this.mask >>> 4) & 0xF;
  }

  /**
   * Extract the third nibble (bits 8-11).
   * @returns {number} The third nibble
   */
  getThirdNibble() {
    return (this.mask >>> 8) & 0xF;
  }

  /**
   * Extract the fourth nibble (bits 12-15).
   * @returns {number} The fourth nibble
   */
  getFourthNibble() {
    return (this.mask >>> 12) & 0xF;
  }

  /**
   * Extract the fifth nibble (bits 16-19).
   * @returns {number} The fifth nibble
   */
  getFifthNibble() {
    return (this.mask >>> 16) & 0xF;
  }

  /**
   * Extract the sixth nibble (bits 20-23).
   * @returns {number} The sixth nibble
   */
  getSixthNibble() {
    return (this.mask >>> 20) & 0xF;
  }

  /**
   * Extract the seventh nibble (bits 24-27).
   * @returns {number} The seventh nibble
   */
  getSeventhNibble() {
    return (this.mask >>> 24) & 0xF;
  }

  /**
   * Extract the eighth nibble (bits 28-31, leftmost/most significant).
   * @returns {number} The eighth nibble
   */
  getEighthNibble() {
    return (this.mask >>> 28) & 0xF;
  }

  /**
   * Extract the first byte (bits 0-7, rightmost).
   * @returns {number} The first byte
   */
  getFirstByte() {
    return this.mask & 0xFF;
  }

  /**
   * Extract the second byte (bits 8-15).
   * @returns {number} The second byte
   */
  getSecondByte() {
    return (this.mask >>> 8) & 0xFF;
  }

  /**
   * Extract the third byte (bits 16-23).
   * @returns {number} The third byte
   */
  getThirdByte() {
    return (this.mask >>> 16) & 0xFF;
  }

  /**
   * Extract the fourth byte (bits 24-31, leftmost).
   * @returns {number} The fourth byte
   */
  getFourthByte() {
    return (this.mask >>> 24) & 0xFF;
  }

  /**
   * Convert the bitmask to a hex string.
   * @returns {string} Hex representation (e.g., "0x40000080")
   */
  toString() {
    return `0x${this.mask.toString(16).padStart(8, '0').toUpperCase()}`;
  }
}

module.exports = BitmaskManager;
