function Position(options)
{
    this.x = options.x;
    this.y = options.y;
    this.tileX = options.tileX;
    this.tileY = options.tileY;
    
}

if(typeof module !== "undefined") module.exports = Position;