/**
 * @author Jonas Ransjö
 */

/**
 * Declared methods:
 *
 * ***** Constructors and setters
 * clone
 * set 
 * setV
 *
 * ***** In place update
 * add 
 * sub
 * scale
 *   mul
 * div
 * addScaled
 *   addS
 * unit
 *   normalize
 * setMin
 * setMax
 *
 * project
 * projectN
 * interp
 * rotate
 * transform
 * applyMat2
 *   mat2
 * 
 * ***** Object reuse with output
 * addOut
 * subOut
 * scaleOut
 *   mulOut
 * divOut
 * addScaledOut
 *   addSOut
 * unitOut
 * minOut
 * maxOut
 *
 * projectOut
 * projectNOut
 * interpOut
 * rotateOut
 * transformOut
 * applyMat2Out
 *   mat2Out
 * 
 * normal
 * unitNormal
 * normal2
 * unitNormal2
 *
 * ***** Other methods
 * isZero
 * distance
 * dist = distance
 * distanceSquared
 *   distSq
 * equals
 *   eq
 * length 
 *   len
 * lengthSquared
 *   lenSq
 * lessThan
 *   lt
 * greaterThan
 *   gt
 *
 * dot
 * cross
 */

function Vec2(x, y) {
  this.x = x;
  this.y = y;
}

Vec2.prototype = {
  init: function (x, y) {this.x = x; this.y = y; return this;},
  setV: function (v) {this.x = v.x; this.y = v.y; return this;},
  setZero: function () {this.x = 0; this.y = 0; return this;},
  add: function (v) {this.x += v.x; this.y += v.y; return this;},
  addXY: function (x, y) {this.x += x; this.y += y; return this;},
  subXY: function (x, y) {this.x -= x; this.y -= y; return this;},
  sub: function (v) {this.x -= v.x; this.y -= v.y; return this;},
  scale: function (s) {this.x *= s; this.y *= s; return this;},
  div: function (s) {this.x /= s; this.y /= s; return this;},
  negate: function () {this.x = -this.x; this.y = -this.y; return this;},
  addScaled: function (s, v) {this.x += s*v.x; this.y += s*v.y; return this;}
};

Vec2.prototype.setXY = Vec2.prototype.init;

Vec2.prototype.set = Vec2.prototype.setV;

Vec2.prototype.mul = Vec2.prototype.scale;

Vec2.prototype.neg = Vec2.prototype.negate;

Vec2.prototype.addS = Vec2.prototype.addScaled;

Vec2.prototype.clone = function () {
  return new Vec2(this.x, this.y);
};

Vec2.prototype.addOut = function (v, out) {
  out.x = this.x + v.x;
  out.y = this.y + v.y;
  return out;
};

Vec2.prototype.subOut = function (v, out) {
  out.x = this.x - v.x;
  out.y = this.y - v.y;
  return out;
};

Vec2.prototype.mulOut = function (s, out) {
  out.x = s*this.x;
  out.y = s*this.y;
  return out;
};

Vec2.prototype.scaleOut = Vec2.prototype.mulOut;

Vec2.prototype.divOut = function (s, out) {
  out.x = this.x/s;
  out.y = this.y/s;
  return out;
};

Vec2.prototype.negateOut = function (out) {
  out.x = -this.x;
  out.y = -this.y;
  return out;
};

Vec2.prototype.negOut = Vec2.prototype.negateOut;

Vec2.prototype.addScaledOut = function (s, v, out) {
  out.x = this.x + s*v.x;
  out.y = this.y + s*v.y;
  return out;
};

Vec2.prototype.addSOut = Vec2.prototype.addScaledOut;


Vec2.prototype.unit = function () {
  var l = Math.sqrt(this.x*this.x + this.y * this.y);
  if (l != 0) {
    this.x /= l;
    this.y /= l;
  }
  return this;
};

Vec2.prototype.normalize = Vec2.prototype.unit;

Vec2.prototype.unitOut = function (out) {
  var l = Math.sqrt(this.x*this.x + this.y * this.y);
  if (l <= EPSILON)
    return out;
  else {
    out.x = this.x/l;
    out.y = this.y/l;
    return out;
  }
};

Vec2.prototype.isZero = function () {
  return (Math.abs(this.x) <= EPSILON && 
          Math.abs(this.y) <= EPSILON);
};

Vec2.prototype.distance = function (v) {
  var x = v.x - this.x, 
      y = v.y - this.y;
  return Math.sqrt(x*x + y*y);
};

Vec2.prototype.dist = Vec2.prototype.distance;

Vec2.prototype.distanceSquared = function (v) {
  var x = v.x - this.x,
      y = v.y - this.y;
  return x*x + y*y;
};

Vec2.prototype.distSq = Vec2.prototype.distanceSquared;

Vec2.prototype.equals = function (v) {
  return (Math.abs(v.x - this.x) <= EPSILON &&
          Math.abs(v.y - this.y) <= EPSILON);
};

Vec2.prototype.eq = Vec2.prototype.equals;

Vec2.prototype.length = function () {
  var x = this.x,
      y = this.y;
  return Math.sqrt(x*x + y*y);
};

Vec2.prototype.len = Vec2.prototype.length;

Vec2.prototype.lengthSquared = function () {
  var x = this.x,
      y = this.y;
  return x*x + y*y;
};

Vec2.prototype.lenSq = Vec2.prototype.lengthSquared;

Vec2.prototype.setMin = function (v) {
  if (v.x < this.x)
    this.x = v.x;
  if (v.y < this.y)
    this.y = v.x;
  return this;
};

