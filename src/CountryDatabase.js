/**
 * Database of country codes and intelligence alliances.
 * Handles conversion between alpha-2 and alpha-3 country codes.
 * Manages FVEY, NATO, and other country groupings.
 */

class CountryDatabase {
  constructor() {
    // Initialize country mappings
    this.initializeCountries();
    this.initializeAlliances();
  }

  /**
   * Initialize country code mappings.
   */
  initializeCountries() {
    // Comprehensive country code mapping (alpha-2 to alpha-3)
    this.countryMap = {
      'US': 'USA', 'GB': 'GBR', 'CA': 'CAN', 'AU': 'AUS', 'NZ': 'NZL',
      'FR': 'FRA', 'DE': 'DEU', 'IT': 'ITA', 'ES': 'ESP', 'PT': 'PRT',
      'NL': 'NLD', 'BE': 'BEL', 'LU': 'LUX', 'DK': 'DNK', 'SE': 'SWE',
      'NO': 'NOR', 'FI': 'FIN', 'IS': 'ISL', 'IE': 'IRL', 'CH': 'CHE',
      'AT': 'AUT', 'CZ': 'CZE', 'PL': 'POL', 'HU': 'HUN', 'RO': 'ROU',
      'BG': 'BGR', 'HR': 'HRV', 'SI': 'SVN', 'SK': 'SVK', 'TR': 'TUR',
      'GR': 'GRC', 'JP': 'JPN', 'KR': 'KOR', 'CN': 'CHN', 'IN': 'IND',
      'BR': 'BRA', 'MX': 'MEX', 'RU': 'RUS', 'UA': 'UKR', 'KZ': 'KAZ',
      'IL': 'ISR', 'SA': 'SAU', 'AE': 'ARE', 'SG': 'SGP', 'MY': 'MYS',
      'TH': 'THA', 'ID': 'IDN', 'PH': 'PHL', 'VN': 'VNM', 'ZA': 'ZAF',
      'EG': 'EGY', 'NG': 'NGA', 'KE': 'KEN', 'AR': 'ARG', 'CL': 'CHL',
      'CO': 'COL', 'PE': 'PER', 'VE': 'VEN', 'NP': 'NPL', 'PK': 'PAK',
      'BD': 'BGD', 'LK': 'LKA', 'MM': 'MMR', 'CW': 'CUW', 'AW': 'ABW',
      'SX': 'SXM', 'BQ': 'BES', 'AL': 'ALB', 'MK': 'MKD', 'ME': 'MNE',
      'RS': 'SRB', 'BA': 'BIH', 'XK': 'XKX', 'BY': 'BLR', 'MD': 'MDA',
      'GE': 'GEO', 'AM': 'ARM', 'AZ': 'AZE', 'EE': 'EST', 'LV': 'LVA',
      'LT': 'LTU', 'CY': 'CYP', 'MT': 'MLT', 'HK': 'HKG', 'MO': 'MAC',
      'TW': 'TWN', 'TH': 'THA', 'LA': 'LAO', 'KH': 'KHM', 'BN': 'BRN',
      'TL': 'TLS', 'PG': 'PNG', 'FJ': 'FJI', 'SB': 'SLB', 'VU': 'VUT',
      'WS': 'WSM', 'KI': 'KIR', 'MH': 'MHL', 'FM': 'FSM', 'PW': 'PLW'
    };

    // Create reverse mapping
    this.reverseCountryMap = {};
    for (const [alpha2, alpha3] of Object.entries(this.countryMap)) {
      this.reverseCountryMap[alpha3] = alpha2;
    }
  }

  /**
   * Initialize intelligence alliances.
   */
  initializeAlliances() {
    // Five Eyes (FVEY) - USA, GBR, CAN, AUS, NZL
    this.fvey = ['USA', 'GBR', 'CAN', 'AUS', 'NZL'];

    // Nine Eyes - FVEY + DNK, FRA, NLD, NOR
    this.nineEyes = ['USA', 'GBR', 'CAN', 'AUS', 'NZL', 'DNK', 'FRA', 'NLD', 'NOR'];

    // Fourteen Eyes - Nine Eyes + BEL, DEU, ITA, ESP, SWE
    this.fourteenEyes = [
      'USA', 'GBR', 'CAN', 'AUS', 'NZL', 'DNK', 'FRA', 'NLD', 'NOR',
      'BEL', 'DEU', 'ITA', 'ESP', 'SWE'
    ];

    // NATO members
    this.nato = [
      'USA', 'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'LUX',
      'DNK', 'NOR', 'PRT', 'GRC', 'TUR', 'POL', 'CZE', 'HUN', 'ROU',
      'BGR', 'HRV', 'SVN', 'SVK', 'ALB', 'MKD', 'MNE', 'EST', 'LVA',
      'LTU', 'SWE', 'FIN', 'ISL'
    ];
  }

