function PlayTestGame(options)
{ 
    this.initialize = function()
    {
        var gameOptions = {mapWidth: 20,mapHeight:20,tileSize:64};
        gameEngine.init(gameOptions);

        gameEngine.startRendering();

        gameEngine.addCanvas("mainGameCanvas");

        gameEngine.setLogo("img/play-test-logo.png");

        var menu = [
             {"label":"Quick", "call": "play.quickPlay()" }
            ,{"label":"Start", "call": "play.startPlaying()" }
            ,{"label":"Path-1", "call": "play.pathFindingTest()" }
            ,{"label":"Zoom-In", "call": "play.zoomIn()" }
            ,{"label":"Zoom-Out", "call": "play.zoomOut()" }            
            ,{"label":"pan", "call": "play.startPanning()" }            
            ,{"label":"stop pan", "call": "play.stopPanning()" }            
            ,{"label":"entity-detail","call":"gameEngine.toggleEntityDataForAll()"}
            ,{"label":"show-fps","call":"gameEngine.toggleDebug()"}
            ,{"label":"walkable","call":"gameEngine.toggleShowWalkableMap()"}
            ,{"label":"waypoints","call":"play.waypointTest();"}
            ,{"label":"pathtest-1","call":"play.pathFindingTest(1);"}
            ,{"label":"pathtest-2","call":"play.pathFindingTest(2);"}
            ,{"label":"pathtest-3","call":"play.pathFindingTest(3);"}
            ,{"label":"pathtest-4","call":"play.pathFindingTest(4);"}
            ,{"label":"pathtest-5","call":"play.pathFindingTest(5);"}
            
        ];

        gameEngine.addMenu(menu);

        var bottomMenu = [
            {"label":"Simple Test", "call": "play.simpleTest()" }
            ,{"label":"Complex Test", "call": "play.complexTest()" }
           
       ];

       gameEngine.addBottomMenu(bottomMenu);


        gui.showView("viewGameCanvas");

        this.quickPlay();

    }


    this.quickPlay = function()
    {
        gameEngine.viewScale = .7;
    }


    this.tileMapTest = function()
    {
        gameEngine.clearAll();
        assets.addAsset({key: 'dirt-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/dirt.png'});
        assets.addAsset({key: 'lava-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/lava.png'});
        assets.addAsset({key: 'wall-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/wall.png'});

        var tileMap = this.getLongRoom();
        gameEngine.loadTileMapAt(0,0, 32,'wall-tile-sheet',tileMap, true);

        
        var sprite = new SpriteSheet();
        sprite.addSheet("img/sheets/body/male/dark.png");
        var g2 = new GameEntity({pos:{x: 320,y:64}, ownerID:user.userID, width:64, height:64,sprite: sprite});
        gameEngine.addEntity(g2);


        var data = gameEngine.getWalkableTileMap(0,0,1000,1000, 64, -1);//startX, startY, endX + 300, endY+300, tileSize, excludeEntityIdx);

        gameEngine.tempWalkableMap = data.grid.nodes;//data.map  ;

        var path = gameEngine.findPath(192,64,192,256, 64, 0);

        gameEngine.tempPath = path;

    }

    this.entityClicked = function(clickedEntityIdx)
    {
        if(clickedEntityIdx != gameEngine.selectedEntityIdx)
        {
            var selected = gameEngine.entity[gameEngine.selectedEntityIdx];
            var clicked = gameEngine.entity[clickedEntityIdx];

            if(selected.ownerID != clicked.ownerID)
            {
                console.log("attacking...");
                gameEngine.entity[gameEngine.selectedEntityIdx].setTargetEnemyIdx(clickedEntityIdx);
            }
        }
    }



    this.emptySpaceClicked = function(mouseX, mouseY, wasDoubleClicked)
    {

        if(gameEngine.selectedEntityIdx >= 0)
        {
            var char = gameEngine.entity[gameEngine.selectedEntityIdx];
            
            var destX = (mouseX);
            var destY = (mouseY);            
            
            if(!wasDoubleClicked)
            {
                var p = new Position({x:mouseX, y:mouseY});

                gameEngine.entity[char.entityIdx].addDest(p.getTileX(), p.getTileY());
               
                console.log("Adding Destination:" + mouseX + "," + mouseY + " tile: " + p.getTileX() + "," + p.getTileY() + " for " + char.entityIdx);
            }
            else
            {
                gui.growl("waypoint added", 3);
            }

        }
        else
        {
            var path = gameEngine.findPath(this.pathStart.x,this.pathStart.y, mouseX, mouseY, 64, 0);
        
            gameEngine.tempPath = path;

            this.pathStart.x = mouseX;
            this.pathStart.y = mouseY;

        }



    }


    this.mouseMoved = function(mouseX, mouseY){ }
    
    this.mouseMoveEnd  = function(mouseX, mouseY){}

    this.mouseClicked = function(mouseX, mouseY){gameEngine.mouseClicked(mouseX, mouseY);}

    this.destroy = function() {}

    

    this.zoomIn = function()
    {
        gameEngine.zoom(.10);
    }

    this.zoomOut = function()
    {
        gameEngine.zoom(-.10);
    }

}
