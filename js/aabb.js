/** 
 * @author Jonas Ransjö
 */

/**
 * Axis-aligned bounding box
 *
 * @class AABB
 */
function AABB (min, max) {
  this.min = min || new Vec2(0, 0);
  this.max = max || new Vec2(0, 0);
};

AABB.prototype.clone = function () {
  return new AABB(this.min.clone(), this.max.clone());
};

AABB.prototype.set = function (aabb) {
  this.min.setV(aabb.min);
  this.max.setV(aabb.max);
  return this;
};

AABB.prototype.getX = function () {
  return this.min.x;
};

AABB.prototype.getY = function () {
  return this.min.y;
};

AABB.prototype.getWidth = function () {
  return this.max.x - this.min.x;
};

AABB.prototype.getHeight = function () {
  return this.max.y - this.min.y;
};

AABB.prototype.initMinMax = function () {
  this.min.set(Number.MAX_VALUE, Number.MAX_VALUE);
  this.max.set(-Number.MAX_VALUE, -Number.MAX_VALUE);
};

AABB.prototype.expand = function (aabb) {
  this.min.setMin(aabb.min);
  this.max.setMax(aabb.max);
  return this;
};

AABB.prototype.translate = function (vector) {
  this.min.add(vector);
  this.max.add(vector);
  return this;
};

AABB.prototype.contains = function (point) {
  return !(point.x > this.max.x || point.x < this.min.x ||
           point.y > this.max.y || point.y < this.min.y);
};

AABB.prototype.intersects = function (aabb) {
  return !(aabb.min.gt(this.max) ||
           aabb.max.lt(this.min));
};
