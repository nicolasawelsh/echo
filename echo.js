// Global Variables ============================================================
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var time, begin, escapeDungeon;
var charX, charY;
var backward, backwardLeftfoot, backwardRightfoot, forward, forwardLeftfoot, forwardRightfoot, left, leftLeftfoot, leftRightfoot, right, rightLeftfoot, rightRightfoot;
var ghostBackward, ghostForward, ghostLeft, ghostRight;
var img;
var doUpdate;
var stepCount;
var key1Vis, key2Vis, key3Vis;
var key1Img, key2Img, key3Img;
var keyCount;
var execute1, execute2, execute3;
var escaped;
var ghost1X, ghost1Y, ghost2X, ghost2Y;
var deltaGhost1;
var deltaGhost2X;
var deltaGhost2Y;
var position;
var ghost1Position, ghost2Position;
var ghost2Path;
var die;

/*
var ghost1Arr = [330];
var ghost2Arr = [132, 327];
*/

// Initiate Program ============================================================
init();

function startButton() {
    init();
}

setInterval(startClock, 1000);
setInterval(updateGhost1, 30);
setInterval(updateGhost2, 16);

document.addEventListener('keydown', function (event) {
    if (escaped == false && die == false) {
        updateCharacter(event);
    }
}
);

function init() {
    time = 0;
    begin = false;
    keyCount = 0;
    key1Vis = true;
    key2Vis = true;
    key3Vis = true;
    escapeDungeon = 0;
    escaped = false;
    charX = 114;
    charY = 540;
    doUpdate = true;
    stepCount = 0;
    execute1 = true;
    execute2 = true;
    execute3 = true;
    ghost1X = 216;
    ghost1Y = 144;
    ghost2X = 681;
    ghost2Y = 474;
    ghost2Path = 1;
    deltaGhost1 = 0;
    deltaGhost2X = 0;
    deltaGhost2Y = 0;
    die = false;
    ghost1Position = function () { ctx.drawImage(ghostBackward, ghost1X, ghost1Y, 35, 40); };
    ghost2Position = function () { ctx.drawImage(ghostLeft, ghost2X, ghost2Y, 35, 40); };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    loadCharacterImages();
    loadGhostImages();

    setupGame();
}


// Stage Functions =============================================================
function setupGame() {
    img = document.createElement('img');
    img.src = "images/backgrounds/echoBackground.png";
    img.onload = function () {
        begin = true;

        ctx.drawImage(img, 0, 0, 800, 600);

        //setInterval(startClock, 1000);
        updateCharacter(null);
        //setInterval(updateGhost1, 100);
        //setInterval(updateGhost2, 50);
        gameLoop();
    };
}

function spawnKeys() {
    key1Img = document.createElement('img');
    key1Img.src = "images/key.png";

    key2Img = document.createElement('img');
    key2Img.src = "images/key.png";

    key3Img = document.createElement('img');
    key3Img.src = "images/key.png";

    if (key1Vis == true) {
        ctx.drawImage(key1Img, 75, 145, 50, 20);
    }

    if (key2Vis == true) {
        ctx.drawImage(key2Img, 275, 345, 50, 20);
    }

    if (key3Vis == true) {
        ctx.drawImage(key3Img, 675, 345, 50, 20);
    }
}

function setupRefreshableStage() {
    roundRect(canvas.width - 170, 10, 160, 60, 5, 20, "Grey");
    textBox("Time: " + time, "Black", "20px Times New Roman", canvas.width - 170 + 80, 30);

    if (keyCount != 3) {
        textBox("Collect The Keys", "Black", "20px Times New Roman", canvas.width - 170 + 80, 60);
    } else {
        textBox("ESCAPE!", "Black", "20px Times New Roman", canvas.width - 170 + 80, 60);
        escapeDungeon = true;
    }
}

function win() {
    console.log("win");
    roundRect(canvas.width / 2 - 200, canvas.height / 2 - 50, 400, 100, 60, 5, 20, "Grey");
    textBox("You escaped the dungeon!", "Red", "30px Times New Roman", canvas.width / 2, canvas.height / 2 - 15);
    textBox("Your time was " + time + " seconds.", "Red", "30px Times New Roman", canvas.width / 2, canvas.height / 2 + 30);
}


