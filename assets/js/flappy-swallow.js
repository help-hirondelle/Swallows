(function () {
  var root = document.querySelector("[data-swallow-game]");
  if (!root) {
    return;
  }

  var canvas = root.querySelector("[data-game-canvas]");
  var startButton = root.querySelector("[data-game-start]");
  var restartButton = root.querySelector("[data-game-restart]");
  var statusNode = root.querySelector("[data-game-status]");
  var scoreNode = root.querySelector("[data-game-score]");
  var bestNode = root.querySelector("[data-game-best]");

  if (!canvas || !startButton || !restartButton || !statusNode || !scoreNode || !bestNode) {
    return;
  }

  var context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  var width = canvas.width;
  var height = canvas.height;

  var gravity = 900;
  var flapVelocity = -320;
  var pipeWidth = 68;
  var pipeGap = 130;
  var pipeSpeed = 190;
  var spawnIntervalMs = 1400;

  var bird = {
    x: Math.floor(width * 0.24),
    y: Math.floor(height * 0.5),
    radius: 12,
    velocity: 0
  };

  var pipes = [];
  var score = 0;
  var best = 0;
  var phase = "idle";
  var spawnTimer = 0;
  var animationFrameId = 0;
  var lastTick = 0;

  function loadBestScore() {
    try {
      var stored = window.localStorage.getItem("flappy-swallow-best");
      var parsed = stored ? Number(stored) : 0;
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        best = Math.max(0, Math.floor(parsed));
      }
    } catch (error) {
      best = 0;
    }
  }

  function saveBestScore() {
    try {
      window.localStorage.setItem("flappy-swallow-best", String(best));
    } catch (error) {
      // Ignore storage failures; gameplay still works.
    }
  }

  function updateHud() {
    scoreNode.textContent = String(score);
    bestNode.textContent = String(best);
  }

  function setStatus(text) {
    statusNode.textContent = text;
  }

  function randomGapCenter() {
    var min = 86;
    var max = height - 86;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function resetRound() {
    bird.y = Math.floor(height * 0.5);
    bird.velocity = 0;
    pipes = [];
    score = 0;
    spawnTimer = 0;
    updateHud();
  }

  function beginGame() {
    resetRound();
    phase = "playing";
    setStatus("Flying...");
    if (!animationFrameId) {
      lastTick = 0;
      animationFrameId = window.requestAnimationFrame(loop);
    }
  }

  function gameOver() {
    phase = "gameover";
    if (score > best) {
      best = score;
      saveBestScore();
    }
    updateHud();
    setStatus("Game over. Press Restart or Space to try again.");
  }

  function flap() {
    if (phase === "idle") {
      beginGame();
    }

    if (phase === "gameover") {
      beginGame();
    }

    if (phase === "playing") {
      bird.velocity = flapVelocity;
    }
  }

  function spawnPipe() {
    var gapCenter = randomGapCenter();
    pipes.push({
      x: width + 24,
      width: pipeWidth,
      gapTop: gapCenter - pipeGap / 2,
      gapBottom: gapCenter + pipeGap / 2,
      counted: false
    });
  }

  function detectCollision(pipe) {
    var overlapsX = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipe.width;
    if (!overlapsX) {
      return false;
    }

    var hitsTop = bird.y - bird.radius < pipe.gapTop;
    var hitsBottom = bird.y + bird.radius > pipe.gapBottom;
    return hitsTop || hitsBottom;
  }

  function update(deltaSeconds) {
    if (phase !== "playing") {
      return;
    }

    bird.velocity += gravity * deltaSeconds;
    bird.y += bird.velocity * deltaSeconds;

    spawnTimer += deltaSeconds * 1000;
    if (spawnTimer >= spawnIntervalMs) {
      spawnTimer -= spawnIntervalMs;
      spawnPipe();
    }

    for (var i = 0; i < pipes.length; i += 1) {
      var pipe = pipes[i];
      pipe.x -= pipeSpeed * deltaSeconds;

      if (!pipe.counted && pipe.x + pipe.width < bird.x) {
        pipe.counted = true;
        score += 1;
        updateHud();
      }

      if (detectCollision(pipe)) {
        gameOver();
      }
    }

    pipes = pipes.filter(function (pipe) {
      return pipe.x + pipe.width > -6;
    });

    var hitTopBoundary = bird.y - bird.radius < 0;
    var hitBottomBoundary = bird.y + bird.radius > height;
    if (hitTopBoundary || hitBottomBoundary) {
      gameOver();
    }
  }

  function drawBackdrop() {
    var gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#edf9f2");
    gradient.addColorStop(1, "#d7efdf");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = "#c4e7d0";
    context.beginPath();
    context.arc(width * 0.16, height * 0.2, 28, 0, Math.PI * 2);
    context.arc(width * 0.2, height * 0.2, 20, 0, Math.PI * 2);
    context.arc(width * 0.24, height * 0.2, 24, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#b4ddc2";
    context.fillRect(0, height - 26, width, 26);
  }

  function drawPipes() {
    context.fillStyle = "#2f7851";
    context.strokeStyle = "#1c5034";
    context.lineWidth = 2;

    pipes.forEach(function (pipe) {
      var topHeight = pipe.gapTop;
      var bottomY = pipe.gapBottom;
      var bottomHeight = height - pipe.gapBottom;

      context.fillRect(pipe.x, 0, pipe.width, topHeight);
      context.strokeRect(pipe.x, 0, pipe.width, topHeight);

      context.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);
      context.strokeRect(pipe.x, bottomY, pipe.width, bottomHeight);
    });
  }

  function drawBird() {
    context.save();
    context.translate(bird.x, bird.y);
    context.rotate(Math.max(-0.4, Math.min(0.6, bird.velocity / 520)));

    context.fillStyle = "#163828";
    context.beginPath();
    context.ellipse(0, 0, bird.radius + 2, bird.radius - 1, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#f1f7f3";
    context.beginPath();
    context.ellipse(-1, 1, bird.radius - 6, bird.radius - 7, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#2c6948";
    context.beginPath();
    context.moveTo(-2, -2);
    context.quadraticCurveTo(-15, -14, -20, 3);
    context.quadraticCurveTo(-9, 0, -2, -2);
    context.fill();

    context.fillStyle = "#0f291c";
    context.beginPath();
    context.moveTo(bird.radius + 1, -1);
    context.lineTo(bird.radius + 8, 1);
    context.lineTo(bird.radius + 1, 4);
    context.closePath();
    context.fill();

    context.fillStyle = "#0e2117";
    context.beginPath();
    context.arc(bird.radius - 3, -3, 1.7, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  function drawOverlay() {
    if (phase === "playing") {
      return;
    }

    context.fillStyle = "rgba(19, 49, 34, 0.14)";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "#0f281b";
    context.font = "700 22px Karla, sans-serif";
    context.textAlign = "center";

    if (phase === "idle") {
      context.fillText("Press Start or Space", width / 2, height / 2 - 10);
      context.font = "500 15px Karla, sans-serif";
      context.fillText("Avoid pipes and keep the swallow in the air.", width / 2, height / 2 + 20);
      return;
    }

    context.fillText("Game over", width / 2, height / 2 - 10);
    context.font = "500 15px Karla, sans-serif";
    context.fillText("Press Restart or Space to play again.", width / 2, height / 2 + 20);
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    drawBackdrop();
    drawPipes();
    drawBird();
    drawOverlay();
  }

  function loop(timestamp) {
    if (!lastTick) {
      lastTick = timestamp;
    }

    var deltaSeconds = Math.min(0.032, (timestamp - lastTick) / 1000);
    lastTick = timestamp;

    update(deltaSeconds);
    draw();

    animationFrameId = window.requestAnimationFrame(loop);
  }

  function onKeyboardInput(event) {
    var key = event.key;
    var isFlapKey = key === " " || key === "Spacebar" || key === "ArrowUp";
    if (!isFlapKey) {
      return;
    }

    var tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") {
      return;
    }

    event.preventDefault();
    flap();
  }

  function onPointerInput(event) {
    event.preventDefault();
    flap();
  }

  function preventGameDoubleTapZoom() {
    var lastTouchEndMs = 0;

    root.addEventListener("dblclick", function (event) {
      event.preventDefault();
    });

    root.addEventListener(
      "touchend",
      function (event) {
        var now = Date.now();
        if (now - lastTouchEndMs < 320) {
          event.preventDefault();
        }
        lastTouchEndMs = now;
      },
      { passive: false }
    );

    root.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
    root.addEventListener("gesturechange", function (event) {
      event.preventDefault();
    });
    root.addEventListener("gestureend", function (event) {
      event.preventDefault();
    });
  }

  startButton.addEventListener("click", beginGame);
  restartButton.addEventListener("click", beginGame);
  canvas.addEventListener("pointerdown", onPointerInput);
  document.addEventListener("keydown", onKeyboardInput);
  preventGameDoubleTapZoom();

  loadBestScore();
  updateHud();
  setStatus("Press Start to play.");
  draw();
})();