  /**
   * Get all alpha-3 country codes.
   * @returns {string[]} Array of alpha-3 codes
   */
  getCountries3() {
    return Object.values(this.countryMap);
  }

  /**
   * Get all alpha-2 country codes.
   * @returns {string[]} Array of alpha-2 codes
   */
  getCountries2() {
    return Object.keys(this.countryMap);
  }

  /**
   * Get NATO member countries.
   * @returns {string[]} Array of NATO member alpha-3 codes
   */
  getNato() {
    return [...this.nato];
  }

  /**
   * Get Five Eyes member countries.
   * @returns {string[]} Array of FVEY member alpha-3 codes
   */
  getFvey() {
    return [...this.fvey];
  }

  /**
   * Get Nine Eyes member countries.
   * @returns {string[]} Array of Nine Eyes member alpha-3 codes
   */
  getNineEyes() {
    return [...this.nineEyes];
  }

  /**
   * Get Fourteen Eyes member countries.
   * @returns {string[]} Array of Fourteen Eyes member alpha-3 codes
   */
  getFourteenEyes() {
    return [...this.fourteenEyes];
  }

  /**
   * Convert alpha-2 code to alpha-3.
   * @param {string} alpha2 - The alpha-2 code
   * @returns {string|null} The alpha-3 code, or null if not found
   */
  getAlpha3ForAlpha2(alpha2) {
    if (!alpha2) {
      return null;
    }
    const upper = alpha2.toUpperCase();
    return this.countryMap[upper] || null;
  }

  /**
   * Convert alpha-3 code to alpha-2.
   * @param {string} alpha3 - The alpha-3 code
   * @returns {string|null} The alpha-2 code, or null if not found
   */
  getAlpha2ForAlpha3(alpha3) {
    if (!alpha3) {
      return null;
    }
    const upper = alpha3.toUpperCase();
    return this.reverseCountryMap[upper] || null;
  }

  /**
   * Check if a list of countries represents NATO.
   * @param {string[]} countries - Array of alpha-3 codes
   * @returns {boolean} True if the list matches NATO members
   */
  isNATO(countries) {
    if (!Array.isArray(countries)) {
      return false;
    }
    const set1 = new Set(countries.map(c => c.toUpperCase()));
    const set2 = new Set(this.nato);
    return set1.size === set2.size && [...set1].every(c => set2.has(c));
  }

  /**
   * Check if a list of countries represents Five Eyes.
   * @param {string[]} countries - Array of alpha-3 codes
   * @returns {boolean} True if the list matches FVEY members
   */
  isFVEY(countries) {
    if (!Array.isArray(countries)) {
      return false;
    }
    const set1 = new Set(countries.map(c => c.toUpperCase()));
    const set2 = new Set(this.fvey);
    return set1.size === set2.size && [...set1].every(c => set2.has(c));
  }

  /**
   * Check if a list of countries represents Nine Eyes.
   * @param {string[]} countries - Array of alpha-3 codes
   * @returns {boolean} True if the list matches Nine Eyes members
   */
  isNineEyes(countries) {
    if (!Array.isArray(countries)) {
      return false;
    }
    const set1 = new Set(countries.map(c => c.toUpperCase()));
    const set2 = new Set(this.nineEyes);
    return set1.size === set2.size && [...set1].every(c => set2.has(c));
  }

  /**
   * Check if a list of countries represents Fourteen Eyes.
   * @param {string[]} countries - Array of alpha-3 codes
   * @returns {boolean} True if the list matches Fourteen Eyes members
   */
  isFourteenEyes(countries) {
    if (!Array.isArray(countries)) {
      return false;
    }
    const set1 = new Set(countries.map(c => c.toUpperCase()));
    const set2 = new Set(this.fourteenEyes);
    return set1.size === set2.size && [...set1].every(c => set2.has(c));
  }

  /**
   * Parse and validate a RELTO string.
   * @param {string} reltoString - RELTO string (e.g., "REL TO USA, GBR, CAN")
   * @returns {string[]} Array of validated alpha-3 country codes
   */
  parseAndValidateRelto(reltoString) {
    if (!reltoString) {
      return [];
    }

    // Remove "REL TO" prefix if present
    let cleaned = reltoString.toUpperCase().replace(/^REL\s+TO\s+/, '');

    // Split by comma and trim
    const parts = cleaned.split(',').map(p => p.trim());

    const result = [];
    for (const part of parts) {
      if (!part) continue;

      // Try as alpha-3 first
      if (this.reverseCountryMap[part]) {
        result.push(part);
      } else {
        // Try as alpha-2
        const alpha3 = this.countryMap[part];
        if (alpha3) {
          result.push(alpha3);
        }
        // Otherwise skip invalid code
      }
    }

    return result;
  }
}

module.exports = CountryDatabase;
