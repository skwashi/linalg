if (!EPSILON) 
  var EPSILON = 2e-16;

function fEqual(a, b) {
  return Math.abs(b-a) < EPSILON;
};

function fZero(a) {
  return Math.abs(a) < EPSILON;
};
