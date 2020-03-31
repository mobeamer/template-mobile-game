
function DataPacket(action, dataPacket) 
{
  this.action = action;
  this.dataPacket = dataPacket;
  this.generatedTime = new Date();
  
  this.getJsonObject = function()
  {
    var out = {
                action:this.action
                ,dataPacket: this.dataPacket
                ,generatedTime: this.generatedTime
             
      };
    
    return out;
  }
  
}


if(typeof module !== "undefined") module.exports = DataPacket;