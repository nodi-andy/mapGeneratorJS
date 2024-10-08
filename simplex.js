import { grad3 } from './grad.js';

const F2 = 0.5*(Math.sqrt(3)-1);
const G2 = (3-Math.sqrt(3))/6;

export default class Simplex {
    constructor(seed = 0) {
        this.perm = new Array(512);
        this.gradP = new Array(512);
        this.seed(seed);
    }
    seed(seed) {
        const p = [151,160,137,91,90,15,
            131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
            190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
            88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
            77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
            102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
            135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
            5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
            223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
            129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
            251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
            49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
            138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    
        if (seed > 0 && seed < 1) {
          seed *= 65536;
        }
    
        seed = Math.floor(seed);
        if (seed < 256) seed |= seed << 8;
    
        for (let i = 0; i < 256; i++) {
          let v = p[i] ^ (seed & 255);
          if (i & 1) v ^= (seed >> 8) & 255;
    
          this.perm[i] = this.perm[i + 256] = v;
          this.gradP[i] = this.gradP[i + 256] = grad3[v % 12];
        }
      }
  noise2D(xin, yin) {
    let n0, n1, n2 // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    const s = (xin + yin) * F2 // Hairy factor for 2D
    let i = Math.floor(xin + s)
    let j = Math.floor(yin + s)
    const t = (i + j) * G2
    const x0 = xin - i + t // The x,y distances from the cell origin, unskewed.
    const y0 = yin - j + t
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    let i1, j1 // Offsets for second (middle) corner of simplex in (i,j) coords
    if (x0 > y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        i1 = 1; j1 = 0
    } else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        i1 = 0; j1 = 1
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    const x1 = x0 - i1 + G2 // Offsets for middle corner in (x,y) unskewed coords
    const y1 = y0 - j1 + G2
    const x2 = x0 - 1 + 2 * G2 // Offsets for last corner in (x,y) unskewed coords
    const y2 = y0 - 1 + 2 * G2
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255
    j &= 255
    const gi0 = this.gradP[i + this.perm[j]]
    const gi1 = this.gradP[i + i1 + this.perm[j + j1]]
    const gi2 = this.gradP[i + 1 + this.perm[j + 1]]
    // Calculate the contribution from the three corners
    let t0 = 0.5 - x0 * x0 - y0 * y0
    if (t0 < 0) {
        n0 = 0
    } else {
        t0 *= t0
        n0 = t0 * t0 * gi0.dot2(x0, y0) // (x,y) of grad3 used for 2D gradient
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1
    if (t1 < 0) {
        n1 = 0
    } else {
        t1 *= t1
        n1 = t1 * t1 * gi1.dot2(x1, y1)
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2
    if (t2 < 0) {
        n2 = 0
    } else {
        t2 *= t2
        n2 = t2 * t2 * gi2.dot2(x2, y2)
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2)
  }
    static defPackSize = 10;
    static defInvSize = 10;
  
    static create (types, max, isConst = false) {
      const packs = types.map(type => ({
        type: type,
        n: 0,
        max: Inventory.defPackSize,
        isConst: isConst
      }));
      return {packs, max: max || this.defInvSize};
    }
  
    // sort out all packs which has different types except the empty ones
    // sort all empty or packs with same type: first the same types unspecific order, then all other packs
    // start filling the packs as ordered, if needed create new pack in the new empty pack slots
    // return null if done else return pack (with type and leftover number)
  
    static addItem(inv, type, n) {
      // Separate packs into different categories
      const sameTypePacks = inv.packs.filter(pack => pack.type === type);
      const emptyPacks = inv.packs.filter(pack => pack.type === null);
  
      // Combine sameTypePacks and emptyPacks (where new packs can be created)
      const usablePacks = [...sameTypePacks, ...emptyPacks];
  
      let leftover = n;
  
      // Try to fill the usable packs
      for (let pack of usablePacks) {
        if (leftover <= 0) break;
        const availableSpace = pack.max - pack.n;
        if (availableSpace > 0) {
          if (pack.type === null) {
            // Initialize the empty pack with the type
            pack.type = type;
          }
          const amountToAdd = Math.min(leftover, availableSpace);
          pack.n += amountToAdd;
          leftover -= amountToAdd;
        }
      }
  
      // If there's leftover, create a new pack if there's space
      if (leftover > 0 && inv.packs.length < inv.max) {
        inv.packs.push({ type: type, n: leftover, max: Inventory.defPackSize });
        leftover = 0;
      }
  
      // Return the remaining items if not all could be added
      if (leftover > 0) {
        return { type, n: leftover, max: Inventory.defPackSize };
      }
  
      return null;
    }
    
    // loop through packs and check if item (type,n) are available 
    static hasItem(inv, type, n) {
      let count = 0;
  
      for (let pack of inv.packs) {
        if (pack.type === type) {
          count += pack.n;
          if (count >= n) {
            return true;
          }
        }
      }
  
      return false;
    }
  
    // First check if items are available (hasItem) if yes, remove them from respective packs, if a pack is emtpy.
    // If a pack has isConst = true, do not remove the pack just set number of items on 0. 
    // If isConst false, remove the pack and set a null value.
  
    static remItem(inv, type, n) {
      if (!Inventory.hasItem(inv, type, n)) {
        return false;
      }
    
      let remainingToRemove = n;
    
      for (let pack of inv.packs) {
        if (pack.type === type) {
          if (pack.n >= remainingToRemove) {
            pack.n -= remainingToRemove;
            remainingToRemove = 0;
          } else {
            remainingToRemove -= pack.n;
            pack.n = 0;
          }
    
          // If the pack is empty, handle it based on isConst
          if (pack.n === 0) {
            if (pack.isConst) {
              // If isConst is true, just set n to 0 and keep the type
              pack.n = 0;
            } else {
              // If isConst is false, mark the pack as empty (null type)
              pack.type = null;
            }
          }
    
          // If all required items have been removed, stop
          if (remainingToRemove === 0) {
            break;
          }
        }
      }
    
      return true;
    }
    
  
    static get(inv, type) {
      let total = 0;
      for (let pack of inv.packs) {
        if (pack.type === type) {
          total += pack.n;
        }
      }
      return total;
    }
    
  }
  