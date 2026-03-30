/**
 * TypeScript type definitions for classification-encoder
 */

export interface NamedBitsType {
  // Distribution Controls
  RELTO_NINEEYES: number;
  RELTO_FOURTEENEYES: number;
  RELTO_C: number;
  RELTO_B: number;
  RELTO_A: number;
  RELTO_FVEY: number;
  RELTO_NATO: number;
  NOFORN: number;

  // RELIDO
  RELIDO: number;

  // Special Markings
  SBU: number;
  CUI: number;
  FOUO: number;
  PROTECTED: number;

  // SCI Compartments
  HCS: number;
  SI: number;
  TK: number;

  // SCI Containers
  GAMMA: number;
  SI_GROUPA: number;
  SI_GROUPB: number;
  SI_GROUPC: number;

  // SCI and SAP
  SCI: number;
  SAP_A: number;
  SAP_B: number;
  SAP_C: number;

  // Classification Levels
  UNCLASSIFIED: number;
  CONFIDENTIAL: number;
  SECRET: number;
  TOPSECRET: number;

  // Methods
  getValue(name: string): number | null;
  getName(value: number): string | null;
  getAllBits(): string[];
}

export class BitmaskManager {
  constructor(initialMask?: number);
  getBitmask(): number;
  setBitmask(value: number): void;
  reset(): void;
  setBit(bit: number): void;
  clearBit(bit: number): void;
  isBitSet(bit: number): boolean;
  setNamedBit(name: string): void;
  clearNamedBit(name: string): void;
  anySet(bits: number[]): boolean;
  anySCISet(): boolean;
  anySIGroup(): boolean;
  anyRelto(): boolean;
  getFirstNibble(): number;
  getSecondNibble(): number;
  getThirdNibble(): number;
  getFourthNibble(): number;
  getFifthNibble(): number;
  getSixthNibble(): number;
  getSeventhNibble(): number;
  getEighthNibble(): number;
  getFirstByte(): number;
  getSecondByte(): number;
  getThirdByte(): number;
  getFourthByte(): number;
  toString(): string;
}

export class CountryDatabase {
  constructor();
  getCountries3(): string[];
  getCountries2(): string[];
  getNato(): string[];
  getFvey(): string[];
  getNineEyes(): string[];
  getFourteenEyes(): string[];
  getAlpha3ForAlpha2(alpha2: string): string | null;
  getAlpha2ForAlpha3(alpha3: string): string | null;
  isNATO(countries: string[]): boolean;
  isFVEY(countries: string[]): boolean;
  isNineEyes(countries: string[]): boolean;
  isFourteenEyes(countries: string[]): boolean;
  parseAndValidateRelto(reltoString: string): string[];
}

export interface EncoderConfig {
  [key: string]: string;
}

export class ClassificationEncoder {
  constructor(config?: EncoderConfig | null);
  encode(classificationString: string): number;
  decode(classificationMask: number): string;
  compare(classification1: string, classification2: string): number;
  compareMasks(mask1: number, mask2: number): number;
}

export const NamedBits: NamedBitsType;

export default {
  NamedBits,
  BitmaskManager,
  CountryDatabase,
  ClassificationEncoder
};
