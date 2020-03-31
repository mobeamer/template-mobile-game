
function Data(options)
{
  this.debugNameSpace = "Data()";

  var msgCount = 0;
 
  this.rootUrl = "http://localhost:4000";

  this.socket = io();

  
  this.socket.on('game-entities', function(dataMsg){
    
    console.log("game-entities", dataMsg);
    
    gameEngine.syncEntity(dataMsg.dataPacket.gameEntities[0]);
  });


  this.socket.on('general', function(dataMsg){
    
    console.log(dataMsg);

    if(dataMsg.action == "assign-user-id")
    {
      user.userID = dataMsg.dataPacket.userID;

      user.data = dataMsg.dataPacket.userData;
      
      console.log(data.debugNameSpace + ": Assigned UserID:" + user.userID);

      play.joinedServer();
    }
  });


  this.joinServer = function()
  {
    this.socket.emit('join-server', {userGuid: user.userGuid});
  }

  
}