// Game Loop ===================================================================
function gameLoop() {
    if (begin == false) {
        return;
    }

    if (escaped == false && die == false) {
        ctx.drawImage(img, 0, 0, 800, 600);

        setupRefreshableStage();
        spawnKeys();
        ghost1Position();
        ghost2Position();
        position();
        handleGhostVsChar();

        requestAnimationFrame(gameLoop);
    }
}


// Interval Functions ==========================================================
function startClock() {
    if (begin == true) {
        time = time + 1;
    }
}

function updateGhost1() {
    if (ghost1Y <= 144) {
        deltaGhost1 = 1;
        ghost1Position = function () { ctx.drawImage(ghostBackward, ghost1X, ghost1Y, 35, 40); };
    }
    if (ghost1Y >= 474) {
        deltaGhost1 = -1;
        ghost1Position = function () { ctx.drawImage(ghostForward, ghost1X, ghost1Y, 35, 40); };
    }

    ghost1Y = ghost1Y + deltaGhost1;
}

function updateGhost2() {
    deltaGhost2X = 0;
    deltaGhost2Y = 0;

    if (ghost2Path == 1) {
        if (ghost2X >= 549 && ghost2X <= 681 && ghost2Y == 474) {
            deltaGhost2X = -1;
            ghost2Position = function () { ctx.drawImage(ghostLeft, ghost2X, ghost2Y, 35, 40); };
        }
        if (ghost2Y >= 147 && ghost2Y <= 474 && ghost2X == 548) {
            deltaGhost2Y = -1;
            ghost2Position = function () { ctx.drawImage(ghostForward, ghost2X, ghost2Y, 35, 40); };
        }
        if (ghost2X >= 548 && ghost2X <= 681 && ghost2Y == 146) {
            deltaGhost2X = 1;
            ghost2Position = function () { ctx.drawImage(ghostRight, ghost2X, ghost2Y, 35, 40); };
        }
        if (ghost2X == 682 && ghost2Y == 146) {
            ghost2Path = 2;
        }
    }
    if (ghost2Path == 2) {
        if (ghost2X >= 548 && ghost2X <= 680 && ghost2Y == 474) {
            deltaGhost2X = 1;
            ghost2Position = function () { ctx.drawImage(ghostRight, ghost2X, ghost2Y, 35, 40); };
        }
        if (ghost2Y >= 146 && ghost2Y <= 473 && ghost2X == 548) {
            deltaGhost2Y = 1;
            ghost2Position = function () { ctx.drawImage(ghostBackward, ghost2X, ghost2Y, 35, 40); };
        }
        if (ghost2X >= 549 && ghost2X <= 682 && ghost2Y == 146) {
            deltaGhost2X = -1;
            ghost2Position = function () { ctx.drawImage(ghostLeft, ghost2X, ghost2Y, 35, 40); };
        }
        if (ghost2X == 681 && ghost2Y == 474) {
            ghost2Path = 1;
        }
    }

    ghost2X = ghost2X + deltaGhost2X;
    ghost2Y = ghost2Y + deltaGhost2Y;
}


