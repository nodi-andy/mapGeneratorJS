import Simplex from './simplex.js';

export default class MapGenerator {
  constructor(width, height, options = {}) {
    this.width = width;
    this.height = height;
    this.min = options.min !== undefined ? options.min : 0.0;
    this.max = options.max !== undefined ? options.max : 1.0;
    this.scale = options.scale || 0.1;
    this.noise = new Simplex(options.seed);
  }

  generateMap() {
    const map = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        let value = this.noise.noise2D(x * this.scale, y * this.scale);
        // Normalize the noise value to [0, 1]
        value = (value + 1) / 2;

        // Apply min and max cutoffs
        if (value < this.min) value = 0;
        if (value > this.max) value = 1;

        row.push(value);
      }
      map.push(row);
    }
    return map;
  }

  extendMap(xStart, yStart, xEnd, yEnd) {
    const extendedMap = [];
    for (let y = yStart; y < yEnd; y++) {
      const row = [];
      for (let x = xStart; x < xEnd; x++) {
        const value = this.noiseType === 'perlin'
          ? this.noise.noise2D(x * this.scale, y * this.scale)
          : this.noise.noise2D(x * this.scale, y * this.scale);
        row.push(value);
      }
      extendedMap.push(row);
    }
    return extendedMap;
  }

  scaleMapData(map, newMin, newMax) {
    const scaledMap = [];
    map.forEach(row => {
      const scaledRow = row.map(value => {
        // Scale the value from [0, 1] to [newMin, newMax]
        return newMin + (newMax - newMin) * value;
      });
      scaledMap.push(scaledRow);
    });
    return scaledMap;
  }

  visualizeMap(map) {
    const chars = [' ', '.', '*', '#'];
    map.forEach(row => {
      let rowStr = '';
      row.forEach(value => {
        if (value === 0) {
          rowStr += chars[0];
        } else if (value > 0 && value <= 0.33) {
          rowStr += chars[1];
        } else if (value > 0.33 && value <= 0.66) {
          rowStr += chars[2];
        } else {
          rowStr += chars[3];
        }
      });
      console.log(rowStr);
    });
  }
}
