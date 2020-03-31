function Game(options)
{ 
    this.initialize = function(){   }

    this.emptySpaceClicked = function(mouseX, mouseY){ }

    this.mouseMoved = function(mouseX, mouseY){ }
    
    this.mouseMoveEnd  = function(mouseX, mouseY){}

    

    this.destroy = function() {}

    this.mouseClicked = function(mouseX, mouseY){gameEngine.mouseClicked(mouseX, mouseY);}

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


    this.zoomIn = function()
    {
        gameEngine.zoom(.10);
    }

    this.zoomOut = function()
    {
        gameEngine.zoom(-.10);
    }

}
