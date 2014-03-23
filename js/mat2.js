/**
 * @author Jonas Ransjö
 */

/**
 * a b
 * c d
 */
function Mat2(a, b, c, d) {
  this.a = a; this.b = b;
  this.c = c; this.d = d;
}

Mat2.prototype.init = function (a, b, c, d) {
  this.a = a; this.b = b;
  this.c = c; this.d = d;
};

Mat2.prototype.set = Mat2.prototype.init;

Mat2.prototype.setM = function (m) {
  this.a = m.a; this.b = m.b;
  this.c = m.c; this.d = m.d;
  return this;
};

Mat2.prototype.setIdentity = function () {
  this.a = 1; this.b = 0;
  this.c = 0; this.d = 1;
  return this;
};

Mat2.prototype.setId = Mat2.prototype.setIdentity;

Mat2.prototype.clone = function () {
  return new Mat2(this.a, this.b, 
                  this.c, this.d);
};

Mat2.prototype.equals = function (m) {
  return (Math.abs(m.a - this.a) <= EPSILON &&
          Math.abs(m.b - this.b) <= EPSILON &&
          Math.abs(m.c - this.c) <= EPSILON &&
          Math.abs(m.d - this.d) <= EPSILON);
};

Mat2.prototype.eq = Mat2.prototype.equals;


/**
 * In place update methods
 */

Mat2.prototype.add = function (m) {
  this.a += m.a; this.b += m.b;
  this.c += m.c; this.d += m.d;
  return this;
};

Mat2.prototype.sub = function (m) {
  this.a -= m.a; this.b -= m.b;
  this.c -= m.c; this.d -= m.d;
  return this;
};

Mat2.prototype.scale = function (s) {
  this.a *= s; this.b *= s;
  this.c *= s; this.d *= s;
  return this;
};

Mat2.prototype.div = function (s) {
  this.a /= s; this.b /= s;
  this.c /= s; this.d /= s;
  return this;
};

Mat2.prototype.negate = function () {
  this.a = -this.a; this.b = -this.b;
  this.c = -this.c; this.d = -this.d;
};

Mat2.prototype.neg = Mat2.prototype.negate;

/**
 * a b * ma mb = a*ma + b*mc  a*mb + b*md
 * c d   mc md   c*ma + d*mc  c*mb + d*md
 */
Mat2.prototype.multiply = function (m) {
  var a = this.a, b = this.b, c = this.c, d = this.d;
  var ma = m.a, mb = m.b, mc = m.c, md = m.d;
  this.a = a*m.a + b*m.c; 
  this.b = a*m.b + b*m.d;
  this.c = c*m.a + d*m.c; 
  this.d = c*m.b + d*m.d;
  return this;
};

Mat2.prototype.mul = Mat2.prototype.multiply;

Mat2.prototype.apply = function (v) {
  var x = v.x,
      y = v.y;
  v.x = this.a * x + this.b * y;
  v.y = this.c * x + this.d * y;
  return v;  
};

Mat2.prototype.vec2 = Mat2.prototype.apply;

Mat2.prototype.rotate = function (angle) {
  var ca = Math.cos(angle);
  var sa = Math.sin(angle);
  var a = this.a, b = this.b,
      c = this.c, d = this.d;
  this.a = a*ca + b*sa;
  this.b = -a*sa + b*ca;
  this.c = c*ca + d*sa;
  this.d = -c*sa + d*ca;
  return this;
};

Mat2.prototype.rot = Mat2.prototype.rotate;

Mat2.prototype.transpose = function () {
  var b = this.b;
  this.b = this.c;
  this.c = b;
  return this;
};

Mat2.prototype.tr = Mat2.prototype.transpose;

Mat2.prototype.invert = function () {
  var a = this.a, b = this.b, 
      c = this.c, d = this.d,
      det = a*d - b*c;
  
  if (!det) {
    return null;
  }
  det = 1/det;
  
  this.a =  d * det;
  this.b = -b * det;
  this.c = -c * det;
  this.d =  a * det;
  return this;
};

Mat2.prototype.inv = Mat2.prototype.invert;

Mat2.prototype.adjoint = function () {
  var a = this.a;
  this.a = this.d;
  this.b = -this.b;
  this.c = -this.c;
  this.d = a;
  return this;
};

Mat2.prototype.adj = Mat2.prototype.adjoint;


/**
 * Object reuse output methods
 */

