// test/inventory.test.js
import { expect } from 'chai';
import Simplex from '../simplex.js';

describe('Inventory', () => {

  describe('noise2D', () => {
    it('should return values in the range [-1, 1]', () => {
      const simplex = new Simplex(12345); // seed for consistency

      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          const value = simplex.noise2D(x / 10, y / 10);
          expect(value).to.be.within(-1, 1);
        }
      }
    });

    it('should return deterministic values for the same inputs', () => {
      const simplex = new Simplex(12345); // seed for consistency

      const value1 = simplex.noise2D(0.5, 0.5);
      const value2 = simplex.noise2D(0.5, 0.5);

      expect(value1).to.equal(value2);
    });

    it('should return different values for different inputs', () => {
      const simplex = new Simplex(12345); // seed for consistency

      const value1 = simplex.noise2D(0.5, 0.5);
      const value2 = simplex.noise2D(0.6, 0.6);

      expect(value1).to.not.equal(value2);
    });
  });

  
});
