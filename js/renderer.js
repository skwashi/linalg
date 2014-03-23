function CanvasRenderer (ctx) {
  this.ctx = ctx;  
}

CanvasRenderer.prototype.drawPoint = function (point, color, size) {
  if (color)
    this.ctx.fillStyle = color;
  if (size)
    this.ctx.fillRect(point.x-size/2, point.y-size/2, size, size);
  else
    this.ctx.fillRect(point.x-2, point.y-2, 4, 4);
};

CanvasRenderer.prototype.drawVector = function (vector, color, point) {
  if (color)
    this.ctx.fillStyle = color;
  this.ctx.beginPath();
  if (point)
    this.ctx.moveTo(point.x, point.y);
  else
    this.ctx.moveTo(0, 0);
  this.ctx.lineTo(vector.x, vector.y);
  this.ctx.stroke();
};

CanvasRenderer.prototype.drawRay = function (ray, len, color) {
  if (!len)
    var len = 250;
  if (color)
    this.ctx.fillStyle = color;
  this.ctx.fillRect(ray.p.x - 2, ray.p.y - 2, 4, 4);
  this.ctx.beginPath();
  this.ctx.moveTo(ray.p.x, ray.p.y);
  ctx.lineTo(ray.p.x + len*ray.r.x,
             ray.p.y + len*ray.r.y);
  ctx.stroke();
};

CanvasRenderer.prototype.drawEdge = function (edge, color) {
  this.ctx.fillStyle = color || "black";
  this.ctx.beginPath();
  this.ctx.moveTo(edge.p.x, edge.p.y);
  this.ctx.lineTo(edge.q.x, edge.q.y);
  this.ctx.stroke();
};

CanvasRenderer.prototype.drawAABB = function (aabb, color) {
  if (color)
    this.ctx.fillStyle = color;
  this.ctx.fillRect(aabb.min.x, aabb.min.y, 
                    aabb.max.x - aabb.min.x,
                    aabb.max.y - aabb.min.y);
};

CanvasRenderer.prototype.drawCircle = function (circle, stroke) {
  this.ctx.beginPath();
  this.ctx.arc(circle.centroid.x, circle.centroid.y,
               circle.radius, 0, 2*Math.PI);
  if (stroke) {
    this.ctx.strokeStyle = "circle.color";
    this.ctx.stroke();
  } else {
    this.ctx.fillStyle = circle.color;  
    this.ctx.fill();
  }
};

CanvasRenderer.prototype.drawPolygon = function (polygon, stroke) {
  this.ctx.beginPath();
  var vtx = polygon.vertices[0];
  this.ctx.moveTo(vtx.x, vtx.y);
  for (var i = 1; i < polygon.vertices.length; i++) {
    this.ctx.lineTo(polygon.vertices[i].x,
                    polygon.vertices[i].y);
  }
  this.ctx.lineTo(vtx.x, vtx.y);
  if (stroke) {
    this.ctx.strokeStyle = polygon.color;
    this.ctx.stroke();
  } else {
    this.ctx.fillStyle = polygon.color;
    this.ctx.fill();
  }
};

CanvasRenderer.prototype.drawPolygonNormals = function (polygon, len) {
  _.forEach(polygon.vertices, function (vtx, i) {
    if (polygon.normals[i] != undefined) {
      this.ctx.beginPath();
      this.ctx.moveTo(vtx.x, vtx.y);
      this.ctx.lineTo(vtx.x + len*polygon.normals[i].x, 
                 vtx.y + len*polygon.normals[i].y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }, this);
};

CanvasRenderer.prototype.drawShape = function (shape, stroke) {
  if (shape.isPolygon)
    this.drawPolygon(shape, stroke);
  else if (shape.isCircle)
    this.drawCircle(shape, stroke);
};
