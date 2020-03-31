function Game(options)
{
    this.debugNameSpace = "SampleGame()";
    
    this.socket = io();

    this.socket.on('user-has-joined', function(dataMsg){
       
        var u = dataMsg.dataPacket.user;

        if(u.userGuid == user.userGuid)
        {
            user.userID = u.userID;
            console.log("assigned userID: " + u.userID);
        }

    });

   


    this.socket.on('game-entities', function(dataMsg){
    
        console.log("game-entities", dataMsg);
        
        var entities = dataMsg.dataPacket.gameEntities;

        for(var i=0;i<entities.length;i++)
        {
            gameEngine.syncEntity(dataMsg.dataPacket.gameEntities[i]);
        }

    });


    this.joinedServer = function()
    {
        //called immediatly after user has authenticated
        console.log(this.debugNameSpace + ": joinedServer()");
        gui.showView("viewEntrance");

        
        this.loadGame();     //dont need to call this...but am
    }

    this.loadGame = function()
    {

        assets.addAsset({key: 'dirt-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/dirt.png'});
        assets.addAsset({key: 'lava-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/lava.png'});
        assets.addAsset({key: 'dog-sheet',width:96, height: 192, imgSrc: 'img/sheets/dog-sheet.png'});
       
        this.socket.emit('join-server', {userGuid: user.userGuid});

        gameEngine = new GameEngine({canvasID: "mainGameCanvas"});
        gameEngine.init({canvasID: "mainGameCanvas"});
        gameEngine.startRendering();
        gui.showView("viewGameCanvas");



    }

    this.entityClicked = function(clickedEntityIdx)
    {

    }

    this.mouseMoveEnd  = function(mouseX, mouseY)
    {
       
    }

    this.mouseClicked = function(mouseX, mouseY)
    {
        /*
        gameEngine.mouseClicked(mouseX, mouseY);

        if(gameEngine.selectedEntityIdx >= 0)
        {
            gameEngine.entity[gameEngine.selectedEntityIdx].setDest(mouseX, mouseY);
        }
        */
       var selected = gameEngine.entity[gameEngine.selectedEntityIdx];
       
       this.socket.emit('set-dest', {userGuid: user.userGuid, entityID: selected.entityID, destX: mouseX, destY: mouseY});
    }

}