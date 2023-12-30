// 定义全局变量
var $window = $(window),
  gardenCtx,
  gardenCanvas,
  $garden,
  garden;

// 获取窗口宽度和高度
var clientWidth = $(window).width();
var clientHeight = $(window).height();

// 页面加载完成后执行的函数
$(function () {
  // 获取页面中的元素
  $loveHeart = $("#loveHeart");
  $garden = $("#garden");

  // 初始化花园画布
  gardenCanvas = $garden[0];
  gardenCanvas.width = $("#loveHeart").width();
  gardenCanvas.height = $("#loveHeart").height();
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);

  // 设置页面布局
  $("#content").css("width", $loveHeart.width() + $("#code").width());
  $("#content").css(
    "height",
    Math.max($loveHeart.height(), $("#code").height())
  );
  $("#content").css(
    "margin-top",
    Math.max(($window.height() - $("#content").height()) / 2, 10)
  );
  $("#content").css(
    "margin-left",
    Math.max(($window.width() - $("#content").width()) / 2, 10)
  );

  // 定时调用garden的render方法，实现花朵的生长效果
  setInterval(function () {
    garden.render();
  }, Garden.options.growSpeed);
});

// 窗口大小变化时的事件处理
$(window).resize(function () {
  var b = $(window).width();
  var a = $(window).height();
  if (b != clientWidth && a != clientHeight) {
    // 重新加载页面，防止布局错乱
    location.replace(location);
  }
});

// 根据参数t获取心形上的点的坐标
function getHeartPoint(t) {
  var r = t / Math.PI;
  var x = 19.5 * (16 * Math.pow(Math.sin(r), 3));
  var y = -20 * (13 * Math.cos(r) - 5 * Math.cos(2 * r) - 2 * Math.cos(3 * r) - Math.cos(4 * r));
  return new Array(offsetX + x, offsetY + y);
}

// 开始心形动画
function startHeartAnimation() {
  var time = 50;
  var interval = 10;
  var points = [];

  var timer = setInterval(function () {
    var currentPoint = getHeartPoint(interval);
    var valid = true;

    // 判断新生成的点是否与已有的点过于靠近
    for (var i = 0; i < points.length; i++) {
      var existingPoint = points[i];
      var distance = Math.sqrt(Math.pow(existingPoint[0] - currentPoint[0], 2) + Math.pow(existingPoint[1] - currentPoint[1], 2));
      if (distance < Garden.options.bloomRadius.max * 1.3) {
        valid = false;
        break;
      }
    }

    // 如果新点有效，则将其添加到数组中，并在花园中创建随机花朵
    if (valid) {
      points.push(currentPoint);
      garden.createRandomBloom(currentPoint[0], currentPoint[1]);
    }

    // 达到一定条件后停止动画，显示消息
    if (interval >= 30) {
      clearInterval(timer);
      showMessages();
    } else {
      interval += 0.2;
    }
  }, time);
}

// jQuery插件，实现打字机效果
(function ($) {
  $.fn.typewriter = function () {
    this.each(function () {
      var $ele = $(this),
        content = $ele.html(),
        index = 0;

      $ele.html("");

      var typing = setInterval(function () {
        var char = content.substr(index, 1);

        if (char == "<") {
          index = content.indexOf(">", index) + 1;
        } else {
          index++;
        }

        $ele.html(content.substring(0, index) + (index & 1 ? "_" : ""));

        if (index >= content.length) {
          clearInterval(typing);
        }
      }, 75);
    });

    return this;
  };
})(jQuery);

// 计算时间差，更新显示
function timeElapse(date) {
  var currentDate = Date();
  var seconds = (Date.parse(currentDate) - Date.parse(date)) / 1000;
  var days = Math.floor(seconds / (3600 * 24));
  seconds = seconds % (3600 * 24);
  var hours = Math.floor(seconds / 3600);
  if (hours < 10) {
    hours = "0" + hours;
  }
  seconds = seconds % 3600;
  var minutes = Math.floor(seconds / 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  seconds = seconds % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // 更新页面上的时间显示
  var timeString =
    '<span class="digit">' +
    days +
    '</span> days <span class="digit">' +
    hours +
    '</span> hours <span class="digit">' +
    minutes +
    '</span> minutes <span class="digit">' +
    seconds +
    "</span> seconds";
  $("#elapseClock").html(timeString);
}

// 显示消息区域
function showMessages() {
  $("#messages").fadeIn(5000, function () {
    showLoveU();
  });
}

// 调整文字位置
function adjustWordsPosition() {
  $("#words").css("position", "absolute");
  $("#words").css("top", $("#garden").position().top + 400);
  $("#words").css("left", $("#garden").position().left + 70);
}

// //调整代码区域位置
// function adjustCodePosition() {
//   $("#code").css("margin-top", ($("#code").height()) / 1000);
// }
function adjustCodePosition() {
  var gardenTop = ($("#code").height()) / 2;
  $("#garden").css("margin-top", gardenTop);
}



// 显示"Love U"信息
function showLoveU() {
  $("#loveu").fadeIn(3000);
}
