// 定义二维向量类
function Vector(a, b) {
    this.x = a;
    this.y = b;
  }
  
  Vector.prototype = {
    // 向量旋转
    rotate: function (b) {
      var a = this.x;
      var c = this.y;
      this.x = Math.cos(b) * a - Math.sin(b) * c;
      this.y = Math.sin(b) * a + Math.cos(b) * c;
      return this;
    },
    // 向量缩放
    mult: function (a) {
      this.x *= a;
      this.y *= a;
      return this;
    },
    // 复制向量
    clone: function () {
      return new Vector(this.x, this.y);
    },
    // 计算向量长度
    length: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    // 从另一个向量中减去当前向量
    subtract: function (a) {
      this.x -= a.x;
      this.y -= a.y;
      return this;
    },
    // 设置向量的坐标
    set: function (a, b) {
      this.x = a;
      this.y = b;
      return this;
    },
  };
  
  // 定义花瓣类
  function Petal(a, f, b, e, c, d) {
    this.stretchA = a; // 拉伸系数A
    this.stretchB = f; // 拉伸系数B
    this.startAngle = b; // 起始角度
    this.angle = e; // 角度
    this.bloom = d; // 所属的花
    this.growFactor = c; // 生长因子
    this.r = 1; // 半径
    this.isfinished = false; // 是否完成生长
  }
  
  Petal.prototype = {
    // 绘制花瓣
    draw: function () {
      var a = this.bloom.garden.ctx;
      var e, d, c, b;
      e = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
      d = e.clone().rotate(Garden.degrad(this.angle));
      c = e.clone().mult(this.stretchA);
      b = d.clone().mult(this.stretchB);
      a.strokeStyle = this.bloom.c;
      a.beginPath();
      a.moveTo(e.x, e.y);
      a.bezierCurveTo(c.x, c.y, b.x, b.y, d.x, d.y);
      a.stroke();
    },
    // 渲染花瓣
    render: function () {
      if (this.r <= this.bloom.r) {
        this.r += this.growFactor;
        this.draw();
      } else {
        this.isfinished = true;
      }
    },
  };
  
  // 定义花朵类
  function Bloom(e, d, f, a, b) {
    this.p = e; // 中心点位置
    this.r = d; // 花朵半径
    this.c = f; // 花朵颜色
    this.pc = a; // 花瓣数量
    this.petals = []; // 花瓣数组
    this.garden = b; // 所属花园
    this.init(); // 初始化
    this.garden.addBloom(this); // 将花朵添加到花园中
  }
  
  Bloom.prototype = {
    // 绘制花朵
    draw: function () {
      var c, b = true;
      this.garden.ctx.save();
      this.garden.ctx.translate(this.p.x, this.p.y);
      for (var a = 0; a < this.petals.length; a++) {
        c = this.petals[a];
        c.render();
        b *= c.isfinished;
      }
      this.garden.ctx.restore();
      if (b == true) {
        this.garden.removeBloom(this);
      }
    },
    // 初始化花朵，生成花瓣
    init: function () {
      var c = 360 / this.pc;
      var b = Garden.randomInt(0, 90);
      for (var a = 0; a < this.pc; a++) {
        this.petals.push(
          new Petal(
            Garden.random(
              Garden.options.petalStretch.min,
              Garden.options.petalStretch.max
            ),
            Garden.random(
              Garden.options.petalStretch.min,
              Garden.options.petalStretch.max
            ),
            b + a * c,
            c,
            Garden.random(
              Garden.options.growFactor.min,
              Garden.options.growFactor.max
            ),
            this
          )
        );
      }
    },
  };
  
  // 定义花园类
  function Garden(a, b) {
    this.blooms = []; // 花朵数组
    this.element = b;
    this.ctx = a;
  }
  
  Garden.prototype = {
    // 渲染花园中的花朵
    render: function () {
      for (var a = 0; a < this.blooms.length; a++) {
        this.blooms[a].draw();
      }
    },
    // 添加花朵到花园中
    addBloom: function (a) {
      this.blooms.push(a);
    },
    // 从花园中移除花朵
    removeBloom: function (a) {
      var d;
      for (var c = 0; c < this.blooms.length; c++) {
        d = this.blooms[c];
        if (d === a) {
          this.blooms.splice(c, 1);
          return this;
        }
      }
    },
    // 创建随机花朵并添加到花园中
    createRandomBloom: function (a, b) {
      this.createBloom(
        a,
        b,
        Garden.randomInt(
          Garden.options.bloomRadius.min,
          Garden.options.bloomRadius.max
        ),
        Garden.randomrgba(
          Garden.options.color.rmin,
          Garden.options.color.rmax,
          Garden.options.color.gmin,
          Garden.options.color.gmax,
          Garden.options.color.bmin,
          Garden.options.color.bmax,
          Garden.options.color.opacity
        ),
        Garden.randomInt(
          Garden.options.petalCount.min,
          Garden.options.petalCount.max
        )
      );
    },
    // 创建指定参数的花朵并添加到花园中
    createBloom: function (a, f, d, e, b) {
      new Bloom(new Vector(a, f), d, e, b, this);
    },
    // 清空花园
    clear: function () {
      this.blooms = [];
      this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    },
  };
  
  // 花园的默认选项
  Garden.options = {
    petalCount: { min: 8, max: 15 },
    petalStretch: { min: 0.1, max: 3 },
    growFactor: { min: 0.1, max: 1 },
    bloomRadius: { min: 8, max: 10 },
    density: 10,
    growSpeed: 1000 / 60,
    color: {
      rmin: 249,
      rmax: 188,
      gmin: 196,
      gmax: 266,
      bmin: 173,
      bmax: 193,
      opacity: 0.3,
    },
    tanAngle: 60,
  };
  
  // 生成指定范围内的随机数
  Garden.random = function (b, a) {
    return Math.random() * (a - b) + b;
  };
  
  // 生成指定范围内的随机整数
  Garden.randomInt = function (b, a) {
    return Math.floor(Math.random() * (a - b + 1)) + b;
  };
  
  // 圆周率 * 2
  Garden.circle = 2 * Math.PI;
  
  // 将角度转换为弧度
  Garden.degrad = function (a) {
    return (Garden.circle / 360) * a;
  };
  
  // 将弧度转换为角度
  Garden.raddeg = function (a) {
    return (a / Garden.circle) * 360;
  };
  
  // 生成带透明度的颜色字符串
  Garden.rgba = function (f, e, c, d) {
    return "rgba(" + f + "," + e + "," + c + "," + d + ")";
  };
  
  // 生成随机的带透明度的颜色字符串
  Garden.randomrgba = function (i, n, h, m, l, d, k) {
    var c = Math.round(Garden.random(i, n));
    var f = Math.round(Garden.random(h, m));
    var j = Math.round(Garden.random(l, d));
    var e = 5;
    if (Math.abs(c - f) <= e && Math.abs(f - j) <= e && Math.abs(j - c) <= e) {
      return Garden.rgba(i, n, h, m, l, d, k);
    } else {
      return Garden.rgba(c, f, j, k);
    }
  };
  