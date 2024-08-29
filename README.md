# Generative Noise Map Generator

A modular JavaScript library for generating 2D and 3D Perlin and Simplex noise maps. This library is designed to be used as a submodule in other projects.

```
import { MapGenerator } from 'noise-map-generator/mapGenerator.js';

const mapGen = new MapGenerator(100, 100, { noiseType: 'simplex', seed: 42, scale: 0.1 });
const map = mapGen.generateMap();
console.log(map);
```
```
const extendedMap = mapGen.extendMap(100, 100, 150, 150);
console.log(extendedMap);
```