export function areSetsEquals(a, b) {
  return a.size == b.size && a.isSubsetOf(b);
}

export const compareFloatsEpsilon = (a, b, Epsilon = 1e-10) =>
  Math.abs(a - b) < Epsilon;
