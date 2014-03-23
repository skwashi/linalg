var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cr = new CanvasRenderer(ctx);

var cdef = new CircleDef(new Vec2(0, 0), 10, "red");

var c1 = cdef.createShape(new Vec2(190, 180));
var c2 = new Circle().init(new Vec2(30, 30), 20, "blue");
var c3 = new Circle().fromDef(cdef, new Vec2(100, 100));


var v1 = new Vec2(0, 0);
var v2 = new Vec2(0, 0);
var r1 = new Ray(new Vec2(30,30), new Vec2(1,1));
var r2 = new Ray(new Vec2(300, 200), new Vec2(-1,0));

var p = new Vec2(200, 70);
var q = new Vec2(50, 300);
var e = new Edge(p, q);

var pdef = new PolygonDef([new Vec2(0,0), new Vec2(50, 0), new Vec2(50, 50)], "blue");
var poly = pdef.createShape(new Vec2(115, 145));

var shapes = [c1, c2, c3, poly];
var rays = [r1, r2, e];


var pts = [new Vec2(0,0), new Vec2(0,0)];
var res;


var point = new Vec2(165, 145);

requestAnimationFrame(render);

var t = 0.5;
var total = 0;
r1.rotate(-Math.PI/16);
function render () {
  total += t;
  if (Math.abs(total) > 80) {
    t = -t;
    total = 0;
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  c1.translateXY(0, t/2);
  poly.translateXY(t, 0);
  poly.rotate(Math.PI/4 / 60);
  poly.updateEdges();
  poly.computeNormals();

  r1.rotate(t*Math.PI/620);

  cr.drawRay(r1);
  cr.drawRay(r2);
  cr.drawEdge(e);

  _.forEach(shapes, function (s) {
    cr.drawShape(s);
  });

  _.forEach(rays, function (r) {
    cr.drawRay(r);
  });

  if (poly.contains(point))
    cr.drawPoint(point, "red");
  else
    cr.drawPoint(point, "green");

  _.forEach(rays, function (r) {
    _.forEach(shapes, function (s) {
      res = s.hitByRay(r, pts);
      cr.ctx.fillStyle = s.color == "blue" ? "red" : "blue";
      if (res)
        _.forEach(res, function(pt) {cr.drawPoint(pt);});
    });
  });

  requestAnimationFrame(render);
}
