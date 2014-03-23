/**
 * @class Ray
 */
function Ray(point, vector) {
  this.p = point;
  this.r = vector;
};

Ray.prototype.set = function (point, vector) {
  this.p = point;
  this.r = vector;
};

/**
 * Transformations
 */

Ray.prototype.translate = function (vector) {
  this.p.add(vector);
};

Ray.prototype.translateXY = function (x, y) {
  this.p.addXY(x, y);
};

Ray.prototype.rotate = function (angle) {
  this.r.rotate(angle);
};
/**
 * The orthogonal projection of a point q on the ray
 * q = p + k r + l u, r.u = 0
 * r . (q - p) = r . (kr + lu) = k||r||^2
 * 
 * @method project
 * @param {Vector} q
 * @return {Number} k such that q = p + kv
 */
Ray.prototype.project = function (q, out) {
  q.subOut(this.p, out);
  var k = this.r.dot(out) / this.r.lengthSquared();
  this.p.addSOut(k, this.r, out); 
  return k;
};


/**
 * For rays p + ku and q + l v, 
 *   q + l v = p + k u  <=>
 *   l v - k u = p - q  <=>
 *   u x (l v - k u) = u x (p - q)  <=>
 *   l * u x v = u x (p - q), 
 * and similarly
 *   k * (v x u) = v x (q - p)
 *
 * point is set to the intersection point if one exists
 * @return false if no intersection occurs
 * @return coefficient k such that point = p + ku otherwise
 */
Ray.prototype.hitByRay = function (ray, point) {
  // let this ray be p + k u, the other ray q + l v
  var p = this.p;
  var u = this.r;
  var q = ray.p;
  var v = ray.r;
  // set point temporarily equal to q-p
  q.subOut(p, point);

  var vu = v.cross(u);

  if (fZero(uv))
    // u and v are parallel
    return false;

  var vqp = v.cross(point);
  var uv = -vu;
  // u x (p-q) = -u x (q-p)
  var upq = -u.cross(point); 

  var k = vqp/vu;
  var l = upq/uv;

  if (l < 0 || k < 0)
    // the lines implied by the rays cross
    // behind (one of) the starting points
    return false;
  else {
    u.scaleOut(k, point);
    // point = p + k u
    point.add(p);
    return k;
  }
};
