/**
 * @author Jonas Ransjö
 */


/**
 * Template for circles
 *
 * @class CircleDef
 * @constructor
 */
function CircleDef(center, radius, color, alpha) {
  // defining properties
  this.centroid = center;
  this.radius = radius;
  this.color = color;
  this.alpha = alpha;

  // calculated properties
  this.area = 0;
  this.inertia = 0;
  this.aabb = new AABB();

  this.computeArea();
  this.computeInertia();
  this.computeAABB();
};

CircleDef.prototype.computeArea = function () {
  this.area = Math.PI * this.radius * this.radius;
};

CircleDef.prototype.computeInertia = function () {
  this.inertia = this.radius * this.radius / 2;
};

CircleDef.prototype.computeAABB = function () {
  this.aabb.min.set(this.centroid.x - this.radius,
                    this.centroid.y - this.radius),
  this.aabb.max.set(this.centroid.x + this.radius,
                    this.centroid.y + this.radius);
};

CircleDef.prototype.createShape = function (position, angle) {
  return new Circle().fromDef(this, position);
};


/**
 * Circle
 *
 * @class Circle
 */
function Circle() {
  this.isCircle = true;
  this.isPolygon = false;

  // working vector
  this.tempV = new Vec2(0, 0);
}
Circle.prototype = Object.create(CircleDef.prototype);

Circle.prototype.clone = CircleDef.prototype.createShape;

Circle.prototype.init = function (center, radius, color, alpha) {
  CircleDef.call(this, center, radius, color, alpha);
  return this;
};

Circle.prototype.fromDef = function (circleDef, position) {
  this.centroid = circleDef.centroid.clone();
  this.radius = circleDef.radius;
  this.area = circleDef.area;
  this.inertia = circleDef.inertia;
  this.aabb = circleDef.aabb.clone();
  
  this.color = circleDef.color;
  this.alpha = circleDef.alpha;
  
  if (position)
    this.moveTo(position);
  return this;
};


/**
 * Transformations
 */
Circle.prototype.translate = function (vector) {
  this.centroid.add(vector);
  this.aabb.translate(vector);
};

Circle.prototype.translateXY = function (x, y) {
  this.tempV.setXY(x, y);
  this.translate(this.tempV);
};

Circle.prototype.rotate = function (angle, pivot) {
  if (pivot) {
    this.centroid.rotate(angle, pivot);
    this.computeAABB();
  }
};

Circle.prototype.scale = function (s) {
  this.radius *= s;
  this.area *= s*s;
  this.inertia *= s*s;
  this.computeAABB();
};

Circle.prototype.moveTo = function (position) {
  this.translate(position.subOut(this.centroid, this.tempV));
};



/**
 * Geometry
 */

Circle.prototype.contains = function (point) {
  return (this.centroid.distance(point) <= this.radius);
};

Circle.prototype.project = function (axis, kPoints) {
  var c = this.centroid.dot(axis);
  kPoints[0] = c - this.radius;
  kPoints[1] = c + this.radius;
};


/**
 * The ray is assumed to be normalized
 */
Circle.prototype.hitByRay = function (ray, points) {
  // let q = p + kv, where ray = p + s*v, s >= 0
  // be the orthogonal projection onto ray of
  // the center of the circle
  var k = ray.project(this.centroid, this.tempV);
  if (k < 0)
    // behind the starting point of ray
    return false;

  var d2 = this.tempV.distSq(this.centroid);
  var r2 = this.radius*this.radius;
  

  if (d2 > r2) {
    // the orthogonal projection is the point on the ray
    // that is closest to the center of the circle
    return false;
  }
  else {
    // the pythagorean theorem
    var rl = ray.r.length();
    var dk = Math.sqrt(this.radius*this.radius - d2)/rl;
    points[0].setXY(ray.p.x + (k+dk)*ray.r.x,
                    ray.p.y + (k+dk)*ray.r.y);
    if (k - dk >= 0) {
      points[1].setXY(ray.p.x + (k-dk)*ray.r.x,
                      ray.p.y + (k-dk)*ray.r.y);
      return points;
    } else
      return [points[0]];
  }
};
