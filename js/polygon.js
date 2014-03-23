/**
 * @author Jonas Ransjö
 */

/**
 * Tests if the triangle formed by points p1, p2, p3 is oriented counter-clockwise.
 */
function TriangleIsCCW (p1, p2, p3) {
  return (p2.x - p1.x)*(p3.y - p1.y) - (p3.x - p1.x)*(p2.y - p1.y) >= 0;
}

/**
 * Template for polygons
 * A polygon is assumed to be convex and have its vertices oriented clockwise.
 *
 * @class polygonDef
 */
function PolygonDef(vectors, color, alpha) {
  // defining properties
  this.vertices = vectors;
  this.color = color;
  this.alpha = alpha;

  // calculated properties
  this.centroid = new Vec2(0, 0);
  this.radius = 0;
  this.area = 0;
  this.inertia = 0;

  // Calculate static properties
  this.computeCentroid();
  this.computeRadius();
  this.computeArea();
  this.computeInertia();  
};

PolygonDef.prototype.computeCentroid = function () {
  this.centroid.init(0, 0);
  _.forEach(this.vertices, function (vtx) {this.centroid.add(vtx);}, this);
  this.centroid.div(this.vertices.length);
};

PolygonDef.prototype.computeRadius = function () {
  var r2 = 0;
  _.forEach(this.vertices, function (vtx) {
    r2 = Math.max(r2, vtx.distSq(this.centroid));
  }, this);
  this.radius = Math.sqrt(r2);
};

PolygonDef.prototype.computeArea = function () {
  var a = 0;
  var len = this.vertices.length;
  // x0 * (y1 - y-1) = x0 * (y1 - yl)
  a += this.vertices[0].x * (this.vertices[1].y - 
                             this.vertices[len-1].y);
  for (var i = 1; i < len-1; i++) {
    a += this.vertices[i].x * (this.vertices[i+1].y - 
                               this.vertices[i-1].y);
  }
  // xl * (y0 - yl-1)
  a += this.vertices[len-1].x * (this.vertices[0].y -
                                 this.vertices[len-2].y);
  this.area = Math.abs(a/2);
};

PolygonDef.prototype.computeInertia = function () {
  var num = 0;
  var den = 0;
  var len = this.vertices.length;
  var a, b;
  var u = new Vec2(0,0); 
  var v = new Vec2(0,0);
  for (var i = 0, j = len-1; i < len; j = i, i++) {
    this.vertices[i].subOut(this.centroid, u);
    this.vertices[j].subOut(this.centroid, v);
    a = Math.abs(u.cross(v));
    b = u.dot(u) + u.dot(v) + v.dot(v);
    num += a*b;
    den += a;
  }
  this.inertia = (num/den) / 6;
};

PolygonDef.prototype.createShape = function (position, angle) {
  return new Polygon().fromDef(this, position, angle);
};

function RegularPolygonDef(n, radius, color, alpha) {
  var vertices = [];
  var da = Math.PI * 2/n;
  var a = 0;
  for (var i = 0; i < n; i++) {
    vertices.push(new Vec2(radius * Math.cos(a), radius * Math.sin(a)));
    a += da;
  };
  PolygonDef.call(this, vertices, color, alpha);
};
RegularPolygonDef.prototype = Object.create(PolygonDef.prototype);

function RectangleDef(x, y, w, h, color, alpha) {
  var vectors = [new Vec2(x,y), new Vec2(x+w, y),
                 new Vec2(x+w,y+h), new Vec2(x, y+h)];
  PolygonDef.call(this, vectors, color, alpha);
};
RectangleDef.prototype = Object.create(PolygonDef.prototype);

RectangleDef.prototype.createShape = function (position, angle) {
  return new Rectangle().fromDef(this, position, angle);
};


function Polygon() {
  this.isCircle = false;
  this.isPolygon = true;
  
  // working vector
  this.tempV = new Vec2(0, 0);
}
Polygon.prototype = Object.create(PolygonDef.prototype);

Polygon.prototype.clone = PolygonDef.prototype.createShape;

Polygon.prototype.init = function (vectors, color, alpha, position, angle) {
  PolygonDef.call(this, vectors, color, alpha);
  if (position)
    this.moveTo(position);
  if (angle)
    this.rotate(angle);
  return this;
};

Polygon.prototype.fromDef = function (polygonDef, position, angle) {

  // clone definition
  this.vertices = [];
  _.forEach(polygonDef.vertices, function (vtx, i) {
    this.vertices[i] = vtx.clone();
  }, this);

  this.color = polygonDef.color;
  this.alpha = polygonDef.alpha;
  this.centroid = polygonDef.centroid.clone();
  this.radius = polygonDef.radius;
  this.area = polygonDef.area;
  this.inertia = polygonDef.inertia;

  this.edges = [];
  this.normals = [];
  this.aabb = new AABB();

  this.updated = false;

  // initialize stuff
  
  if (position != undefined)
    this.moveTo(position);
  if (angle != undefined)
    this.rotate(angle);

  this.computeAABB();  
  this.computeEdges();
  this.computeNormals();

  return this;
};

