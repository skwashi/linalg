/**
 * Represents edges between vertices in a polygon
 *
 * @class edge
 */
function Edge(p, q) {
  Ray.call(this, p, new Vec2(q.x - p.x, q.y - p.y));
  this.q = q;
};
Edge.prototype = Object.create(Ray.prototype);

Edge.prototype.update = function () {
  this.q.subOut(this.p, this.r);
};

Edge.prototype.vector = function () {
  return this.r;
};

Edge.prototype.length = function () {
  return this.r.length();
};

Edge.prototype.normal = function (out) {
  this.r.unitNormal2(out);
};

Edge.prototype.hitByRay = function (ray, point) {
  var l = Ray.prototype.hitByRay.call(this, ray, point);
  return (0 <= l && l <= 1) ? l : false;
};
