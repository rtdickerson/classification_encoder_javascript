/**
 * Main encoder/decoder for classification markings.
 * Converts between classification strings and 32-bit integer bitmasks.
 */

const NamedBits = require('./NamedBits');
const BitmaskManager = require('./BitmaskManager');
const CountryDatabase = require('./CountryDatabase');

class ClassificationEncoder {
  /**
   * Create a new ClassificationEncoder.
   * @param {Object} config - Custom configuration (SAP programs, SI groups, RELTO lists)
   */
  constructor(config = null) {
    this.config = config || {};
    this.countryDatabase = new CountryDatabase();
  }

  /**
   * Encode a classification string to a 32-bit integer.
   * @param {string} classificationString - The classification string
   * @returns {number} The encoded bitmask
   * @throws {Error} If the string is invalid
   */
  encode(classificationString) {
    if (!classificationString || typeof classificationString !== 'string') {
      throw new Error('Classification string cannot be null or empty');
    }

    const trimmed = classificationString.trim();
    if (trimmed.length === 0) {
      throw new Error('Classification string cannot be null or empty');
    }

    const bitmask = new BitmaskManager();

    // Split by // to get main parts
    const parts = trimmed.split('//').map(p => p.trim());

    // First part is the classification level
    const levelPart = parts[0].toUpperCase();
    this.encodeClassificationLevel(levelPart, bitmask);

    // Process remaining parts
    for (let i = 1; i < parts.length; i++) {
      this.encodePart(parts[i], bitmask);
    }

    return bitmask.getBitmask();
  }

  /**
   * Encode the classification level.
   * @private
   */
  encodeClassificationLevel(levelPart, bitmask) {
    switch (levelPart) {
    case 'UNCLASSIFIED':
      bitmask.setBit(NamedBits.UNCLASSIFIED);
      break;
    case 'CONFIDENTIAL':
      bitmask.setBit(NamedBits.CONFIDENTIAL);
      break;
    case 'SECRET':
      bitmask.setBit(NamedBits.SECRET);
      break;
    case 'TOP SECRET':
      bitmask.setBit(NamedBits.TOPSECRET);
      break;
    case 'CUI':
      bitmask.setBit(NamedBits.UNCLASSIFIED);
      bitmask.setBit(NamedBits.CUI);
      break;
    default:
      throw new Error(`Invalid classification level: ${levelPart}`);
    }
  }

  /**
   * Encode a part of the classification string.
   * @private
   */
  encodePart(part, bitmask) {
    const upper = part.toUpperCase();

    // Handle SCI compartments (can contain multiple separated by /)
    if (upper.includes('SCI')) {
      this.encodeSCI(upper, bitmask);
      return;
    }

    // Handle SAP programs
    if (upper.startsWith('SAR-') || upper.startsWith('SAP-')) {
      this.encodeSAP(upper, bitmask);
      return;
    }

    // Handle SI groups
    if (upper.startsWith('SI-')) {
      this.encodeSIGroup(upper, bitmask);
      return;
    }

    // Handle RELTO
    if (upper.startsWith('REL TO')) {
      this.encodeRelto(upper, bitmask);
      return;
    }

    // Handle special markings
    switch (upper) {
    case 'NOFORN':
      bitmask.setBit(NamedBits.NOFORN);
      break;
    case 'SBU':
      bitmask.setBit(NamedBits.SBU);
      break;
    case 'CUI':
      bitmask.setBit(NamedBits.CUI);
      break;
    case 'HCS_P':
      bitmask.setBit(NamedBits.HCS_P);
      break;
    case 'HCS_O':
      bitmask.setBit(NamedBits.HCS_O);
      break;
    case 'RELIDO':
      bitmask.setBit(NamedBits.RELIDO);
      break;
    default:
      // Unknown part, skip silently
      break;
    }
  }

  /**
   * Encode SCI compartments.
   * @private
   */
  encodeSCI(sciPart, bitmask) {
    bitmask.setBit(NamedBits.SCI);

    // Extract compartments (SI, TK, HCS, etc.)
    const compartments = sciPart.split('/');

    for (const compartment of compartments) {
      const comp = compartment.trim().toUpperCase();

      if (comp === 'SCI') {
        // Already set
        continue;
      }

      if (comp.startsWith('SI')) {
        bitmask.setBit(NamedBits.SI);
        // Check for codewords
        if (comp.includes('-')) {
          this.encodeSICodewords(comp, bitmask);
        }
      } else if (comp === 'TK') {
        bitmask.setBit(NamedBits.TK);
      } else if (comp === 'HCS') {
        bitmask.setBit(NamedBits.HCS);
      }
    }
  }

