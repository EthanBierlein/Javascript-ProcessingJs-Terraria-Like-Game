/** Here are few instructions before you start...
  * IMPORTANT (ON KHANACADEMY ONLY): When you make changes to the code, all tiles will be black.
  * Just hit the restart button to fix that.
  *
  * CONTROLS:
  * MOUSE - Move around the current selected tile.
  * LEFT MOUSE BUTTON - Add a tile to the screen.
  * RIGHT MOUSE BUTTON - Delete a tile from the screen.
  * CONTROL KEY - Change the block type forward.
  * SHIFT or CTRL - Change the block type backward.
  * WASD or LEFT RIGHT DOWN UP - Move around the map.
*/

/* Global program constants */
var CURSOR_FONT = createFont("monospace", 15);
var WHITE = color(255, 255, 255);
var SUN_WIDTH = 100;
var SUN_HEIGHT = 100;
var TILE_SIZE = 10;
var COLORS = [
    color(180, 120, 20),
    color(20, 150, 20),
    color(100, 100, 100),
    color(240, 200, 10),
    color(5, 44, 117, 100),
    color(255, 255, 255),
    color(110, 70, 10),
    color(10, 210, 20, 185),
];
var TILE_TYPES = [
    "Dirt",
    "Grass",
    "Stone",
    "Sand",
    "Water",
    "Snow",
    "Wood",
    "Leaves",
];

/* Colors for the sun and moon */
var skyObjectColor1 = color(194, 181, 33);
var skyObjectColor2 = color(255, 140, 0);

/* Variables concerning map movement */
var movingUp = false;
var movingDown = false;
var movingLeft = false;
var movingRight = false;

/* Variables that control the darkness of the sky */
var starVisibilityChange = 0;
var starVisibility = 15;
var skyDarknessChange = 0.25;
var skyDarkness = 125;

/* Array containing cloud data */
var cloudArray = [];

/* Current selected color */
var selectedColor = 0;

/* Array contaning all tile data */
var tileArray = [];

/* Array containing all star data */
var starArray = [];

/* Variables controlling the sun and moon's position */
var skyObjectYChange = -0.05;
var SKY_OBJ_X_POS = 189;
var skyObjectYPos = 200;

/* Populate the starArray */
var generateStars = function() {
    for(var d = 0; d <= round(random(100, 125)); d++) {
        starArray.push({
            xPos: random(0, 400),
            yPos: random(0, 400),
        });
    }
};

/* Draw stars in the sky */
var drawStars = function() {
    for(var s = starArray.length-1; s >= 0; s--) {
        var star = starArray[s];
        noStroke();
        fill(255, 255, 255, starVisibility);
        rect(star.xPos, star.yPos, 2, 2);
    }
};

/* Render the day and night cycle*/
var renderDayNightCycle = function() {
    if(skyObjectYPos >= 250) {
        starVisibilityChange = 1;
        skyObjectColor1 = color(122, 117, 117);
        skyObjectColor2 = color(71, 68, 68);
        drawStars();
    }
    if(skyObjectYPos < 250) {
        starVisibilityChange = 0;
        skyObjectColor1 = color(194, 181, 33);
        skyObjectColor2 = color(255, 140, 0);
    }
    noStroke();
    fill(skyObjectColor2);
    rect(SKY_OBJ_X_POS, skyObjectYPos, 45, 45);
    fill(skyObjectColor1);
    rect(SKY_OBJ_X_POS+5, skyObjectYPos+5, 35, 35);
    skyObjectYPos += skyObjectYChange;
    skyDarkness += skyDarknessChange;
    starVisibility += starVisibilityChange;
    if(skyObjectYPos <= -50) {
        skyObjectYChange = 0.05;
        skyDarknessChange = -0.05;
    }
    if(skyObjectYPos >= 450) {
        skyObjectYChange = -0.05;
        skyDarknessChange = 0.05;
        starVisibilityChange = -2.5;
    }
};