// Entitiy Functions ===========================================================
function updateCharacter(e) {
    var key = 0;
    if (e) {
        key = e.keyCode ? e.keyCode : e.which;
    }

    if (key == 39) {
        if (charY >= 533 && charY <= 600 && charX >= 66 && charX <= 200 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 && charX >= 66 && charX <= 200 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 - 51 && charX >= 159 && charX <= 200) { // Bypasser
            charX += 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 && charX >= 200 && charX <= 333 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 333 && charY <= 466 && charX >= 200 && charX <= 333 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 200 && charY <= 333 && charX >= 200 && charX <= 266 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 266 && charY <= 333 && charX >= 66 && charX <= 200) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 266 && charX >= 66 && charX <= 133 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 266 && charX <= 466 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 200 && charX <= 266 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 - 51 && charX >= 159 && charX <= 200) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 - 51 && charX >= 225 && charX <= 266) { // Bypasser
            charX += 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 && charX >= 400 && charX <= 733 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 333 && charY <= 466 && charX >= 666 && charX <= 733 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 533 && charX <= 600 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 - 51 && charX >= 558 && charX <= 599) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 200 && charY <= 466 && charX >= 400 && charX <= 466 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 200 && charY <= 466 && charX >= 533 && charX <= 600 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 600 && charX <= 733 - 40) {
            charX += 3;
            doUpdate = true;
        } else if (charY >= 66 && charY <= 133 && charX >= 600 && charX <= 733 - 40) {
            charX += 3;
            doUpdate = true;
        } else {
            charX -= 6;
        }
    } else if (key == 37) {
        if (charY >= 533 && charY <= 600 && charX >= 66 && charX <= 200) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 && charX >= 66 && charX <= 333) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 333 && charY <= 466 && charX >= 200 && charX <= 333) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 200 && charY <= 333 && charX >= 203 && charX <= 266) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 266 && charY <= 333 - 51 && charX >= 200 && charX <= 203) { // Bypasser
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 266 && charY <= 333 && charX >= 66 && charX <= 200) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 266 && charX >= 66 && charX <= 133) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 200 && charX <= 398) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 - 51 && charX >= 398 && charX <= 403) { // Bypasser
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 466 && charX >= 400 && charX <= 466) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 && charX >= 400 && charX <= 733) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 333 && charY <= 466 && charX >= 666 && charX <= 733) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 466 && charX >= 533 && charX <= 600) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 600 && charX <= 733) {
            charX -= 3;
            doUpdate = true;
        } else if (charY >= 66 && charY <= 133 && charX >= 600 && charX <= 733) {
            charX -= 3;
            doUpdate = true;
        } else {
            charX += 6;
        }
    } else if (key == 40) {
        if (charY >= 533 && charY <= 600 - 40 && charX >= 66 && charX <= 200) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 && charX >= 66 && charX <= 200) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 - 51 && charX >= 200 && charX <= 333) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 333 && charY <= 466 && charX >= 200 && charX <= 333) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 200 && charY <= 333 && charX >= 200 && charX <= 266) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 266 && charY <= 333 - 51 && charX >= 66 && charX <= 200) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 266 && charX >= 66 && charX <= 133) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 200 && charX <= 266) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 400 && charX <= 466) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 - 51 && charX >= 266 && charX <= 400) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 466 && charX >= 400 && charX <= 466) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 - 51 && charX >= 400 && charX <= 733) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 333 && charY <= 466 && charX >= 666 && charX <= 733) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 466 && charX >= 533 && charX <= 600) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 - 51 && charX >= 600 && charX <= 733) {
            charY += 3;
            doUpdate = true;
        } else if (charY >= 0 && charY <= 133 && charX >= 600 && charX <= 733) {
            charY += 3;
            doUpdate = true;
        } else {
            charY -= 6;
        }
    } else if (key == 38) {
        if (charY >= 533 && charY <= 600 && charX >= 66 && charX <= 200) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 && charX >= 66 && charX <= 333) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 333 && charY <= 466 && charX >= 200 && charX <= 333) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 200 && charY <= 333 && charX >= 200 && charX <= 266 - 40) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 266 && charY <= 333 && charX >= 66 && charX <= 200) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 266 && charX >= 66 && charX <= 133 - 40) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 200 && charX <= 466) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 466 && charX >= 400 && charX <= 466 - 40) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 466 && charY <= 533 && charX >= 400 && charX <= 733) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 333 && charY <= 466 && charX >= 666 && charX <= 733) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 466 && charX >= 533 && charX <= 600 - 40) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 133 && charY <= 200 && charX >= 600 && charX <= 733) {
            charY -= 3;
            doUpdate = true;
        } else if (charY >= 66 && charY <= 133 && charX >= 600 && charX <= 733) {
            charY -= 3;
            doUpdate = true;
        } else {
            charY += 6;
        }
    }

    if (doUpdate == true) {
        drawChar(key);
    }

    doUpdate = false;
}