  /**
   * Encode SI codewords.
   * @private
   */
  encodeSICodewords(siPart, bitmask) {
    const codewords = siPart.split('-');

    for (const codeword of codewords) {
      const code = codeword.trim().toUpperCase();

      if (code === 'SI' || code === '') {
        continue;
      }

      switch (code) {
      case 'GAMMA':
        bitmask.setBit(NamedBits.GAMMA);
        break;
      default:
        // Custom SI group from config
        if (configKey['si_groupa'] == code) {
          bitmask.setBit(NamedBits.SI_GROUPA);
        } else if (configKey['si_groupb'] == code) {
          bitmask.setBit(NamedBits.SI_GROUPB);
        } else if (configKey['si_groupc'] == code) {
          bitmask.setBit(NamedBits.SI_GROUPC);
        }
        break;
      }
    }
  }

  /**
   * Encode SAP programs.
   * @private
   */
  encodeSAP(sapPart, bitmask) {
    if (configKey['sap_a'] && sapPart === "SAR-" + configKey['sap_a'].toUpperCase()) { 
      bitmask.setBit(NamedBits.SAP_A);
      return;
    } else if (configKey['sap_b'] && sapPart === configKey['sap_b'].toUpperCase()) {
      bitmask.setBit(NamedBits.SAP_B);
      return;
    } else if (configKey['sap_c'] && sapPart === "SAR-" + configKey['sap_c'].toUpperCase()) {
      bitmask.setBit(NamedBits.SAP_C);
      return;
    } else if (configKey['sap_a'] && sapPart === configKey['sap_a'].toUpperCase()) {
      bitmask.setBit(NamedBits.SAP_A);
      return;
    } else if (configKey['sap_b'] && sapPart === "SAR-" + configKey['sap_b'].toUpperCase()) {
      bitmask.setBit(NamedBits.SAP_B);
      return;
    } else if (configKey['sap_c'] && sapPart === configKey['sap_c'].toUpperCase()) {
      bitmask.setBit(NamedBits.SAP_C);
      return;
    }
  }

  /**
   * Encode SI groups.
   * @private
   */
  encodeSIGroup(siGroupPart, bitmask) {
    const groups = siGroupPart.split('-');

    for (const group of groups) {
      const g = group.trim().toUpperCase();

      if (g === 'SI' || g === '') {
        continue;
      }

      switch (g) {
      case 'GAMMA':
        bitmask.setBit(NamedBits.GAMMA);
        break;
      default:
          // Custom SI group from config
          if (configKey['si_groupa'] && g === configKey['si_groupa'].toUpperCase()) {
            bitmask.setBit(NamedBits.SI_GROUPA);
          } else if (configKey['si_groupb'] && g === configKey['si_groupb'].toUpperCase()) {
            bitmask.setBit(NamedBits.SI_GROUPB);
          } else if (configKey['si_groupc'] && g === configKey['si_groupc'].toUpperCase()) {
            bitmask.setBit(NamedBits.SI_GROUPC);
          }
        break;
      }
    }
  }

  /**
   * Encode RELTO (release to) countries.
   * @private
   */
  encodeRelto(reltoString, bitmask) {
    // Parse the RELTO string
    const countries = this.countryDatabase.parseAndValidateRelto(reltoString);

    if (countries.length === 0) {
      return;
    }

    // Check for special alliances
    if (this.countryDatabase.isFVEY(countries)) {
      bitmask.setBit(NamedBits.RELTO_FVEY);
    } else if (this.countryDatabase.isNineEyes(countries)) {
      bitmask.setBit(NamedBits.RELTO_NINEEYES);
    } else if (this.countryDatabase.isFourteenEyes(countries)) {
      bitmask.setBit(NamedBits.RELTO_FOURTEENEYES);
    } else if (this.countryDatabase.isNATO(countries)) {
      bitmask.setBit(NamedBits.RELTO_NATO);
    } else {
      // Custom RELTO list - use A, B, C bits
      if (countries.length <= 5) {
        bitmask.setBit(NamedBits.RELTO_A);
      } else if (countries.length <= 10) {
        bitmask.setBit(NamedBits.RELTO_B);
      } else {
        bitmask.setBit(NamedBits.RELTO_C);
      }
    }
  }

  /**
   * Decode a bitmask to a classification string.
   * @param {number} classificationMask - The bitmask
   * @returns {string} The classification string
   */
  decode(classificationMask) {
    const bitmask = new BitmaskManager(classificationMask);
    const parts = [];

    // Get classification level
    const level = this.decodeClassificationLevel(bitmask);
    parts.push(level);

    // Get SAP programs
    if (bitmask.isBitSet(NamedBits.SAP_A)) {
      parts.push('SAP-A');
    } else if (bitmask.isBitSet(NamedBits.SAP_B)) {
      parts.push('SAP-B');
    } else if (bitmask.isBitSet(NamedBits.SAP_C)) {
      parts.push('SAP-C');
    }

    // Get SCI compartments
    if (bitmask.isBitSet(NamedBits.SCI)) {
      const sciPart = this.decodeSCI(bitmask);
      parts.push(sciPart);
    }

    // Get distribution controls
    const distPart = this.decodeDistribution(bitmask);
    if (distPart) {
      parts.push(distPart);
    }

    return parts.join('//');
  }