Mat2.prototype.addOut = function (m, out) {
  out.a = this.a + m.a;
  out.b = this.b + m.b;
  out.c = this.c + m.c;
  out.d = this.d + m.d;
  return out;
};

Mat2.prototype.subOut = function (m, out) {
  out.a = this.a - m.a;
  out.b = this.b - m.b;
  out.c = this.c - m.c;
  out.d = this.d - m.d;
  return out;
};

Mat2.prototype.scaleOut = function (s, out) {
  out.a = this.a * s;
  out.b = this.b * s;
  out.c = this.c * s;
  out.d = this.d * s;
  return out;
};

Mat2.prototype.divOut = function (s, out) {
  out.a = this.a / s;
  out.b = this.b / s;
  out.c = this.c / s;
  out.d = this.d / s;
  return out;
};

Mat2.prototype.multiplyOut = function (m, out) {
  var a = this.a, b = this.b, 
      c = this.c, d = this.d,
      ma = m.a, mb = m.b, 
      mc = m.c, md = m.d;
  this.a = a*m.a + b*m.c;
  this.b = a*m.b + b*m.d;
  this.c = c*m.a + d*m.c;
  this.d = c*m.b + d*m.d;
  return this;
};
 
Mat2.prototype.mulOut = Mat2.prototype.multiplyOut;

Mat2.prototype.applyOut = function (v, out) {
  var x = v.x,
      y = v.y;
  out.x = this.a * x + this.b * y;
  out.y = this.c * x + this.d * y;
  return out;
};

Mat2.prototype.vec2Out = Mat2.prototype.applyOut;

Mat2.prototype.rotateOut = function (angle, out) {
  var ca = Math.cos(angle);
  var sa = Math.sin(angle);
  var a = this.a, b = this.b,
      c = this.c, d = this.d;
  out.a = a*ca + b*sa;
  out.b = -a*sa + b*ca;
  out.c = c*ca + d*sa;
  out.d = -c*sa + d*ca;
  return out;
};

Mat2.prototype.rotOut = Mat2.prototype.rotateOut;

Mat2.prototype.transposeOut = function (out) {
  out.a = this.a;
  out.b = this.c;
  out.c = this.b;
  out.d = this.d;
  return out;
};

Mat2.prototype.trOut = Mat2.prototype.transposeOut;

Mat2.prototype.invertOut = function (out) {
  var a = this.a, b = this.b, 
      c = this.c, d = this.d,
      det = a*d - b*c;
  
  if (!det) {
    return null;
  }
  det = 1/det;
  
  out.a =  d * det;
  out.b = -b * det;
  out.c = -c * det;
  out.d =  a * det;
  return out;
};

Mat2.prototype.invOut = Mat2.prototype.invertOut;

Mat2.prototype.adjointOut = function (out) {
  out.a = this.d;
  out.b = -this.b;
  out.c = -this.c;
  out.d = this.a;
  return out;
};

Mat2.prototype.adjOut = Mat2.prototype.adjointOut;


/**
 * Solve A out = v 
 */
Mat2.prototype.solve = function(v) {
  var a = this.a, b = this.b, 
      c = this.c, d = this.d,
      det = a*d - b*c;
  
  if (!det)
    return null;
  det = 1/det;
  
  this.x = det * (d * v.x - b * v.y);
  this.y = det * (a * v.y - c * v.x);
  return this;
};


Mat2.prototype.solveOut = function(v, out) {
  var a = this.a, b = this.b, 
      c = this.c, d = this.d,
      det = a*d - b*c;
  
  if (!det)
    return null;
  det = 1/det;
  
  out.x = det * (d * v.x - b * v.y);
  out.y = det * (a * v.y - c * v.x);
  return out;
};


Mat2.prototype.determinant = function () {
  return this.a * this.d - this.b * this.c;
};

Mat2.prototype.det = Mat2.prototype.determinant;


/**
 * Some important matrices
 */

var Matrices = {};

Matrices.identity = function (out) {
  if (out) {
    out.set(1, 0, 
            0, 1);
    return out;
  } else
    return new Mat2(1, 0, 
                    0, 1);
};

Matrices.rotation = function (angle, out) {
  var c = Math.cos(angle),
      s = Math.sin(angle);
  if (out) {
    out.set(c, -s, 
            s, c);
    return out;
  } else
    return new Mat2(c, -s, 
                    s, c);
};

Matrices.scaling = function (s, out) {
  if (out) {
    return out;
  } else
    return new Mat2(s, 0, 
                    0, s);
};