Vec2.prototype.minOut = function (v, out) {
  out.x = Math.min(this.x, v.x);
  out.y = Math.min(this.y, v.y);
  return out;
};

Vec2.prototype.setMax = function (v) {
  if (v.x > this.x)
    this.x = v.x;
  if (v.y > this.y)
    this.y = v.y;
  return this;
};

Vec2.prototype.maxOut = function (v, out) {
  out.x = Math.max(this.x, v.x);
  out.y = Math.max(this.y, v.y);
  return out;
};

Vec2.prototype.lessThan = function (v) {
  return this.x < v.x || this.y < v.y;
};

Vec2.prototype.lt = Vec2.prototype.lessThan;

Vec2.prototype.greaterThan = function (v) {
  return this.x > v.x || this.y > v.y;
};

Vec2.prototype.gt = Vec2.prototype.greaterThan;


/**
 * Linear algebra
 */

Vec2.prototype.normal = function (out) {
  out.x = -this.y;
  out.y = this.x;
  return out;
};

Vec2.prototype.unitNormal = function (out) {
  out.x = -this.y;
  out.y = this.x;
  out.normalize();
  return out;
};

Vec2.prototype.normal2 = function (out) {
  out.x = this.y;
  out.y = -this.x;
  return out;
};

Vec2.prototype.unitNormal2 = function (out) {
  out.x = this.y;
  out.y = -this.x;
  out.normalize();
  return out;
};

Vec2.prototype.dot = function (v) {
  return this.x*v.x + this.y*v.y;
};

Vec2.prototype.cross = function (v) {
  return this.x * v.y - this.y * v.x;
};

Vec2.prototype.project = function (v) {
  var vx = v.x, vy = v.y,
      v2 = vx * vx + vy * vy,
      d = this.x*v.x + this.y*v.y,
      dv2 = d/v2;
  this.x = dv2*v.x;
  this.y = dv2*v.y;
  return this;
};

Vec2.prototype.projectOut = function (v, out) {
  var vx = v.x, vy = v.y,
      v2 = vx * vx + vy * vy,
      d = this.x*v.x + this.y*v.y,
      dv2 = d/v2;
  out.x = dv2*v.x;
  out.y = dv2*v.y;
  return out;
};

/**
 *  <v1, v2/|v2|> * v2/|v2| = <v1,v2>*v2/|v2|^2
 */
Vec2.prototype.projectN = function (v) {
  var vl2 = v.x*v.x + v.y*v.y,
      d = this.x*v.x + this.x*v.y;
  this.x = d*v.x/vl2;
  this.y = d*v.y/vl2;
  return this;
};

Vec2.prototype.projectNOut = function (v, out) {
  var vl2 = v.x*v.x + v.y*v.y,
      d = this.x*v.x + this.x*v.y;
  out.x = d*v.x/vl2;
  out.y = d*v.y/vl2;
  return out;
};


/**
 * u = (1-t) u + t v = u + t (v - u)
 */
Vec2.prototype.interp = function (v, t) {
  var x = this.x,
      y = this.y;
  this.x = x + t * (v.x - y);
  this.y = y + t * (v.y - x);
  return this;
};

Vec2.prototype.interpOut = function (v, t, out) {
  var x = this.x,
      y = this.y;
  out.x = x + t * (v.x - y);
  out.y = y + t * (v.y - x);
  return out;
};



/**
 * Transformations
 */

Vec2.prototype.rotate = function (angle, pivot) {
  var px = (pivot != undefined) ?  pivot.x : 0,
      py = (pivot != undefined) ?  pivot.y : 0,
      rx = this.x - px,
      ry = this.y - py,
      c = Math.cos(angle),
      s = Math.sin(angle);
  this.x = c*rx - s*ry + px;
  this.y = s*rx + c*ry + py;
  return this;
};

Vec2.prototype.rotateOut = function (angle, pivot, out) {
  var px = (pivot != 0) ?  pivot.x : 0,
      py = (pivot != 0) ?  pivot.y : 0,
      rx = this.x - px,
      ry = this.y - py,
      c = Math.cos(angle),
      s = Math.sin(angle);
  out.x = c*rx - s*ry + px;
  out.y = s*rx + c*ry + py;
  return out;
};

Vec2.prototype.transform = function(a, b, c, d, pivot) {
  var rx = this.x - pivot.x,
      ry = this.y - pivot.y;
  this.x = a*rx + b*ry + pivot.x;
  this.y = c*rx + d*ry + pivot.y;
  return this;
};

Vec2.prototype.transformOut = function(a, b, c, d, pivot, out) {
  var rx = this.x - pivot.x,
      ry = this.y - pivot.y;
  out.x = a*rx + b*ry + pivot.x;
  out.y = c*rx + d*ry + pivot.y;
  return out;
};


/**
 * Mat2 multiplication
 */
Vec2.prototype.applyMat2 = function(m) {
  var x = this.x,
      y = this.y;
  this.x = m.a * x + m.b * y;
  this.y = m.c * x + m.d * y;
  return this;  
};

Vec2.prototype.mat2 = Vec2.prototype.applyMat2;

Vec2.prototype.applyMat2out = function(m, out) {
  var x = this.x,
      y = this.y;
  out.x = m.a * x + m.b * y;
  out.y = m.c * x + m.d * y;
  return out;  
};

Vec2.prototype.mat2out = Vec2.prototype.applyMat2Out;