function checkInsideWalls() {
    if (charY >= 533 && charY <= 600 && charX >= 66 && charX <= 200 - 40) {
    }
    else if (charY >= 466 && charY <= 533 && charX >= 66 && charX <= 200 - 40) {
    }
    else if (charY >= 466 && charY <= 533 - 51 && charX >= 159 && charX <= 200) { // Bypasser
    }
    else if (charY >= 466 && charY <= 533 && charX >= 200 && charX <= 333 - 40) {
    }
    else if (charY >= 333 && charY <= 466 && charX >= 200 && charX <= 333 - 40) {
    }
    else if (charY >= 200 && charY <= 333 && charX >= 200 && charX <= 266 - 40) {
    }
    else if (charY >= 266 && charY <= 333 && charX >= 66 && charX <= 200) {
    }
    else if (charY >= 133 && charY <= 266 && charX >= 66 && charX <= 133 - 40) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 266 && charX <= 466 - 40) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 200 && charX <= 266 - 40) {
    }
    else if (charY >= 466 && charY <= 533 - 51 && charX >= 159 && charX <= 200) {
    }
    else if (charY >= 133 && charY <= 200 - 51 && charX >= 225 && charX <= 266) { // Bypasser
    }
    else if (charY >= 466 && charY <= 533 && charX >= 400 && charX <= 733 - 40) {
    }
    else if (charY >= 333 && charY <= 466 && charX >= 666 && charX <= 733 - 40) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 533 && charX <= 600 - 40) {
    }
    else if (charY >= 133 && charY <= 200 - 51 && charX >= 558 && charX <= 599) {
    }
    else if (charY >= 200 && charY <= 466 && charX >= 400 && charX <= 466 - 40) {
    }
    else if (charY >= 200 && charY <= 466 && charX >= 533 && charX <= 600 - 40) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 600 && charX <= 733 - 40) {
    }
    else if (charY >= 66 && charY <= 133 && charX >= 600 && charX <= 733 - 40) {
    }
    else {
        charX -= 6;
    }
    if (charY >= 533 && charY <= 600 && charX >= 66 && charX <= 200) {
    }
    else if (charY >= 466 && charY <= 533 && charX >= 66 && charX <= 333) {
    }
    else if (charY >= 333 && charY <= 466 && charX >= 200 && charX <= 333) {
    }
    else if (charY >= 200 && charY <= 333 && charX >= 203 && charX <= 266) {
    }
    else if (charY >= 266 && charY <= 333 - 51 && charX >= 200 && charX <= 203) { // Bypasser
    }
    else if (charY >= 266 && charY <= 333 && charX >= 66 && charX <= 200) {
    }
    else if (charY >= 133 && charY <= 266 && charX >= 66 && charX <= 133) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 200 && charX <= 398) {
    }
    else if (charY >= 133 && charY <= 200 - 51 && charX >= 398 && charX <= 403) { // Bypasser
    }
    else if (charY >= 133 && charY <= 466 && charX >= 400 && charX <= 466) {
    }
    else if (charY >= 466 && charY <= 533 && charX >= 400 && charX <= 733) {
    }
    else if (charY >= 333 && charY <= 466 && charX >= 666 && charX <= 733) {
    }
    else if (charY >= 133 && charY <= 466 && charX >= 533 && charX <= 600) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 600 && charX <= 733) {
    }
    else if (charY >= 66 && charY <= 133 && charX >= 600 && charX <= 733) {
    }
    else {
        charX += 6;
    }
    if (charY >= 533 && charY <= 600 - 40 && charX >= 66 && charX <= 200) {
    }
    else if (charY >= 466 && charY <= 533 && charX >= 66 && charX <= 200) {
    }
    else if (charY >= 466 && charY <= 533 - 51 && charX >= 200 && charX <= 333) {
    }
    else if (charY >= 333 && charY <= 466 && charX >= 200 && charX <= 333) {
    }
    else if (charY >= 200 && charY <= 333 && charX >= 200 && charX <= 266) {
    }
    else if (charY >= 266 && charY <= 333 - 51 && charX >= 66 && charX <= 200) {
    }
    else if (charY >= 133 && charY <= 266 && charX >= 66 && charX <= 133) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 200 && charX <= 266) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 400 && charX <= 466) {
    }
    else if (charY >= 133 && charY <= 200 - 51 && charX >= 266 && charX <= 400) {
    }
    else if (charY >= 133 && charY <= 466 && charX >= 400 && charX <= 466) {
    }
    else if (charY >= 466 && charY <= 533 - 51 && charX >= 400 && charX <= 733) {
    }
    else if (charY >= 333 && charY <= 466 && charX >= 666 && charX <= 733) {
    }
    else if (charY >= 133 && charY <= 466 && charX >= 533 && charX <= 600) {
    }
    else if (charY >= 133 && charY <= 200 - 51 && charX >= 600 && charX <= 733) {
    }
    else if (charY >= 0 && charY <= 133 && charX >= 600 && charX <= 733) {
    }
    else {
        charY -= 6;
    }
    if (charY >= 533 && charY <= 600 && charX >= 66 && charX <= 200) {
    }
    else if (charY >= 466 && charY <= 533 && charX >= 66 && charX <= 333) {
    }
    else if (charY >= 333 && charY <= 466 && charX >= 200 && charX <= 333) {
    }
    else if (charY >= 200 && charY <= 333 && charX >= 200 && charX <= 266 - 40) {
    }
    else if (charY >= 266 && charY <= 333 && charX >= 66 && charX <= 200) {
    }
    else if (charY >= 133 && charY <= 266 && charX >= 66 && charX <= 133 - 40) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 200 && charX <= 466) {
    }
    else if (charY >= 133 && charY <= 466 && charX >= 400 && charX <= 466 - 40) {
    }
    else if (charY >= 466 && charY <= 533 && charX >= 400 && charX <= 733) {
    }
    else if (charY >= 333 && charY <= 466 && charX >= 666 && charX <= 733) {
    }
    else if (charY >= 133 && charY <= 466 && charX >= 533 && charX <= 600 - 40) {
    }
    else if (charY >= 133 && charY <= 200 && charX >= 600 && charX <= 733) {
    }
    else if (charY >= 66 && charY <= 133 && charX >= 600 && charX <= 733) {
    }
    else {
        charY += 6;
    }

    if (doUpdate == true) {
        drawChar();
    }

    doUpdate = false;
}

