import { expect } from 'chai';
import { Grad } from '../grad.js';

describe('Grad', () => {
  it('should calculate dot product for 2D vectors correctly', () => {
    const grad = new Grad(1, 2, 0);
    const dot = grad.dot2(3, 4);
    expect(dot).to.equal(11); // 1*3 + 2*4 = 11
  });

  it('should calculate dot product for 3D vectors correctly', () => {
    const grad = new Grad(1, 2, 3);
    const dot = grad.dot3(4, 5, 6);
    expect(dot).to.equal(32); // 1*4 + 2*5 + 3*6 = 32
  });
});