  /**
   * Decode the classification level.
   * @private
   */
  decodeClassificationLevel(bitmask) {
    if (bitmask.isBitSet(NamedBits.TOPSECRET)) {
      return 'TOP SECRET';
    } else if (bitmask.isBitSet(NamedBits.SECRET)) {
      return 'SECRET';
    } else if (bitmask.isBitSet(NamedBits.CONFIDENTIAL)) {
      return 'CONFIDENTIAL';
    } else if (bitmask.isBitSet(NamedBits.UNCLASSIFIED)) {
      if (bitmask.isBitSet(NamedBits.CUI)) {
        return 'CUI';
      }
      return 'UNCLASSIFIED';
    }
    return 'UNCLASSIFIED';
  }

  /**
   * Decode SCI compartments.
   * @private
   */
  decodeSCI(bitmask) {
    const parts = ['SCI'];

    // SI codewords
    const siCodewords = [];
    if (bitmask.isBitSet(NamedBits.SI)) {
      if (bitmask.isBitSet(NamedBits.GAMMA) || 
          bitmask.isBitSet(NamedBits.SI_GROUPA) || 
          bitmask.isBitSet(NamedBits.SI_GROUPB) || 
          bitmask.isBitSet(NamedBits.SI_GROUPC)) {
            var substr = "";
            if (bitmask.isBitSet(NamedBits.GAMMA)) {
              substr += "GAMMA";
            }
            if (bitmask.isBitSet(NamedBits.SI_GROUPA)) {
              if (substr.length > 0) {
                substr += "-";
              }
              substr += "GROUPA";
            }
            if (bitmask.isBitSet(NamedBits.SI_GROUPB)) {
              if (substr.length > 0) {
                substr += "-";
              }
              substr += "GROUPB";
            }
            if (bitmask.isBitSet(NamedBits.SI_GROUPC)) {
              if (substr.length > 0) {
                substr += "-";
              }
              substr += "GROUPC";
            }
            siCodewords.push('SI'); 
      } else {
        siCodewords.push('SI');
      }
    }
    if (bitmask.isBitSet(NamedBits.GAMMA)) {
      siCodewords.push('GAMMA');
    }
    if (bitmask.isBitSet(NamedBits.SI_GROUPA)) {
      siCodewords.push('GROUPA');
    }
    if (bitmask.isBitSet(NamedBits.SI_GROUPB)) {
      siCodewords.push('GROUPB');
    }
    if (bitmask.isBitSet(NamedBits.SI_GROUPC)) {
      siCodewords.push('GROUPC');
    }

    if (siCodewords.length > 1) {
      parts.push('SI-' + siCodewords.slice(1).join('-'));
    } else if (siCodewords.length === 1) {
      parts.push('SI');
    }

    // Other compartments
    if (bitmask.isBitSet(NamedBits.TK)) {
      parts.push('TK');
    }
    if (bitmask.isBitSet(NamedBits.HCS)) {
      if (bitmask.isBitSet(NamedBits.HCS_P)) {
        parts.push('HCS-P');
      } else if (bitmask.isBitSet(NamedBits.HCS_O)) {
        parts.push('HCS-O');
      } else {  
        parts.push('HCS');
      }
    }

    return parts.join('/');
  }

  /**
   * Decode distribution controls.
   * @private
   */
  decodeDistribution(bitmask) {
    if (bitmask.isBitSet(NamedBits.NOFORN)) {
      return 'NOFORN';
    } else if (bitmask.isBitSet(NamedBits.RELTO_FVEY)) {
      return 'REL TO FVEY';
    } else if (bitmask.isBitSet(NamedBits.RELTO_NINEEYES)) {
      return 'REL TO 9EYES';
    } else if (bitmask.isBitSet(NamedBits.RELTO_FOURTEENEYES)) {
      return 'REL TO 14EYES';
    } else if (bitmask.isBitSet(NamedBits.RELTO_NATO)) {
      return 'REL TO NATO';
    }
    return null;
  }

  /**
   * Compare two classification strings.
   * @param {string} classification1 - First classification
   * @param {string} classification2 - Second classification
   * @returns {number} -1 if first is more restrictive, 1 if second is more restrictive, 0 if equal
   */
  compare(classification1, classification2) {
    const mask1 = this.encode(classification1);
    const mask2 = this.encode(classification2);
    return this.compareMasks(mask1, mask2);
  }

  /**
   * Compare two classification masks.
   * @param {number} mask1 - First mask
   * @param {number} mask2 - Second mask
   * @returns {number} -1 if first is more restrictive, 1 if second is more restrictive, 0 if equal
   */
  compareMasks(mask1, mask2) {
    // Extract classification levels
    const level1 = (mask1 >>> 28) & 0xF;
    const level2 = (mask2 >>> 28) & 0xF;

    if (level1 > level2) {
      return -1;
    } else if (level2 > level1) {
      return 1;
    }

    // Levels are equal
    return 0;
  }
}

module.exports = ClassificationEncoder;