/* Generate new terrain for the world */
var generateTerrain = function() {
    var c = random(1, 3);
    
    /* Variable concerning the current Y position of the tile generator */
    var blockY = 300;
    
    /* Create the left end section of water */
    for(var x = -2250; x <= -1760; x += TILE_SIZE) {
        
        /* Create the water section */
        for(var y = round(random(40, 45))*TILE_SIZE; y >= 300; y -= TILE_SIZE) {
            tileArray.push({
                xPos: x,
                yPos: y,
                colr: COLORS[4],
            });
        }
        
        /* Create the section underneath the water */
        for(var y = 400; y <= 410+round(random(20, 30))*TILE_SIZE; y += TILE_SIZE) {
            tileArray.push({
                xPos: x,
                yPos: y+TILE_SIZE,
                colr: [COLORS[2], COLORS[2], COLORS[2], COLORS[2], COLORS[0]][floor(random()*5)],
            });
        }
    }
    
    /*
    // Create the right end section of water //
    for(var x = 1760; x <= 2250; x += TILE_SIZE) {
        
        // Create the water section //
        for(var y = round(random(40, 45))*TILE_SIZE; y >= 300; y -= TILE_SIZE) {
            tileArray.push({
                xPos: x,
                yPos: y,
                colr: COLORS[4],
            });
        }
        
        // Create the section underneath the water //
        for(var y = 400; y <= 410+round(random(20, 30))*TILE_SIZE; y += TILE_SIZE) {
            tileArray.push({
                xPos: x,
                yPos: y+TILE_SIZE,
                colr: [COLORS[2], COLORS[2], COLORS[2], COLORS[2], COLORS[0]][floor(random()*5)],
            });
        }
    }
    */
    
    /* Overarching for loop, this loop determines a section of the world size */
    for(var x = -1750; x <= 1750; x += TILE_SIZE) {
        
        /* Create part of the dirt section, with grass on top*/
        var heightUpOne = round(random(-1, 0));
        tileArray.push({
            xPos: x,
            yPos: blockY+TILE_SIZE*heightUpOne,
            colr: COLORS[1],
        });
        if(heightUpOne === -1) {
            tileArray.push({
                xPos: x,
                yPos: blockY,
                colr: COLORS[0],
            });
        }
        
        /* If this statement is true, then place a tree down */
        if(random() >= random()*random()/random()+random()) {
            var treeHeight = round(random(2, 6));
            
            /* Create the wood section of the tree */
            for(var h = blockY-TILE_SIZE; h >= blockY-TILE_SIZE*treeHeight; h -= TILE_SIZE) {
                tileArray.push({
                    xPos: x,
                    yPos: h,
                    colr: COLORS[6],
                });
            }
            
            /* Create the leaf top of the tree */
            for(var i = 0; i <= 1; i++) {
                tileArray.push({
                    xPos: x,
                    yPos: blockY-TILE_SIZE*(treeHeight+i)-TILE_SIZE,
                    colr: COLORS[7],
                });
            }
            
            /* Add two extra leaf blocks on the sides for a more realistic tree */
            tileArray.push({
                xPos: x+TILE_SIZE,
                yPos: blockY-TILE_SIZE*treeHeight-TILE_SIZE,
                colr: COLORS[7]
            });
            tileArray.push({
                xPos: x-TILE_SIZE,
                yPos: blockY-TILE_SIZE*treeHeight-TILE_SIZE,
                colr: COLORS[7]
            });
        }
        
        /* Create the last part of the dirt section */
        for(var y = blockY; y <= blockY+TILE_SIZE*round(random(2, 4)); y += TILE_SIZE) {
            tileArray.push({
                xPos: x,
                yPos: y+TILE_SIZE,
                colr: COLORS[0],
            });
        }
        
        /* Create the stone section */
        for(var y = blockY+TILE_SIZE*round(c); y <= blockY+TILE_SIZE*random(28, 32); y += TILE_SIZE) {
            tileArray.push({
                xPos: x,
                yPos: y+TILE_SIZE,
                colr: [COLORS[2], COLORS[2], COLORS[2], 
                       COLORS[2], COLORS[2], COLORS[2],
                       COLORS[2], COLORS[2], COLORS[2],
                       COLORS[2], COLORS[2], COLORS[2],
                       COLORS[2], COLORS[2], COLORS[2],
                       COLORS[2], COLORS[2], COLORS[2],
                       COLORS[0]][floor(random()*19)],
            });
        }
        
        /* Change the blockY by a random, but rounded amount */
        blockY += (ceil(random(-1, 1)/TILE_SIZE)*TILE_SIZE)*round(random(-2, 2));
    }
};

/* Initalize the array of clouds */
var generateClouds = function() {
    for(var i = 0; i <= round(random(2, 12)); i++) {
        cloudArray.push({
            xPos: random(50, 350),
            yPos: random(50, 150),
            w: random(30, 60),
            h: random(10, 20),
        });
    }
};

/* Draw the background */
var drawBackground = function() {
    for(var c = cloudArray.length-1; c >= 0; c--) {
        var cloud = cloudArray[c];
        noStroke();
        fill(WHITE);
        rect(cloud.xPos, cloud.yPos, cloud.w, cloud.h);
        cloud.xPos += random(0.01, 0.09);
        if(cloud.xPos >= 400) {
            cloud.xPos = 0-cloud.w;
        }
    }
};

/* Draw a hitbox over the selected position */
var drawHitbox = function(x, y) {
    noCursor();
    fill(WHITE);
    textFont(CURSOR_FONT);
    text("+", mouseX-1, mouseY+4);
    noFill();
    strokeWeight(1);
    stroke(WHITE);
    rect(x, y, TILE_SIZE, TILE_SIZE);
};