function drawChar(key) {
    // Determine footstep
    if (stepCount == 0) {
        position = function () { ctx.drawImage(forward, charX, charY, 35, 50); };
    }

    // Handle movement with arrow keys
    if (key == 39) {
        if (stepCount % 2 == 0) {
            //ctx.drawImage(rightRightfoot, charX, charY, 35, 50);
            position = function () { ctx.drawImage(rightLeftfoot, charX, charY, 35, 50); };
        } else {
            //ctx.drawImage(rightLeftfoot, charX, charY, 35, 50);
            position = function () { ctx.drawImage(rightRightfoot, charX, charY, 35, 50); };
        }
    } else if (key == 37) {
        if (stepCount % 2 == 0) {
            //ctx.drawImage(leftRightfoot, charX, charY, 35, 50);
            position = function () { ctx.drawImage(leftLeftfoot, charX, charY, 35, 50); };
        } else {
            //ctx.drawImage(leftLeftfoot, charX, charY, 35, 50);
            position = function () { ctx.drawImage(leftRightfoot, charX, charY, 35, 50); };
        }
    } else if (key == 40) {
        if (stepCount % 2 == 0) {
            //ctx.drawImage(backwardRightfoot, charX, charY, 35, 50);
            position = function () { ctx.drawImage(backwardLeftfoot, charX, charY, 35, 50); };
        } else {
            //ctx.drawImage(backwardLeftfoot, charX, charY, 35, 50);
            position = function () { ctx.drawImage(backwardRightfoot, charX, charY, 35, 50); };
        }
    } else if (key == 38) {
        if (stepCount % 2 == 0) {
            //ctx.drawImage(forwardRightfoot, charX, charY, 35, 50);
            position = function () { ctx.drawImage(forwardLeftfoot, charX, charY, 35, 50); };
        } else {
            //ctx.drawImage(forwardLeftfoot, charX, charY, 35, 50);
            position = function () { ctx.drawImage(forwardRightfoot, charX, charY, 35, 50); };
        }
    }

    handleKeys();

    // Determine escape
    if (charY >= 66 && charY <= 100 && charX >= 600 && charX <= 733 && escapeDungeon == true) {
        escaped = true;
        win();
    }

    stepCount = stepCount + 1;
    //doUpdate = false;
    //checkInsideWalls();
    console.log("|  charX = " + charX + "  |  " + "charY = " + charY + "  |");
}

