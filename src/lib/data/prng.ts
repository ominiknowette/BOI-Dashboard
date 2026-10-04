/**
 * Deterministic PRNG using Mulberry32 algorithm
 * Seeded with string hashing to guarantee 100% reproducible synthetic records.
 */
export function createPRNG(seedStr: string) {
  // Simple Murmur-like 32-bit hash of seed string
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  return function nextFloat(): number {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const z = (h ^= h >>> 16) >>> 0;
    return z / 4294967296;
  };
}

export function pickOne<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randFloat(min: number, max: number, rng: () => number): number {
  return min + rng() * (max - min);
}
