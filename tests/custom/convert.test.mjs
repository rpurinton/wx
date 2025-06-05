import { jest } from '@jest/globals';
import { createConvertHelpers, hpaToInHg, msToKmh, msToMph } from '../../src/custom/convert.mjs';

describe('convert.mjs', () => {
  describe('createConvertHelpers', () => {
    const helpers = createConvertHelpers();
    it('converts m/s to mph', () => {
      expect(helpers.msToMph(1)).toBeCloseTo(2.23694);
    });
    it('converts m/s to km/h', () => {
      expect(helpers.msToKmh(1)).toBeCloseTo(3.6);
    });
    it('converts hPa to inHg', () => {
      expect(helpers.hpaToInHg(1013.25)).toBeCloseTo(29.92, 2);
    });
  });

  describe('named exports', () => {
    it('msToMph', () => {
      expect(msToMph(2)).toBeCloseTo(4.47388);
    });
    it('msToKmh', () => {
      expect(msToKmh(2)).toBeCloseTo(7.2);
    });
    it('hpaToInHg', () => {
      expect(hpaToInHg(1013.25)).toBeCloseTo(29.92, 2);
    });
  });
});
