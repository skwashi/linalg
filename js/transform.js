/**
 * Representation of affine 2d rotations
 *
 * @class Transform
 */
function Transform () {
}

Transform.prototype.init = function (x, y, angle) {
  this.tv = new Vec2(x, y); 
  this.c = Math.cos(angle);
  this.s = Math.sin(angle);
  return this;
};

Transform.prototype.setXY = function (x, y) {
  this.tv.x = x;
  this.tv.y = y;
  return this;
};
  
Transform.prototype.setPos = function (pos) {
  this.tv.setV(pos); 
  return this;
};
  
Transform.prototype.setAngle = function (angle) {
  this.c = Math.cos(angle); 
  this.s = Math.sin(angle); 
  return this;
};
  
Transform.prototype.set = function (pos, angle) {
  this.tv = pos; 
  this.c = Math.cos(angle); 
  this.s = Math.sin(angle); 
  return this;
};

Transform.prototype.addTranslation = function (v) {
  this.tv.add(v);
  return this;
};

Transform.prototype.addTv = Transform.prototype.addTranslation;

/**
 * cos (a + b) = cos a cos b - sin a sin b
 */
Transform.prototype.addAngle = function (angle) {
  var c = this.c, s = this.s,
      ac = Math.cos(angle), as = Math.sin(angle);
  this.c = c*ac - s*as;
  this.s = c*as + s*ac;
  return this;
};

Transform.prototype.addA = Transform.prototype.addAngle;

Transform.prototype.multiply = function (trans) {
  var c = this.c, s = this.s,
      tc = trans.c, ts = trans.s,
      x = this.tv.x, y = this.tv.y,
      tx = trans.tv.x, ty = trans.tv.y;
  trans.c = c*tc - s*ts;
  trans.s = c*ts + s*tc;
  trans.tv.x = (c * tx - s * ty) + x;
  trans.tv.y = (s * tx + c * ty) + y;
  return trans;
};

Transform.prototype.mul = Transform.prototype.multiply;

Transform.prototype.multiplyOut = function (trans, out) {
  var c = this.c, s = this.s,
      tc = trans.c, ts = trans.s,
      x = this.tv.x, y = this.tv.y,
      tx = trans.tv.x, ty = trans.tv.y;
  out.c = c*tc - s*ts;
  out.s = c*ts + s*tc;
  out.tv.x = (c * tx - s * ty) + x;
  out.tv.y = (s * tx + c * ty) + y;
  return out;
};

Transform.prototype.mulOut = Transform.prototype.multiplyOut;

Transform.prototype.multiplyI = function (trans) {
  var c = this.c, s = -this.s,
      tc = trans.c, ts = trans.s,
      x = -this.tv.x, y = -this.tv.y,
      tx = trans.tv.x, ty = trans.tv.t;
  trans.c = c*tc - s*ts;
  trans.s = c*ts + s*tc;
  trans.tv.x = (c * tx - s * ty) + x;
  trans.tv.y = (s * tx + c * ty) + y;
  return trans;
};

Transform.prototype.mulI = Transform.prototype.multiplyI;

Transform.prototype.multiplyIOut = function (trans, out) {
  var c = this.c, s = -this.s,
      tc = trans.c, ts = trans.s,
      x = -this.tv.x, y = -this.tv.y,
      tx = trans.tv.x, ty = trans.tv.y;
  out.c = c*tc - s*ts;
  out.s = c*ts + s*tc;
  out.tv.x = (c * tx - s * ty) + x;
  out.tv.y = (s * tx + c * ty) + y;
  return out;
};

Transform.prototype.mulIOut = Transform.prototype.multiplyIOut;

Transform.prototype.invert = function () {
  this.tv.negate(); 
  this.s = -this.s;
  return this;
};

Transform.prototype.invertOut = function (out) {
  this.tv.negateOut(out);
  out.c = this.c;
  out.s = -this.s;
  return out;
};

Transform.prototype.apply = function (v) {
  var vx = v.x, vy = v.y;
  v.x = (this.c * vx - this.s * vy) + this.tv.x;
  v.y = (this.s * vx + this.c * vy) + this.tv.y;
  return v;
};

Transform.prototype.applyOut = function (v, out) {
  var vx = v.x, vy = v.y;
  out.x = (this.c * vx - this.s * vy) + this.tv.x;
  out.y = (this.s * vx + this.c * vy) + this.tv.y;
  return out;
};

Transform.prototype.applyI = function (v) {
  var vx = v.x, vy = v.y;
  v.x = (this.c*vx + this.s*vy) - this.tv.x;
  v.y = (-this.s*vx + this.c*vy) - this.tv.y;
  return v;
};

Transform.prototype.applyIOut = function (v, out) {
  var vx = v.x, vy = v.y;
  out.x = (this.c*vx + this.s*vy) - this.tv.x;
  out.y = (-this.s*vx + this.c*vy) - this.tv.y;
  return out;
};