function handleGhostVsChar() {
    // Ghost 1 collision
    if (charX >= ghost1X && charX <= ghost1X + 33 && charY >= ghost1Y && charY <= ghost1Y + 39) {
        die = true;
        init();
    } else if (charX + 33 >= ghost1X && charX + 33 <= ghost1X + 33 && charY >= ghost1Y && charY <= ghost1Y + 39) {
        die = true;
        init();
    } else if (charX >= ghost1X && charX <= ghost1X + 33 && charY + 39 >= ghost1Y && charY + 39 <= ghost1Y + 39) {
        die = true;
        init();
    } else if (charX + 33 >= ghost1X && charX + 33 <= ghost1X + 33 && charY + 39 >= ghost1Y && charY + 39 <= ghost1Y + 39) {
        die = true;
        init();
    }
    // Ghost 2 collision
    if (charX >= ghost2X && charX <= ghost2X + 33 && charY >= ghost2Y && charY <= ghost2Y + 39) {
        die = true;
        init();
    } else if (charX + 33 >= ghost2X && charX + 33 <= ghost2X + 33 && charY >= ghost2Y && charY <= ghost2Y + 39) {
        die = true;
        init();
    } else if (charX >= ghost2X && charX <= ghost2X + 33 && charY + 39 >= ghost2Y && charY + 39 <= ghost2Y + 39) {
        die = true;
        init();
    } else if (charX + 33 >= ghost2X && charX + 33 <= ghost2X + 33 && charY + 39 >= ghost2Y && charY + 39 <= ghost2Y + 39) {
        die = true;
        init();
    }
}

function handleKeys() {
    if (execute1 == true) {
        if (charY >= 133 && charY <= 200 - 33 && charX >= 66 && charX <= 133) {
            keyCount = keyCount + 1;
            key1Vis = false;
            execute1 = false;
        }
    }
    if (execute2 == true) {
        if (charY >= 333 && charY <= 400 - 33 && charX >= 266 - 20 && charX <= 333) {
            keyCount = keyCount + 1;
            key2Vis = false;
            execute2 = false;
        }
    }
    if (execute3 == true) {
        if (charY >= 333 && charY <= 400 - 33 && charX >= 666 && charX <= 733) {
            keyCount = keyCount + 1;
            key3Vis = false;
            execute3 = false;
        }
    }
}


// Load Images =================================================================
function loadCharacterImages() {
    backward = document.createElement('img');
    backward.src = "images/characterPositions/backward.png";

    backwardLeftfoot = document.createElement('img');
    backwardLeftfoot.src = "images/characterPositions/backwardLeftfoot.png";

    backwardRightfoot = document.createElement('img');
    backwardRightfoot.src = "images/characterPositions/backwardRightfoot.png";

    forward = document.createElement('img');
    forward.src = "images/characterPositions/forward.png";

    forwardLeftfoot = document.createElement('img');
    forwardLeftfoot.src = "images/characterPositions/forwardLeftfoot.png";

    forwardRightfoot = document.createElement('img');
    forwardRightfoot.src = "images/characterPositions/forwardRightfoot.png";

    left = document.createElement('img');
    left.src = "images/characterPositions/left.png";

    leftLeftfoot = document.createElement('img');
    leftLeftfoot.src = "images/characterPositions/leftLeftfoot.png";

    leftRightfoot = document.createElement('img');
    leftRightfoot.src = "images/characterPositions/leftRightfoot.png";

    right = document.createElement('img');
    right.src = "images/characterPositions/right.png";

    rightLeftfoot = document.createElement('img');
    rightLeftfoot.src = "images/characterPositions/rightLeftfoot.png";

    rightRightfoot = document.createElement('img');
    rightRightfoot.src = "images/characterPositions/rightRightfoot.png";

}

function loadGhostImages() {
    ghostBackward = document.createElement('img');
    ghostBackward.src = "images/ghostPositions/ghostBackward.png";

    ghostForward = document.createElement('img');
    ghostForward.src = "images/ghostPositions/ghostForward.png";

    ghostLeft = document.createElement('img');
    ghostLeft.src = "images/ghostPositions/ghostLeft.png";

    ghostRight = document.createElement('img');
    ghostRight.src = "images/ghostPositions/ghostRight.png";
}


// Utility Functions ===========================================================
function roundRect(x, y, w, h, thickness, radius, color) {
    var r = x + w;
    var b = y + h;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y + h - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}

function textBox(text, color, font, x, y) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}