/* Add a block to the screen */
var addBlock = function(x, y) {
    drawHitbox(x, y);
    if(mouseIsPressed && mouseButton === LEFT) {
        if(x >= 20 && y >= 20) {
            tileArray.push({
                xPos: x,
                yPos: y,
                colr: COLORS[selectedColor],
            });
        }
    }
};

/* Delete a block from the screen */
var deleteBlock = function(x, y) {
    drawHitbox(x, y);
    if(mouseIsPressed && mouseButton === RIGHT) {
        for(var t = tileArray.length-1; t >= 0; t--) {
            var tile = tileArray[t];
            if(x === tile.xPos && y === tile.yPos) {
                tileArray.splice(t, 1);
            }
        }
    }
};

/* Render the tileArray */
var renderTiles = function() {
    for(var t = tileArray.length-1; t >= 0; t--) {
        var tile = tileArray[t];
        
        /* Check if tile is off screen, if so, don't render */ 
        if(tile.xPos >= 0 && tile.xPos <= 400 && tile.yPos >= 0 && tile.yPos <= 400) {
            noStroke();
            fill(tile.colr);
            rect(tile.xPos, tile.yPos, TILE_SIZE, TILE_SIZE);
        }
    }
};

/* Check for specific key actions */
var checkForKeyActions = function() {
    keyPressed = function() {
        if(keyCode === LEFT || keyCode === 65) {
            movingLeft = true;
        }
        if(keyCode === RIGHT || keyCode === 68) {
            movingRight = true;
        }
        if(keyCode === UP || keyCode === 87) {
            movingUp = true;
        }
        if(keyCode === DOWN || keyCode === 83) {
            movingDown = true;
        }
        if(keyCode === CONTROL) {
            selectedColor++;
            if(selectedColor >= COLORS.length) {
                selectedColor = 0;
            }
        }
        if(keyCode === SHIFT) {
            selectedColor--;
            if(selectedColor < 0) {
                selectedColor = COLORS.length-1;
            }
        }
    };
    
    /* If key released, change keypress variable to false */
    keyReleased = function() {
        if(keyCode === LEFT || keyCode === 65) {
            movingLeft = false;
        }
        if(keyCode === RIGHT || keyCode === 68) {
            movingRight = false;
        }
        if(keyCode === UP || keyCode === 87) {
            movingUp = false;
        }
        if(keyCode === DOWN || keyCode === 83) {
            movingDown = false;
        }
    };
    
    /* Move up */
    if(movingUp) {
        for(var t = tileArray.length-1; t >= 0; t--) {
            var tile = tileArray[t];
            tile.yPos += TILE_SIZE;
        }
    }
    
    /* Move down */
    if(movingDown) {
        for(var t = tileArray.length-1; t >= 0; t--) {
            var tile = tileArray[t];
            tile.yPos -= TILE_SIZE;
        }
    }
    
    /* Move left */
    if(movingLeft) {
        for(var t = tileArray.length-1; t >= 0; t--) {
            var tile = tileArray[t];
            tile.xPos += TILE_SIZE;
        }
    }
    
    /* Move right */
    if(movingRight) {
        for(var t = tileArray.length-1; t >= 0; t--) {
            var tile = tileArray[t];
            tile.xPos -= TILE_SIZE;
        }
    }
};

/* Draw the current selected tile */
var drawSelectedTile = function() {
    strokeWeight(1.5);
    stroke(255, 255, 255);
    fill(COLORS[selectedColor]);
    rect(5, 5, 15, 15);
    fill(255, 255, 255);
    textFont(CURSOR_FONT);
    text(TILE_TYPES[selectedColor], 25, 17.4); 
};

/* Load the world, clouds and stars before the draw loop begins */
generateTerrain();
generateClouds();
generateStars();

/* Main draw loop */
draw = function() {
    background(0, 0, skyDarkness);
    renderDayNightCycle();
    drawBackground();
    renderTiles();
    drawSelectedTile();
    checkForKeyActions();
    
    /* Check if the user wants to add a block */
    addBlock(ceil(mouseX/TILE_SIZE)*TILE_SIZE-TILE_SIZE, 
             ceil(mouseY/TILE_SIZE)*TILE_SIZE-TILE_SIZE);
    
    /* Check if the user wants to delete a block */
    deleteBlock(ceil(mouseX/TILE_SIZE)*TILE_SIZE-TILE_SIZE, 
                ceil(mouseY/TILE_SIZE)*TILE_SIZE-TILE_SIZE);
    
    /* Draw a hitbox over the current selected block */
    drawHitbox(ceil(mouseX/TILE_SIZE)*TILE_SIZE-TILE_SIZE, 
               ceil(mouseY/TILE_SIZE)*TILE_SIZE-TILE_SIZE);
};
