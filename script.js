var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;

function init() {
  // create a new stage and point it at our canvas:
  canvas = document.getElementById("testCanvas");
  stage = new createjs.Stage(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var w = canvas.width;
  var h = canvas.height;

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  // Create a large number of butterfly shapes with random positions and velocities:
  for (var i = 0; i < 100; i++) {
    var butterfly = new createjs.Shape();
    butterfly.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30));

    // Drawing a more defined butterfly shape with wings and a body
    butterfly.graphics.moveTo(0, 0)
      .curveTo(-50, -50, -70, -30)   // Left upper wing
      .curveTo(-90, -10, -50, 20)    // Left bottom wing
      .curveTo(-40, 40, 0, 30)       // Center body
      .curveTo(40, 40, 50, 20)       // Right bottom wing
      .curveTo(90, -10, 70, -30)     // Right upper wing
      .curveTo(50, -50, 0, 0);       // Back to center

    butterfly.y = -100;

    container.addChild(butterfly);
  }

  var text = new createjs.Text("Happy Birthday To You!!!\n SANA \n !!!!زمینی شدنت مبارککک", "bold 24px Arial", "#312");
  text.textAlign = "center";
  text.x = w / 2;
  text.y = h / 2 - text.getMeasuredLineHeight();
  stage.addChild(text);

  for (i = 0; i < 100; i++) {
    var captureContainer = new createjs.Container();
    captureContainer.cache(0, 0, w, h);
    captureContainers.push(captureContainer);
  }

  // start the tick and point it at the window so we can do some work before updating the stage:
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);
}

function tick(event) {
  var w = canvas.width;
  var h = canvas.height;
  var l = container.numChildren;

  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(0);
  var captureContainer = captureContainers[captureIndex];
  stage.addChildAt(captureContainer, 0);
  captureContainer.addChild(container);

  // Iterate through all the children and move them according to their velocity:
  for (var i = 0; i < l; i++) {
    var butterfly = container.getChildAt(i);
    if (butterfly.y < -50) {
      butterfly._x = Math.random() * w;
      butterfly.y = h * (1 + Math.random()) + 50;
      butterfly.perX = (1 + Math.random() * 2) * h;
      butterfly.offX = Math.random() * h;
      butterfly.ampX = butterfly.perX * 0.1 * (0.15 + Math.random());
      butterfly.velY = -Math.random() * 2 - 1;
      butterfly.scale = Math.random() * 2 + 1;
      butterfly._rotation = Math.random() * 40 - 20;
      butterfly.alpha = Math.random() * 0.75 + 0.05;
      butterfly.compositeOperation = Math.random() < 0.33 ? "lighter" : "source-over";
    }
    var int = (butterfly.offX + butterfly.y) / butterfly.perX * Math.PI * 2;
    butterfly.y += butterfly.velY * butterfly.scaleX / 2;
    butterfly.x = butterfly._x + Math.cos(int) * butterfly.ampX;
    butterfly.rotation = butterfly._rotation + Math.sin(int) * 30;
  }

  captureContainer.updateCache("source-over");

  // Draw the updates to stage:
  stage.update(event);
}

init();
