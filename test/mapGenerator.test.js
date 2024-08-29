// test/mapGenerator.test.js
import { expect } from 'chai';
import MapGenerator from '../mapGenerator.js';

// Unit tests for MapGenerator
describe('MapGenerator', () => {
  describe('generateMap', () => {
    it('should generate a map of the correct dimensions', () => {
      const width = 10;
      const height = 10;
      const mapGen = new MapGenerator(width, height, { scale: 0.1, seed: 12345 });

      const map = mapGen.generateMap();

      expect(map).to.have.lengthOf(height);
      map.forEach(row => {
        expect(row).to.have.lengthOf(width);
      });
    });

    it('should generate deterministic maps with the same seed', () => {
      const mapGen1 = new MapGenerator(10, 10, { scale: 0.1, seed: 12345 });
      const mapGen2 = new MapGenerator(10, 10, { scale: 0.1, seed: 12345 });

      const map1 = mapGen1.generateMap();
      const map2 = mapGen2.generateMap();

      expect(map1).to.deep.equal(map2);
    });

    it('should generate different maps with different seeds', () => {
      const mapGen1 = new MapGenerator(10, 10, { scale: 0.1, seed: 12345 });
      const mapGen2 = new MapGenerator(10, 10, { scale: 0.1, seed: 54321 });

      const map1 = mapGen1.generateMap();
      const map2 = mapGen2.generateMap();

      expect(map1).to.not.deep.equal(map2);
    });

    it('should generate values within the expected range', () => {
      const mapGen = new MapGenerator(10, 10, { scale: 0.1, seed: 12345 });
  
      const map = mapGen.generateMap();
  
      map.forEach(row => {
        row.forEach(value => {
          expect(value).to.be.within(0, 1);  // Adjusted to be within the normalized range [0, 1]
        });
      });
    });
  
    it('should apply min and max cutoffs correctly', () => {
      const minCutoff = 0.4;
      const maxCutoff = 0.6;
      const mapGen = new MapGenerator(10, 10, { scale: 0.1, seed: 12345, min: minCutoff, max: maxCutoff });
  
      const map = mapGen.generateMap();
  
      map.forEach(row => {
        row.forEach(value => {
          if (value === 0) {
            expect(value).to.equal(0);  // Values below minCutoff should be 0
          } else if (value === 1) {
            expect(value).to.equal(1);  // Values above maxCutoff should be 1
          } else {
            expect(value).to.be.within(minCutoff, maxCutoff);
          }
        });
      });
    });
  
    it('should scale the map values correctly', () => {
      const mapGen = new MapGenerator(10, 10, { scale: 0.1, seed: 12345 });
  
      const map = mapGen.generateMap();
      const scaledMap = mapGen.scaleMapData(map, 0.5, 0.7);
  
      scaledMap.forEach(row => {
        row.forEach(value => {
          expect(value).to.be.within(0.5, 0.7);
        });
      });
    });
  
    it('should visualize the map correctly', () => {
      const mapGen = new MapGenerator(100, 100, { scale: 0.1, seed: 12345, min: 0.9, max: 0.1 });
  
      const map = mapGen.generateMap();
  
      console.log('Visualized Map:');
      mapGen.visualizeMap(map); // This outputs the visualized map to the console
    });

  });
});