Polygon.prototype.computeAABB = function () {
  this.aabb.initMinMax();
  
  _.forEach(this.vertices, function (v) {
    this.aabb.min.setMin(v);
    this.aabb.max.setMax(v);
  }, this);
};

Polygon.prototype.computeEdges = function () {
  var p1, p2;

  this.edges = [];
  for (var i = 0, len = this.vertices.length; i < len; i++) {
    p1 = this.vertices[i];
    p2 = this.vertices[(i+1) % len];
    this.edges.push(new Edge(p1, p2));
  }
};

Polygon.prototype.updateEdges = function () {
  _.forEach(this.edges, function (e) {
    e.update();
  });
};

Polygon.prototype.computeNormals = function () {
  if (this.normals.length == 0)
    for (var j = 0; j < this.edges.length; j++)
      this.normals[j] = new Vec2(0, 0);
  for (var i = 0; i < this.edges.length; i++) {
    this.edges[i].normal(this.normals[i]);
  }
  this.updated = true;
};


/**
 * Transformations
 */
Polygon.prototype.translate = function (vector) {
  this.centroid.add(vector);
  _.forEach(this.vertices, function (vtx) {vtx.add(vector);});
  this.aabb.translate(vector);
};

Polygon.prototype.translateXY = function (x, y) {
  this.tempV.setXY(x, y);
  this.translate(this.tempV);
};

Polygon.prototype.scale = function (s) {
  this.transform(s, 0, 0, s);
};

Polygon.prototype.rotate = function (angle, pivot) {
  var p = this.centroid;
  if (pivot != undefined) {
    this.centroid.rotate(angle, pivot);
    p = pivot;
  }
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var dx, dy;
  _.forEach(this.vertices, function (vtx) {
    dx = vtx.x - p.x;
    dy = vtx.y - p.y;
    vtx.x = c*dx - s*dy + p.x;
    vtx.y = s*dx + c*dy + p.y;
  });
  this.updated = false;
};

Polygon.prototype.moveTo = function (position) {
  this.translate(position.subOut(this.centroid, this.tempV));
};

Polygon.prototype.transform = function (a, b, c, d, o) {
  var p = this.centroid;
  if (o != undefined) {
    this.centroid.transform(a, b, c, d, o);
    p = o;
  }
  _.forEach(this.vertices, function (vtx) {vtx.transform(a, b, c, d, p);});
  this.updated = false;
};

Polygon.prototype.applyMat2 = function (m) {
  _.forEach(this.vertices, function (vtx) {vtx.applyMat2(m);});
    this.updated = false;
};

/**
 * Geometry
 */
Polygon.prototype.project = function (axis, kPoints) {
  var min = this.vertices[0].dot(axis);
  var max = min;

  var p;
  for (var i = 1; i < this.vertices.length; i++) {
    p = this.vertices[i].dot(axis);
    if (p < min)
      min = p;
    else if (p > max)
      max = p;
  }

  kPoints[0] = min;
  kPoints[1] = max;
};

Polygon.prototype.hitByRay = function (ray, points) {
  var idx = 0;
  var res;
  for (var i = 0; i < this.edges.length; i++) {
    res = this.edges[i].hitByRay(ray, points[idx]);
    if(res)
      idx++;
    if (idx > 1)
      // a convex polygon can be hit by a ray at most twice
      break;
  };
  if (idx == 0)
    return false;
  else if (idx == 1)
    return [points[0]];
  else
    return points;
};

/**
 * Based on the algorithm in Real-Time Collision Detection p. 241
 */

Polygon.prototype.contains = function (point) {
  var low = 0, n = this.vertices.length, high = n;
  var mid;

  do {
    mid = ~~((low + high)/2);
    if (TriangleIsCCW(this.vertices[0], this.vertices[mid], point)) {
      low = mid;
    }
    else
      high = mid;
  } while (low + 1 < high);
  
  if (low == 0 || high == n)
    return false;
  
  else
    return TriangleIsCCW(this.vertices[low], this.vertices[high], point);
};

function Triangle() {
  Polygon.call(this);
}
Rectangle.prototype = Object.create(Polygon.prototype);


function Rectangle() {
  Polygon.call(this);
}
Rectangle.prototype = Object.create(Polygon.prototype);

Rectangle.prototype.init = function (x, y, w, h, 
                                     color, alpha, position, angle) {
  RectangleDef.call(this, x, y, w, h, color, alpha);
  if (position)
    this.moveTo(position);
  if (angle)
    this.rotate(angle);
  return this;
};

/*
Rectangle.prototype.computeNormals = function () {
  if (this.normals.length == 0) {
    this.normals[0] = new Vec2(0, 0);
    this.normals[1] = new Vec2(0, 0);
  }

  this.edges[0].normal(this.normals[0]);  
  this.edges[1].normal(this.normals[1]);  
};
*/

Rectangle.prototype.getX = function () {return this.vertices[0].x;};
Rectangle.prototype.getY = function () {return this.vertices[0].y;};
Rectangle.prototype.getWidth = function () {return this.vertices[1].x - this.vertices[0].x;};
Rectangle.prototype.getHeight = function () {return this.vertices[3].y - this.vertices[0].y;};

