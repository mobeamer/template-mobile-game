function Game(options)
{
    this.debugNameSpace = "SampleGame()";
    this.gameObjs = [];
    this.tileSize = 64;
    this.selectedGameObjectIdx = -1;
    this.currentAction = {};
    this.mapID = -1;
    this.playing = true;
    this.refreshRate = 2000;
    this.jumpToView = false;
    this.panOnClick = false;

    this.joinedServer = function()
    {
        //called immediatly after user has authenticated
        console.log(this.debugNameSpace + ": joinedServer()");
        gui.showView("viewEntrance");

        this.loadGame();     //dont need to call this...but am
    }

    this.loadGame = function()
    {
        gameEngine = new GameEngine({canvasID: "mainGameCanvas"});
        gameEngine.init({canvasID: "mainGameCanvas"});
        gameEngine.startRendering();

        gui.showView("viewGameCanvas");

        gameEngine.setMiniMapLocation(window.innerWidth - 120, 20);
        //gameEngine.setMiniMapLocation(0,0);
        gameEngine.setView(100,10);

        assets.addAsset({key: 'dirt-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/dirt.png'});
        assets.addAsset({key: 'lava-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/lava.png'});
       

        //this.loadWalkingSamples();

        //this.loadControllerSample();

        //this.loadCollisionSample();

        //this.loadWayPointsSample();

        //this.loadTileMap();

        //this.loadCollisionSample2();

        //this.loadFightSample();

        //this.loadPanningTest();

        //this.loadMiniMapTest();

        this.loadGameSample();
    }



    this.loadGameSample = function()
    {
        gameEngine.setView(0,0);
        
        this.addFriendly(50,50);
        this.addEnemy(50,150);

        this.addSmallDirtPile(10,10);
        this.addSmallLavaLake(300,10);
        
        gameEngine.setViewToEntity(0);

        for(var i=0;i<5;i++)
        {
            var x = gameEngine.getRandomNumber(10,2000);
            var y = gameEngine.getRandomNumber(10,2000);
            this.addSmallDirtPile(x,y);
        }

        for(var i=0;i<5;i++)
        {
            var x = gameEngine.getRandomNumber(10,2000);
            var y = gameEngine.getRandomNumber(10,2000);
            this.addSmallLavaLake(x,y);
        }
           
    }



    this.loadMiniMapTest = function()
    {
        this.addFriendly(150,150);
        
        this.addEnemy(0,0);

        for(var i=0;i< 20;i++)
        {
            this.addEnemy(gameEngine.getRandomNumber(10,2000),gameEngine.getRandomNumber(10,2000));
        }

        gameEngine.setView(0,0);
        
    }


    this.loadPanningTest = function()
    {
        this.addFriendly(100,100);
        
        this.addEnemy(10,10);

        this.panOnClick = true;
        
        //gameEngine.panToView(100,100);
    }
    
    this.loadFightSample = function()
    {
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: 1
                            ,pos: new Position({x:100,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                            ,life: 3
                        }));

                    
        gameEngine.addEntity(new GameEntity({
                            entityID: 3
                            ,ownerID: 1
                            ,pos: new Position({x:200,y:50})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                            ,life:100
                        }));    

        //controlling
        gameEngine.addEntity(new GameEntity({
                            entityID: 2
                            ,ownerID: user.userID
                            ,pos: new Position({x:100,y:300})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                            ,life:100
                        }));  
                        

    }




    this.loadCollisionSample2 = function()
    {
        assets.addAsset({key: 'dirt-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/dirt.png'});
        assets.addAsset({key: 'lava-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/lava.png'});
        
        
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: user.userID
                            ,pos: new Position({x:100,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));
        gameEngine.entity[0].setDest(100,200);  


        var tileMap = [
                     [6,9 ,9 ,9 ,12 ]
                    ,[7,10,10,10,13]
                    ,[7,10,10,10,13]
                    ,[7,10,10,10,13]
                    ,[8,11,11,11,14 ]
        ];
        gameEngine.loadTileMapAt(10,150, 32,'dirt-tile-sheet',tileMap, true);

        gameEngine.loadTileMapAt(250,150, 32,'lava-tile-sheet',tileMap, false);
    }


    this.loadTileMap = function()
    {
            assets.addAsset({key: 'dirt-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/dirt.png'});

        
            var tileMap = [
                     [6,9 ,9 ,9 ,12 ]
                    ,[7,10,10,10,13]
                    ,[7,10,10,10,13]
                    ,[7,10,10,10,13]
                    ,[8,11,11,11,14 ]
            ];
            gameEngine.loadTileMapAt(10,10, 32,'dirt-tile-sheet',tileMap);
            
            var tileMap = [
                [6,9 ,9 ,9 ,12 ]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[8,11,11,11,14 ]
            ];


            gameEngine.loadTileMapAt(10,250, 32,'dirt-tile-sheet',tileMap);

            
    }


    this.loadWayPointsSample = function()
    {
        gameEngine.addEntity(new GameEntity({
            entityID: 1
            ,ownerID: 1
            ,pos: new Position({x:100,y:100})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
        }));

        gameEngine.entity[0].addWayPoint({x:100,y:200}); 
        gameEngine.entity[0].addWayPoint({x:250,y:250}); 
    }

    this.loadCollisionSample = function()
    {
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: 1
                            ,pos: new Position({x:100,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));
        gameEngine.entity[0].setDest(100,200);  

        //east to west <-------------
        gameEngine.addEntity(new GameEntity({
            entityID: 2
            ,ownerID: 1
            ,pos: new Position({x:200,y:160})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
        }));
        gameEngine.entity[1].setDest(10,160);  

        //west to east ------------->
        gameEngine.addEntity(new GameEntity({
            entityID: 3
            ,ownerID: 1
            ,pos: new Position({x:10,y:160})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
        }));
        gameEngine.entity[2].setDest(200,160);  

        //moving north
        gameEngine.addEntity(new GameEntity({
            entityID: 4
            ,ownerID: 1
            ,pos: new Position({x:100,y:250})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
        }));
        gameEngine.entity[3].setDest(100,10);  

        //controlling
        gameEngine.addEntity(new GameEntity({
                            entityID: 99
                            ,ownerID: user.userID
                            ,pos: new Position({x:100,y:160})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));  

                      
    }


    this.loadControllerSample = function()
    {
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: 1
                            ,pos: new Position({x:100,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));
                        
        //controlling
        gameEngine.addEntity(new GameEntity({
                            entityID: 2
                            ,ownerID: user.userID
                            ,pos: new Position({x:150,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));  
                        
        gameEngine.addEntity(new GameEntity({
                            entityID: 3
                            ,ownerID: user.userID
                            ,pos: new Position({x:200,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));  

    }

    this.loadWalkingSamples = function()
    {
        

        //walking north
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: 1
                            ,pos: new Position({x:10,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: -.1
                        }));
        gameEngine.entity[0].setDest(10,10);

        //walking south
        gameEngine.addEntity(new GameEntity({
                            entityID: 2
                            ,ownerID: 1
                            ,pos: new Position({x:50,y:10})
                            ,width: 32
                            ,height: 32 
                            ,speed: 2
                            ,velX: 0
                            ,velY: .1
                        }));                        
        gameEngine.entity[1].setDest(50,100);

        //walking east
        gameEngine.addEntity(new GameEntity({
            entityID: 3
            ,ownerID: 1
            ,pos: new Position({x:10,y:150})
            ,width: 32
            ,height: 32 
            ,speed: 1
            ,velX: .1
            ,velY: 0
        }));  
        gameEngine.entity[2].setDest(100,150);

        //walking west
        gameEngine.addEntity(new GameEntity({
            entityID: 4
            ,ownerID: 1
            ,pos: new Position({x:100,y:200})
            ,width: 32
            ,height: 32 
            ,speed: 1
            ,velX: -.1
            ,velY: 0
        }));  
        gameEngine.entity[3].setDest(10,200);

        
    }

    this.addFriendly = function(x, y)
    {
        gameEngine.addEntity(new GameEntity({
            entityID: gameEngine.entity.length+100
            ,ownerID: user.userID
            ,pos: new Position({x:x,y:y})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
            ,life:1000
        }));  
    }


    this.addEnemy = function(x, y)
    {
        gameEngine.addEntity(new GameEntity({
            entityID: gameEngine.entity.length+100
            ,ownerID: -999
            ,pos: new Position({x:x,y:y})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
            ,life:1000
        }));  
    }

    
    this.addSmallDirtPile = function(x, y)
    {
        
        var tileMap = [
            [6,9 ,9 ,9 ,12 ]
           ,[7,10,10,10,13]
           ,[7,10,10,10,13]
           ,[7,10,10,10,13]
           ,[8,11,11,11,14 ]
        ];

        gameEngine.loadTileMapAt(x, y, 32,'dirt-tile-sheet',tileMap, true);

    }

    this.addSmallLavaLake = function(x, y)
    {
        
        var tileMap = [
            [6,9 ,9 ,9 ,12 ]
           ,[7,10,10,10,13]
           ,[7,10,10,10,13]
           ,[7,10,10,10,13]
           ,[8,11,11,11,14 ]
        ];

        gameEngine.loadTileMapAt(x, y, 32,'lava-tile-sheet',tileMap, false);

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

    this.emptySpaceClicked = function(mouseX, mouseY)
    {
        /*
        if(this.jumpToView)
        {
            gameEngine.setView(mouseX + window.innerWidth/2, mouseY - window.innerHeight/2);
            console.log("Jumping to " + mouseX +"," + mouseY);
        }


        if(this.panOnClick)
        {
            gameEngine.panToView(-mouseX, -mouseY);
            console.log("Panning To:" + mouseX + "," + mouseY);

            //gameEngine.panToView(window.innerWidth/-2, gameEngine.viewY);
            //return;
        }
*/
        if(gameEngine.selectedEntityIdx >= 0)
        {
            gameEngine.entity[gameEngine.selectedEntityIdx].setDest(mouseX, mouseY);
            gameEngine.entity[gameEngine.selectedEntityIdx].stopAttacking(gameEngine);
            //var panX = gameEngine.entity[gameEngine.selectedEntityIdx].screenX();
            //var panY =gameEngine.entity[gameEngine.selectedEntityIdx].screenY();
            //gameEngine.panToView(panX*-1, panY*-1);
        }

    }

    this.miniMapClicked = function(mouseX, mouseY)
    {
        gameEngine.miniMapClicked(mouseX, mouseY);
    }
    
    this.mouseMoveEnd  = function(mouseX, mouseY){}

    this.mouseClicked = function(mouseX, mouseY){gameEngine.mouseClicked(mouseX, mouseY);}
}

