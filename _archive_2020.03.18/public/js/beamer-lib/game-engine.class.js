var Position = "";
var GameEntity = "";
var Tile = "";

if(typeof module !== "undefined") 
{
    Position = require("./position.class.js");
    GameEntity = require("./game-entity.class.js");
    Tile = require("./game-tile.class.js");
}

function GameEngine(options)
{
    this.runningOnServer = options.runningOnServer;
    this.canvasID = options.canvasID;

    this.canvas = "";
    this.keepRendering = true;
    this.targetFps = 60;
    this.lastCalledTime = Date.now();
    this.fps = 0;
    this.scale = 1;
    this.lastMouseClick = new Position({x:0,y:0});
    this.lastMouseMove = new Position({x:0,y:0});
    this.entity = new Array();
    this.tiles = new Array();
    this.particle = new Array();
    this.selectedEntityIdx = -1;
    this.loopInterval = "";

    this.showDebug = true;

    this.offscreenCanvas = "";
    this.offscreenOffsetX = 0;
    this.offscreenOffsetY = 0;
    this.viewX = 0;
    this.viewY = 0;
    this.panToX = 0;
    this.panToY = 0;
    this.panSpeed = 1;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.miniMapOriginX = 10;
    this.miniMapOriginY = 10;
    this.miniMapHeight = 100;
    this.miniMapWidth = 100;
    this.miniMapScale = .05;


    this.engineOptions = {
                autoSelectChar: true
    };

    this.init = function(options)
    {
        if(!this.runningOnServer) 
        {
            this.canvasID = options.canvasID;

            this.canvas = document.getElementById(options.canvasID);
            
            this.screenWidth = window.innerWidth;
            
            this.screenHeight = window.innerHeight;

            this.orientationChange();

            this.resizeCanvas();
        }
    }

    this.setEntityVel = function(entityID, velX, velY)
    {
        for(var i=0;i<this.entity.length;i++)
        {
            if(entityID == this.entity[i].entityID)
            {
                this.entity[i].velX = velX;
                this.entity[i].velY = velY;
                
            }
        }
        
    }

    this.getTileAt = function(x, y)
    {
        for(var i=0;i<this.tiles.length;i++)
        {
            if(this.tiles[i].pos.x == x && this.tiles[i].pos.y == y)
            {
                return i;
            }
        }

        return -1;
    }

    this.syncTile = function(srcTile)
    {
        var tileIdx = this.getTileAt(srcTile.pos.x, srcTile.pos.y);

        if(tileIdx < 0)
        {
            var tileOptions = {
                tileSetKey: srcTile.tileSetKey
              , pos: new Position({x: srcTile.pos.x, y: srcTile.pos.y})
              , tileWidth:srcTile.tileSize
              , tileHeight:srcTile.tileSize
              , tileSize:srcTile.tileSize
              , isWalkable: srcTile.isWalkable
              , tileIdx: srcTile.tileIdx
              , label: srcTile.label};         
              
            var t = new Tile(tileOptions);

            this.tiles.push(t);
        }
    }


    this.loadTileMapAt = function(startX,startY, tileSize, tileSetKey,  tileMap, isWalkable)
    {

        for(var x = 0;x<tileMap.length;x++)
        {
            for(var y = 0; y<tileMap[x].length;y++)
            {
                
                if(tileMap[x][y] > 0)
                {
                    var tileOptions = {
                        tileSetKey: tileSetKey
                      , pos: new Position({x: startX + x * tileSize, y: startY + y* tileSize})
                      , tileIdx:tileMap[x][y]
                      , tileWidth:tileSize
                      , tileHeight:tileSize
                      , tileSize:tileSize
                      , isWalkable: isWalkable
                      , label: ""};         
                      
                    var t = new Tile(tileOptions);

                    this.tiles.push(t);

                    //if(this.tiles.length == 301) console.log("HERE: " + startX);

                    //console.log(startX + " " + tileSize);
                    
                }
            }
        }
    }


    this.addEntity = function(options)
    {
        this.syncEntity(options);
    }

    this.syncEntity = function(options)
    {
        var entityFound = false;
        for(var i=0;i<this.entity.length;i++)
        {
            if(options.entityID == this.entity[i].entityID)
            {
                this.entity[i].sync(options);
                entityFound = true;
                return;
            }
        }
        
        if(!entityFound)
        {
            var e = new GameEntity(options);
            e.sync(options);
            e.entityIdx = this.entity.length;
            this.entity.push(e);

            if(!this.runningOnServer && e.ownerID == user.userID && this.selectedEntityIdx <= 0)
            {
                this.setSelectedEntityIdx(this.entity.length-1);
            }
        }
    }

    this.setView = function(viewX, viewY)
    {
        this.viewX = viewX;
        this.viewY = viewY;
        this.panToX = viewX;
        this.panToY = viewY;
    }

    this.panToView = function(viewX, viewY, panSpeed)
    {
        this.panToX = viewX;
        this.panToY = viewY;
        this.panSpeed = panSpeed;
    }

    this.setSelectedEntityIdx = function(entityIdx)
    {
        if(this.entity[entityIdx].isAlive())
        {
            this.selectedEntityIdx = entityIdx;
        }
        //this.viewX = 32;
        //this.viewY = 32;
        //this.viewX = this.entity[this.selectedEntityIdx].pos.x + this.screenWidth/2;
        //this.viewY = this.entity[this.selectedEntityIdx].pos.y + this.screenHeight/2;

    }

    this.fight = function(attackerIdx, defenderIdx)
    {
        //TODO - write a better algo
        //this.entity[defenderIdx].targetEntityIdx = attackerIdx;
        var damage = this.entity[attackerIdx].attackDamage;

        this.entity[defenderIdx].damageTaken+= damage;
        this.entity[attackerIdx].addWait(this.entity[attackerIdx].attackSpeed);

        
        //this.entity[defenderIdx].currAction = "F";
        //this.entity[attackerIdx].currAction = "F";
        

    }


    this.update = function()
    {
        
        for(var i=0;i<this.entity.length;i++)
        {
            //if(!this.runningOnServer) 
            //{
                this.entity[i].update(this);
                //console.log("updating " + i);
            //}
        }
    }

    this.setViewToEntity = function(entityIdx)
    {
        var x = gameEngine.entity[entityIdx].pos.x - window.innerWidth/2;
        var y = gameEngine.entity[entityIdx].pos.y - window.innerHeight/2;
        this.setView(x,y, 5);
    }

    
    this.adjustView = function()
    {
        var dis = gameEngine.getDistance(gameEngine.panToX, gameEngine.panToY, gameEngine.viewX, gameEngine.viewY);

        if(gameEngine.selectedEntityIdx >= 0 && dis <= gameEngine.panSpeed && !gameEngine.entity[gameEngine.selectedEntityIdx].isAtDest())
        {
            var x = gameEngine.entity[gameEngine.selectedEntityIdx].pos.x - window.innerWidth/2;
            var y = gameEngine.entity[gameEngine.selectedEntityIdx].pos.y - window.innerHeight/2;

            //if( gameEngine.entity[gameEngine.selectedEntityIdx].pos.x > window.innerWidth - 100)
            //{
                gameEngine.setView(x,y, 5);
            //}
        }


        if(dis > gameEngine.panSpeed)
        {
            if(gameEngine.panToX < gameEngine.viewX)
            {
                gameEngine.viewX-= gameEngine.panSpeed;
            }

            if(gameEngine.panToX > gameEngine.viewX)
            {
                gameEngine.viewX+= gameEngine.panSpeed;
            }

            if(gameEngine.panToY < gameEngine.viewY)
            {
                gameEngine.viewY-= gameEngine.panSpeed;
            }

            if(gameEngine.panToY > gameEngine.viewY)
            {
                gameEngine.viewY+= gameEngine.panSpeed;
            }

        }
    }

    this.render = function()
    {
        gameEngine.adjustView();

        //this is called from outside the object (window), don't refer to "this", use gameClient instead
        var canvas = gameEngine.canvas;
        var context = gameEngine.canvas.getContext("2d");
        context.clearRect(0,0,canvas.width, canvas.height);
        var scale = gameEngine.scale;

        var scaledWidth = canvas.width * scale;
        var scaledHeight = canvas.height * scale;
        
        context.save();
        context.translate(-((scaledWidth-canvas.width)/2), -((scaledHeight-canvas.height)/2));
        context.scale(scale, scale);
        
        var finalContext = context;

        var offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = window.innerWidth * 2; //gameMap.mapTileWidth * gameMap.tileSize;
        offscreenCanvas.height =  window.innerHeight * 2; //gameMap.mapTileHeight * gameMap.tileSize;
        context = offscreenCanvas.getContext('2d');
    

        //
        //scaled things go here
        //

        context.fillStyle = "green";
        context.fillRect(0,0,canvas.width, canvas.height);
        
        
        for(var i=0;i<gameEngine.tiles.length;i++)
        {
            //gameEngine.tiles[i].update();
            gameEngine.tiles[i].render(context, gameEngine.viewX, gameEngine.viewY, {});
        }

        if(play != "") play.render(context);

        for(var i=0;i<gameEngine.entity.length;i++)
        {
            if(!this.runningOnServer) gameEngine.entity[i].update(gameEngine);
            gameEngine.entity[i].render(context, gameEngine.viewX, gameEngine.viewY);
        }

        for(var i=0;i<gameEngine.particle.length;i++)
        {
            gameEngine.particle[i].update();
            gameEngine.particle[i].render(context);
        }

        gameEngine.renderMiniMap(context);
        
        context.restore();

        
        if(gameEngine.showDebug) gameEngine.renderDebug(context);

        if(typeof play.render !== "undefined") play.render(context);
        
        finalContext.drawImage(offscreenCanvas,gameEngine.offscreenOffsetX,gameEngine.offscreenOffsetY);// this.viewX + this.offscreenOffsetX, this.viewY + this.offscreenOffsetY);


        
        if(!gameEngine.keepRendering)
        {
            if(this.loopInterval) clearInterval(this.loopInterval);
            //debug("Stopping rendering");
        }

        if(!gameEngine.lastCalledTime) 
        {
            gameEngine.lastCalledTime = Date.now();
            gameEngine.fps = 0;
         }
         else
         {
            var delta = (Date.now() - gameEngine.lastCalledTime)/1000;
            gameEngine.lastCalledTime = Date.now();
            gameEngine.fps = 1/delta;
         }
         

    }

    this.renderMiniMap = function(context)
    {
        var originX = gameEngine.miniMapOriginX;
        var originY = gameEngine.miniMapOriginY;
        var miniMapHeight = gameEngine.miniMapHeight;
        var miniMapWidth = gameEngine.miniMapWidth;
        var scale = gameEngine.miniMapScale;;

        context.fillStyle = "#333333";
        context.fillRect(originX, originY, miniMapWidth, miniMapHeight);

        var viewWidth = window.innerWidth * scale;
        var viewHeight = window.innerHeight * scale;
        var drawX = originX + (gameEngine.viewX * scale);
        var drawY = originY + (gameEngine.viewY * scale);
        context.strokeStyle = "white";
        context.strokeRect(drawX, drawY, viewWidth, viewHeight);

        //TILES
        context.fillStyle = "#999999";
        for(var i=0;i<gameEngine.tiles.length;i++)
        {
            //gameEngine.tiles[i].update();
            

            var dX = originX + gameEngine.tiles[i].pos.x * scale;
            var dY = originY + gameEngine.tiles[i].pos.y * scale;

            if(dX < gameEngine.miniMapOriginX + gameEngine.miniMapWidth && dY < gameEngine.miniMapOriginY + gameEngine.miniMapHeight)
            {
                context.fillRect(dX, dY, 3,3);
            }
        }

        //ENTITY
        context.fillStyle = "white";
        for(var i=0;i<gameEngine.entity.length;i++)
        {
            if(gameEngine.entity[i].isAlive())
            {
                var dX = originX + gameEngine.entity[i].pos.x * scale;
                var dY = originY + gameEngine.entity[i].pos.y * scale;

                if(gameEngine.entity[i].ownerID == user.userID)
                {
                    context.fillStyle = "yellow";
                }
                else
                {
                    context.fillStyle = "white";
                }

                context.fillRect(dX, dY, 3,3);
            }
        }






    }


    this.renderDebug = function(context)
    {
        //this is called from outside the object (window), don't refer to "this", use gameClient instead
        var drawX = gameEngine.canvas.width - 100;
        var drawY = gameEngine.canvas.height - 100;

        context.fillStyle = "#333";
        context.fillRect(drawX, drawY, 100, 100);
        drawX+=5;
        context.fillStyle = "white";
        context.font = "10px Arial";
        context.fillText("Debug", drawX, drawY+=15);
        context.fillText("FPS: " + Math.round(this.fps), drawX, drawY+=15);
        context.fillText("View: " + this.viewX + "," + this.viewY, drawX, drawY+=15);
        context.fillText("Objs: " + this.entity.length, drawX, drawY+=15);
     }


    

    this.resizeCanvas = function() 
    {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    this.drawEllipseByCenter = function(ctx, cx, cy, w, h) 
    {
        gameEngine.drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
    }
      
    this.drawEllipse = function(ctx, x, y, w, h) 
    {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle
      
        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        //ctx.closePath(); // not used correctly, see comments (use to close off open path)
        ctx.fill();
    }
    
    this.mouseClicked = function(mouseX, mouseY)
    {
        if(mouseX > this.miniMapOriginX && mouseX < this.miniMapOriginX + this.miniMapWidth
            && mouseY > this.miniMapOriginY && mouseY <= this.miniMapOriginY + this.miniMapHeight)
        {
            play.miniMapClicked(mouseX, mouseY);
            debug("Mini Map Clicked at " + mouseX + "," + mouseY);

            return;
        }

        //adjust mouseXY to game coordinates
        var gameX = mouseX + this.viewX;
        var gameY = mouseY + this.viewY;

        var wasCharClicked = false;

        for(var i=0;i<this.entity.length;i++)
        {
            if(this.entity[i].collisionPointCheck(gameX, gameY))
            {
                console.log("Entity Clicked:" + i);

                if(this.engineOptions.autoSelectChar)
                {
                    if(this.entity[i].ownerID == user.userID)
                    {
                        this.selectedEntityIdx = i;
                    }
                }
                wasCharClicked = true;
                play.entityClicked(i);
               
            }
        }

        if(!wasCharClicked) 
        {
            play.emptySpaceClicked(gameX, gameY);
        }

    }

    this.miniMapClicked = function(mouseX, mouseY)
    {
        var viewWidth = window.innerWidth * this.miniMapScale;
        var viewHeight = window.innerHeight * this.miniMapScale;

        var newViewX = ((mouseX - this.miniMapOriginX - viewWidth/2) / this.miniMapScale);
        var newViewY = ((mouseY - this.miniMapOriginY - viewHeight/2) / this.miniMapScale);

        console.log("New View Clicked: " + newViewX + "," + newViewY);

        //this.setView(newViewX, newViewY);
        this.panToView(newViewX, newViewY, 5);
    }

    this.getGameMapData = function()
    {
        var out = new Array();
    
        for(var i=0;i<this.tiles.length;i++)
        {
            out.push(this.tiles[i].getState());
        }

        return out;
    }


    this.getEntityStates = function()
    {
        var out = new Array();

        for(var i=0;i<this.entity.length;i++)
        {
            out.push(this.entity[i].getState());
        }

        return out;
    }

    this.isEmptySpot = function(x1, y1, width, height, excludeEntityIdx)
    {
        for(var i=0;i<this.entity.length;i++)
        {
            if(i != excludeEntityIdx && this.entity[i].collisionCheck(x1, y1, width, height))
            {
                return false;                
            }
        }

        for(var i=0;i<this.tiles.length;i++)
        {
            if(this.tiles[i].collisionCheck(x1, y1, width, height))
            {
                //console.log(this.tiles[i]);
                if(x1 == 300) console.log(this.tiles[i].pos.x + "," + this.tiles[i].pos.y + " - "  + this.tiles[i].isWalkable + " idx:" + i + ":" + this.tiles[i].tileSetKey);
                return false;                
            }
        }


        return true;
    }

    this.orientationChange = function() {

        switch(window.orientation) {  
        case -90 || 90:
            debug("Landscape Detected");
            gameEngine.resizeCanvas({canvasID:this.canvasID});
            break; 
        default:
            debug("Portrait Detected");
            gameEngine.resizeCanvas({canvasID:this.canvasID});
            break; 
        }
    }

    this.getTxtReport = function(rptKey)
    {
        var out = "";

        if(rptKey == "entity-list")
        {
            var out = "";

            for(var i=0;i<this.entity.length;i++)
            {
                out+= "EntityID:" + this.entity[i].entityID + " OwnerID: " + this.entity[i].ownerID + "\r\n";
            }
        }

        return out;
    }

    
    this.numEntitiesByUserID = function(userID)
    {
        var out = 0;

        for(var i=0;i<this.entity.length;i++)
        {
          if(this.entity[i].ownerID == userID && this.entity[i].isAlive())
          {
            out++;            
          }
        }

        return out;
    }


    this.getEntityIdxFromID = function(entityID)
    {
        var out = -1;

        for(var i=0;i<this.entity.length;i++)
        {
          if(this.entity[i].entityID == entityID)
          {
            out = i;
            
          }
        }

        return out;
  
    }
    
    this.setMiniMapLocation = function(screenX, screenY)
    {
        this.miniMapOriginX = screenX;
        this.miniMapOriginY = screenY;
    }

    this.startRendering = function()
    {
        this.loopInterval = setInterval("window.requestAnimationFrame(gameEngine.render)",1000 / this.targetFps);
        this.keepRendering = true;
    }

    this.stopRendering = function()
    {
        this.keepRendering = false;
    }

    this.getRandomNumber = function(min, max) 
    { 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    this.getDistance = function(x1,y1, x2, y2)
    {
        var a = x1 - x2
        var b = y1 - y2
        
        return Math.sqrt( a*a + b*b );    
    }
    
	this.isNull = function(val, defaultVal)
	{
		if(val) return val;

		return defaultVal;
	}
}


if(typeof module !== "undefined") module.exports = GameEngine;