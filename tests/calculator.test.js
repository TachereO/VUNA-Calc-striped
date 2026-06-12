const { evaluateExpression, nPr, nCr } = require('../src/calculator');

describe('Arithmetic', () => {
  it('adds two numbers', () => {
    expect(evaluateExpression('2+3')).toBe(5);
  });

  it('subtracts two numbers', () => {
    expect(evaluateExpression('10-4')).toBe(6);
  });

  it('multiplies two numbers', () => {
    expect(evaluateExpression('3*4')).toBe(12);
  });

  it('divides two numbers', () => {
    expect(evaluateExpression('12/4')).toBe(3);
  });

  it('respects precedence (multiplication before addition)', () => {
    expect(evaluateExpression('2+3*4')).toBe(14);
  });

  it('respects precedence with division', () => {
    expect(evaluateExpression('10-6/2')).toBe(7);
  });

  it('handles chained operations', () => {
    expect(evaluateExpression('2+3+4')).toBe(9);
  });

  it('handles parentheses', () => {
    expect(evaluateExpression('(2+3)*4')).toBe(20);
  });

  it('handles decimal numbers', () => {
    expect(evaluateExpression('3.5*2')).toBe(7);
  });

  it('rejects invalid characters', () => {
    expect(() => evaluateExpression('2&3')).toThrow();
  });

  it('rejects division by zero', () => {
    expect(() => evaluateExpression('5/0')).toThrow('Division by zero');
  });

  it('rejects mismatched parentheses', () => {
    expect(() => evaluateExpression('(2+3')).toThrow();
  });

  it('returns 0 for empty string', () => {
    expect(evaluateExpression('')).toBe(0);
  });
});

describe('nPr (Permutations)', () => {
  it('calculates 5P3 = 60', () => {
    expect(nPr(5, 3)).toBe(60);
  });

  it('calculates 5P5 = 120', () => {
    expect(nPr(5, 5)).toBe(120);
  });

  it('calculates 10P2 = 90', () => {
    expect(nPr(10, 2)).toBe(90);
  });

  it('returns NaN when r > n', () => {
    expect(nPr(3, 5)).toBeNaN();
  });

  it('returns NaN for negative inputs', () => {
    expect(nPr(-1, 2)).toBeNaN();
  });

  it('handles 0P0 = 1', () => {
    expect(nPr(0, 0)).toBe(1);
  });

  it('evaluates nPr in expression', () => {
    expect(evaluateExpression('5nPr3')).toBe(60);
  });
});

describe('nCr (Combinations)', () => {
  it('calculates 5C3 = 10', () => {
    expect(nCr(5, 3)).toBe(10);
  });

  it('calculates 5C5 = 1', () => {
    expect(nCr(5, 5)).toBe(1);
  });

  it('calculates 10C2 = 45', () => {
    expect(nCr(10, 2)).toBe(45);
  });

  it('calculates 10C8 = 45 (symmetry)', () => {
    expect(nCr(10, 8)).toBe(45);
  });

  it('returns NaN when r > n', () => {
    expect(nCr(3, 5)).toBeNaN();
  });

  it('returns NaN for negative inputs', () => {
    expect(nCr(-1, 2)).toBeNaN();
  });

  it('handles 0C0 = 1', () => {
    expect(nCr(0, 0)).toBe(1);
  });

  it('evaluates nCr in expression', () => {
    expect(evaluateExpression('5nCr3')).toBe(10);
  });
});

describe('Combined expressions with nPr/nCr', () => {
  it('adds after nPr', () => {
    expect(evaluateExpression('5nPr3+10')).toBe(70);
  });

  it('multiplies after nCr', () => {
    expect(evaluateExpression('5nCr3*2')).toBe(20);
  });

  it('nPr has higher precedence than +', () => {
    expect(evaluateExpression('2+5nPr3')).toBe(62);
  });
});