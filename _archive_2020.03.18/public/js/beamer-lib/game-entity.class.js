var Position = "";
if(typeof module !== "undefined") 
{
	Position = require("./position.class.js");
}

/*
new GameEntity({
	entityID: 1
	,ownerID: 1
	,pos: new Position({x:100,y:100})
	,width: 32
	,height: 32 
	,speed: 1
	,velX: 0
	,velY:0
});
*/
function GameEntity(options)
{
	this.entityID = options.entityID;
    this.ownerID = options.ownerID;
	this.pos = options.pos;
	this.dest = options.pos;
	this.velX = options.velX;
	this.velY = options.velY;
	this.speed = options.speed;
	this.width = options.width;
	this.height = options.height;
	this.life = options.life;
	this.level = options.level;
	if(this.level === undefined) this.level = 1;
	this.runningOnServer = options.runningOnServer;

	this.imgKey = "dog-sheet";

	this.spriteSheet = "img/sheets/dog-sheet.png";
	if(!this.runningOnServer)	assets.addAsset({key:this.imgKey,width:96,height: 128,imgSrc: this.spriteSheet});

	this.wayPoints = new Array();
	this.wayPointIdx = 0;
	this.moveThroughWayPoints = true;
	this.attackRange = 50;
	
	this.damageTaken = 0;
	this.attackDamage = 1;
	
	this.attackSpeed = 10;
	this.waitTicks = 0;


	this.ai = "";

	this.renderWayPoints = false;
	this.renderInfo = false;
	this.renderLOS = false;

	this.usingFrames  = true;
	this.currentFrame = 0;
    this.maxFramesPerRow = 3;
    this.nextFrameCounter = 0;
	this.numTicksBetweenFrames = 10;
	this.currAction = "N";
	this.isMoving = false;
	this.showAttackingAnimation = false;
	this.entityIdx = -1;
	this.targetEntityIdx = -1;

	this.sync = function(options)
	{
		//this.pos = options.pos;
		this.ownerID = options.ownerID;
		this.velX = options.velX;
		this.velY = options.velY;
		this.speed = options.speed;
		this.width = options.width;
		this.height = options.height;
		this.dest = this.isNull(options.dest, options.pos);
		//this.wayPoints = this.isNull(options.wayPoints,new Array());
		//this.wayPointIdx = this.isNull(options.wayPointIdx,0);
		this.attackRange = this.isNull(options.attackRange,0);
		this.life = this.isNull(options.life,10);
		this.level = this.isNull(options.level,1);
		this.damageTaken = this.isNull(options.damageTaken,0);
		this.attackDamage = this.isNull(options.attackDamage,0);
		this.ai = this.isNull(options.ai,'');
		this.currAction = options.currAction;
		this.targetEntityIdx = options.targetEntityIdx;
	}

	this.getState = function()
	{
		var out ={
			entityID: this.entityID
			,ownerID: this.ownerID
			,pos: this.pos
			,dest: this.dest
			,velX: this.velX
			,velY: this.velY
			,speed: this.speed
			,width: this.width
			,height: this.height
			,life: this.life
			,level: this.level
			,currAction: this.currAction
			,wayPoints : this.wayPoints
			,wayPointIdx : this.wayPointIdx
			,attackRange : this.attackRange
			,damageTaken: this.damageTaken
			,attackDamage: this.attackDamage
			,ai: this.ai
			,targetEntityIdx: this.targetEntityIdx
		};

		return out;
	}

	this.setTargetEnemyIdx = function (targetEntityIdx)
	{
		this.targetEntityIdx = targetEntityIdx;
	}


	this.isAlive = function()
	{
		return this.damageTaken < this.life;
	}

	this.getPosition = function()
	{
		var p = new Position({x:this.pos.x,y:this.pos.y});

		return p;
	}

	this.getColor = function()
	{
		if(this.ownerID == user.userID) return "blue";

		return "red";
	}


	this.setDest = function(destX, destY)
	{
		this.dest = new Position({x:destX, y:destY});
	}

	this.startProcessing = function()
	{
		this.moveThroughWayPoints = true;
	}

	this.stopProcessing = function()
	{
		this.moveThroughWayPoints = false;
	}

	this.collisionPointCheck = function(x,y)
	{
		if(!this.isAlive()) return false;

		return x > this.pos.x 
				&& x < this.pos.x + this.width
				&& y > this.pos.y
				&& y < this.pos.y + this.height;
	}

	this.collisionCheck = function(x1, y1, w1, h1)
	{
		if(!this.isAlive()) return false;
		
		var x2 = this.pos.x;
		var y2 = this.pos.y;
		var h2 = this.height;
		var w2 = this.width;

		return !(
			((y1 + h1) < (y2)) ||
			(y1 > (y2 + h2)) ||
			((x1 + w1) < x2) ||
			(x1 > (x2 + w2))
		);
	}

	this.render = function(context, offsetX, offsetY)
	{
		if(!this.isAlive()) return;

		var drawX =  this.pos.x - offsetX;
		var drawY =  this.pos.y - offsetY;

		if(user.userID == this.ownerID)
		{
			context.fillStyle = "blue";
			gameEngine.drawEllipseByCenter(context, drawX + this.width/2, drawY + this.height , this.width, 10); 
		}

		if(this.entityIdx == gameEngine.selectedEntityIdx)
		{
			context.fillStyle = "yellow";
			gameEngine.drawEllipseByCenter(context, drawX + this.width/2, drawY + this.height , this.width, 10); 
		}

		
		var lifePct = (this.life-this.damageTaken)/this.life;
		var barWidth = this.width/2;
		context.fillStyle = "white";
		context.fillRect(drawX-1 + this.width/4, drawY + this.height + 1, barWidth+2, 5);
		context.fillStyle = "green";
		context.fillRect(drawX + this.width/4, drawY + this.height + 2, barWidth * lifePct, 3);

		context.fillStyle = "white";
		gameEngine.drawEllipseByCenter(context, drawX + this.width/4 - 5, drawY + this.height + 2 + 2 , 10, 10);
        context.fillStyle = "black";
		context.fillText(this.level, drawX + this.width/4 - 8, drawY + this.height + 2 + 5);
		

		this.drawCurrFrame(context, drawX, drawY);


		if(this.renderWayPoints && this.wayPoints.length > 0)
		{
			context.strokeStyle = "red";
			context.beginPath();
			context.moveTo(this.wayPoints[0].x, this.wayPoints[0].y);
			
			for(var i=0;i<this.wayPointIdx;i++)
			{
				context.lineTo(this.wayPoints[i].x, this.wayPoints[i].y);
			}
			context.stroke();


			context.strokeStyle = "blue";

			context.lineTo(this.wayPoints[this.wayPointIdx].x, this.wayPoints[this.wayPointIdx].y);

			for(var i=this.wayPointIdx;i<this.wayPoints.length;i++)
			{
				context.lineTo(this.wayPoints[i].x, this.wayPoints[i].y);
				
			}
			context.stroke();
		}

		if(true) //this.renderInfo)
		{
			var dX = drawX + this.width + 10;
			var dY = drawY;

			context.fillStyle = "black";
			//context.fillRect(drawX, drawY, 25, 40);
			//context.fillStyle = "white";
			context.fillText('EntityID: ' + this.entityID, dX + 5, dY+=10);
			context.fillText('OwnerID: ' + this.ownerID, dX + 5, dY+=10);
			context.fillText('Pos: ' + this.pos.x + "," + this.pos.y, dX + 5, dY+=10);
			context.fillText('Pos (S): ' + this.screenX() + "," + this.screenY(), dX + 5, dY+=10);
			context.fillText('Target: ' + this.targetEntityIdx, dX + 5, dY+=10);
			context.fillText('Action: ' + this.currAction, dX + 5, dY+=10);
		}

		if(this.renderLOS)
		{

			/*
			losRange = 10;
			for(var x=this.pos.tileX-losRange;x<this.pos.tileX+losRange;x++)
			{
				for(var y=this.pos.tileY-losRange;y<this.pos.tileY+losRange;y++)
				{
					new Ray(this.pos, new Position({tileX:x,tileY:y})).render(context);
				}
			}
			*/

			//var r = new Ray(this.pos, new Position({tileX:this.pos.tileX-3,tileY:this.pos.tileY+3})).render(context);
			//var r2 = new Ray(this.pos, new Position({tileX:6,tileY:9})).render(context);
		}
	}
	
	this.getLastWayPoint = function()
	{
		if(this.wayPoints.length <= 0)
		{
			return this.pos;
		}

		return this.wayPoints[this.wayPoints.length-1];
	}

	this.drawCurrFrame = function(context, drawX, drawY)
    {
      var cropX = this.currentFrame * this.width;
      var cropY = 0;
      var cropWidth = this.width;
      var cropHeight = this.height;
      var x = drawX;
      var y = drawY;
      var drawWidth = this.width;
      var drawHeight = this.height;
      
	  if(this.currAction == 'E') cropY = this.height*2;
	  if(this.currAction == 'S') cropY = 0;
	  if(this.currAction == 'N')  cropY = this.height*3;
	  if(this.currAction == 'W') cropY = this.height;
	  if(this.currAction == 'F') cropY += this.height * 4;

      context.drawImage(assets.getImg(this.imgKey).img, cropX, cropY, cropWidth, cropHeight, x, y, drawWidth, drawHeight);
	  
	  if(this.usingFrames && this.currAction != "")
      {
        this.nextFrameCounter++;
        if(this.nextFrameCounter > this.numTicksBetweenFrames)
        {
          this.nextFrameCounter = 0;
          this.currentFrame++;
          if(this.currentFrame >= this.maxFramesPerRow)
          {
            this.currentFrame=0;
          }

        }
      }
	}
	

	this.update = function(gameEngine)
	{ 
		if(!this.isAlive()) return;

		if(this.waitTicks > 0)
		{
			this.waitTicks--;
			return;
		}

		var keepProcessing = true;


		if(keepProcessing){ keepProcessing = this.attack(gameEngine); }

		if(keepProcessing){ keepProcessing = this.moveToDest(gameEngine); }
		
		if(keepProcessing){ keepProcessing = this.processWayPoints(gameEngine); }

	}

	this.stopAttacking = function(gameEngine)
	{
		this.currAction = "";

		if(this.targetEntityIdx >= 0)
		{
			gameEngine.entity[this.targetEntityIdx].currAction = "";
		}

		this.targetEntityIdx = -1;

	}

	this.attack = function(gameEngine)
	{
		var keepProcessing = true;

		if(this.targetEntityIdx >= 0)
		{
			
			var target = gameEngine.entity[this.targetEntityIdx];

			if(!target.isAlive())
			{
				this.targetEntityIdx = -1;
				this.currAction = "N";
				
			}

			if(target.isAlive())
			{

				var dis = gameEngine.getDistance(target.pos.x, target.pos.y, this.pos.x, this.pos.y);

				if(dis <= this.attackRange)
				{
					//perform attack
					keepProcessing = false;
					console.log("fighting..." + this.entityIdx + "vs " + this.targetEntityIdx);
					gameEngine.fight(this.entityIdx, this.targetEntityIdx);
					this.currAction = "F";
					gameEngine.entity[this.targetEntityIdx].currAction = "F";

				}
				else
				{
					this.setDest(target.pos.x, target.pos.y);
					keepProcessing = true;
					this.currAction = "";
					gameEngine.entity[this.targetEntityIdx].currAction = "";
				}
			}
			
			
		}	

		return keepProcessing;
	}




	this.processAi = function()
	{
		if(this.ai == "roam")
		{
			if(this.isAtDest() && !this.hasWayPointsLeft())
			{
				var roamRange = 10;
				var destY = this.pos.tileY;

				var destMinX = this.pos.tileX - roamRange;
				var destMaxX = this.pos.tileX + roamRange;
				if(destMinX < 1) destMinX = 2;				
				if(destMaxX > gameMap.mapTileWidth) destMaxX = gameMap.mapTileWidth - 2;

				var destMinY = this.pos.tileY - roamRange;
				var destMaxY = this.pos.tileY + roamRange;
				if(destMinY < 1) destMinY = 2;				
				if(destMaxY > gameMap.mapTileHeight) destMaxY = gameMap.mapTileHeight - 2;


				var destX = helper.getRandomNumber(destMinX, destMaxX);
				var destY = helper.getRandomNumber(destMinY, destMaxY);
				play.addPath(this.entityID, destX, destY);
			}
		}
	}

	this.isAtDest = function()
	{

		if(Math.abs(this.dest.y - this.pos.y) <= 1 && Math.abs(this.dest.x - this.pos.x) <= 1)
		{
			return true;
		}

		return false;
	}

	this.hasWayPointsLeft = function()
	{
		return this.wayPointIdx < this.wayPoints.length-1 && this.wayPoints.length > 0;
	}

	this.addWayPoint = function(p)
	{
		this.wayPoints.push(p);
		//console.log("gameEntity.addWaypoint(): waypoint added");
	}

	this.clearWayPoints = function()
	{
		this.wayPointIdx = 0;
		this.wayPoints = new Array();
	}

	this.processWayPoints = function()
	{
		if(this.moveThroughWayPoints)
		{
			if(this.isAtDest())
			{
				if(this.wayPoints.length > this.wayPointIdx)
				{
					this.dest = this.wayPoints[this.wayPointIdx];

					this.wayPointIdx++;
					if(this.wayPointIdx >= this.wayPoints.length)
					{
						//this.moveThroughWayPoints = false;
						this.wayPointIdx = this.wayPoints.length-1;
					}
				}
			}
		}
	}

	this.moveToDest = function(gameEngine)
	{

		if(this.dest.x != this.pos.x || this.dest.y != this.pos.y)
		{
			this.velX = 0;
			this.velY = 0;
			//console.log("Dest: " + this.dest.x + "," + this.dest.y);

			if(Math.abs(this.dest.x - this.pos.x) > 1)
			{
				if(this.dest.x > this.pos.x)
				{
					this.velX = 1;
				}

				if(this.dest.x < this.pos.x)
				{
					this.velX = -1;
				}
			}
			

			if(Math.abs(this.dest.y - this.pos.y) > 1)
			{
				if(this.dest.y > this.pos.y)
				{
					this.velY = 1;
				}

				if(this.dest.y < this.pos.y)
				{
					this.velY = -1;
				}
			}

		}

		//console.log("Vel: " + this.velX + "," + this.velY);
		var newX = this.pos.x + (this.velX * this.speed) ;
		var newY = this.pos.y + (this.velY * this.speed);
		var isAvail = gameEngine.isEmptySpot(newX, newY, this.width, this.height, this.entityIdx);

		if(isAvail)
		{
			this.pos.x =newX;
			this.pos.y = newY;
		}

		//if(!this.inBattle(gameEngine))
		//{
			if(this.velX < 0)
			{
				this.currAction = "W";
			}
			
			if(this.velX > 0)
			{
				this.currAction = "E";
			}

			if(this.velY < 0)
			{
				this.currAction = "N";
			}

			if(this.velY > 0)
			{
				this.currAction = "S";
			}

			if(this.velX != 0 || this.velY !=0)
			{
				this.isMoving = true;
			}



		if(this.entityIdx == 1)
		{
			//console.log(this.pos.x + "," + this.pos.y + " vs " + this.dest.x + "," + this.dest.y + "");
		}

		if(this.isAtDest())
		{
			this.velX = 0;
			this.velY = 0;
			if(this.currAction != "F") this.currAction = "";
			this.isMoving = false;
		}

		return true;
	}

	this.inBattle = function(gameEngine)
	{
		if(this.targetEntityIdx >= 0 && this.withinAttackRange(gameEngine,this.targetEntityIdx)) return true;

		return false;
	}

	this.withinAttackRange = function(gameEngine,targetEntityIdx)
	{
		var target = gameEngine.entity[targetEntityIdx];

		var dis = gameEngine.getDistance(target.pos.x, target.pos.y, this.pos.x, this.pos.y);

		if(dis <= this.attackRange)
		{
			return true;
		}

		return false;
	}

	this.screenX = function()
	{
		return this.pos.x - gameEngine.viewX;
	}

	this.screenY = function()
	{
		return this.pos.y - gameEngine.viewY;
	}

	this.addWait = function(ticks)
	{
		if(this.waiTicks < 0) this.waitTicks=0;

		this.waitTicks+=ticks;
	}

	this.isNull = function(val, defaultVal)
	{
		if(val) return val;

		return defaultVal;
	}

}



if(typeof module !== "undefined") module.exports = GameEntity;