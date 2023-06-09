var score = 0;
let gameOver = false;
let gamePaused = false;
let spaceShip = document.getElementById("spaceShip");
const obstaclesArray = [];
const restartGame = () => {
  score = 0;
  document.body.innerHTML =
    "<div id='score' class='score'>SCORE: 0</div><div id='spaceShip' class='spaceShip' />";
  start = setInterval(createObstacle, 40);
  spaceShip = document.getElementById("spaceShip");

  // Get the center coordinates of the screen
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Set the spaceShip's transform property to center it on the screen
  spaceShip.style.transform = `translate(${centerX}px, ${centerY}px)`;
  moveWithKeyboard(spaceShip, 30);
};

const createObstacle = () => {
  if (!gamePaused) {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style["margin-top"] = `${Math.random() * window.innerHeight}px`;
    obstacle.style.left = window.innerWidth + "px";
    document.body.appendChild(obstacle);
    obstaclesArray.push(obstacle);

    score += 1;
    document.getElementById("score").innerText = `SCORE: ${score}`;

    let obstaclePos = window.innerWidth;

    const moveObstacle = () => {
      if (!gamePaused) {
        obstaclePos -= 8;
        obstacle.style.transform = `translateX(${obstaclePos}px)`;

        if (obstacle.getBoundingClientRect().left <= 0) {
          obstacle.remove();
          obstaclesArray.shift();
          return;
        }
      }
      requestAnimationFrame(moveObstacle);
    };

    requestAnimationFrame(moveObstacle);
  }
};

let start = setInterval(createObstacle, 40);

function moveWithMouse(event) {
  var x = event.clientX;
  var y = event.clientY;
  var margin = 20;

  // Check if the cursor is within the playing area with the margin
  if (
    x > margin &&
    y > margin &&
    x < window.innerWidth - margin &&
    y < window.innerHeight - margin
  ) {
    if (gamePaused) {
      gamePaused = false;
      start = setInterval(createObstacle, 40);
    }
    spaceShip.style.transform = "translate(" + x + "px, " + y + "px)";
  } else {
    if (!gamePaused) {
      gamePaused = true;
      clearInterval(start);
    }
  }
}

const checkCollision = () => {
  if (!gamePaused) {
    let circlePosition = checkPosition(spaceShip);
    obstaclesArray.forEach((el) => {
      if (
        circlePosition.left >= checkPosition(el).left - 20 &&
        circlePosition.left <= checkPosition(el).left + 20 &&
        circlePosition.right >= checkPosition(el).right - 20 &&
        circlePosition.right <= checkPosition(el).right + 20
      ) {
        document.body.innerHTML = `<div id='score' class='score'>SCORE: 
      ${score}</div><div class="game-over">GAME OVER<div id="restart" class="restart">RESTART</div></div>`;

        clearInterval(start);
        document.getElementById("restart").addEventListener("click", () => {
          restartGame();
          document.body.requestFullscreen();
        });
      }
    });
  }
};

document.addEventListener("mousemove", moveWithMouse);
document.addEventListener("mousemove", checkCollision);
document.addEventListener("keydown", checkCollision);

function checkPosition(elem) {
  return {
    left: Math.round(elem.getBoundingClientRect().left + 15),
    right: Math.round(elem.getBoundingClientRect().top + 15),
  };
}
