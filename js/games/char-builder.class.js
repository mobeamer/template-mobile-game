function CharBuilder(options)
{ 
    this.currChar = "";

    this.tags = {
        "main-categories":["Body","Hair","Clothes","Weapons","Armor"]
        };

    this.layers = [
                    {"tags": "","layer-level": 1 ,"img-path": "body/male/dark.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/dark2.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/darkelf.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/darkelf2.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/light.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/orc.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/red_orc.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/skeleton.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/tanned.png"}
                    ,{"tags": "","layer-level": 1 ,"img-path": "body/male/tanned2.png"}

                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/bedhead.png"}   
                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/bangs.png"}   
                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/long.png"}   
                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/longhawk.png"}   
                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/messy1.png"}   
                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/messy2.png"}   
                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/mohawk.png"}   
                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/page.png"}   
                    ,{"tags": "","layer-level": 2,"img-path": "hair/male/parted.png"}   
                    
                    ,{"tags": "clothes,shirt","layer-level": 3,"img-path": "torso/shirts/longsleeve/male/brown_longsleeve.png"}   
                    ,{"tags": "clothes,shirt","layer-level": 3,"img-path": "torso/shirts/longsleeve/male/maroon_longsleeve.png"}   
                    ,{"tags": "clothes,shirt","layer-level": 3,"img-path": "torso/shirts/longsleeve/male/teal_longsleeve.png"}   
                    ,{"tags": "clothes,shirt","layer-level": 3,"img-path": "torso/shirts/longsleeve/male/white_longsleeve.png"}   
                    
                    ,{"tags": "clothes,shirt","layer-level": 4,"img-path": "legs/pants/male/magenta_pants_male.png"}   
                    ,{"tags": "clothes,shirt","layer-level": 4,"img-path": "legs/pants/male/red_pants_male.png"}
                    ,{"tags": "clothes,shirt","layer-level": 4,"img-path": "legs/pants/male/teal_pants_male.png"}
                    ,{"tags": "clothes,shirt","layer-level": 4,"img-path": "legs/pants/male/white_pants_male.png"}
                    ,{"tags": "clothes,shirt","layer-level": 4,"img-path": "legs/armor/male/metal_pants_male.png"}
                    

                    ,{"tags": "","layer-level": 5,"img-path": "weapons/right hand/male/spear_male.png"}                                        
                ];


    this.initialize = function()
    {
        this.loadMainCategories();

        data.save("layers", this.layers);
        
        var chars = data.get("chars");

        if(chars !== undefined && chars != null)
        {
            document.getElementById("char-list-contents").innerHTML = "";
            var html = "";
            for(var i=0;i<chars.length;i++)
            {
                html = "<div style='display:inline-block' onclick=play.loadChar(" + i + ")>";
                html+= "    <b>" + chars[i]["char-name"] + "</b>";
                html+= "    <br><canvas id='canvas-show-" + i + "' style='border: 1px solid black;width:64px;height:64px;' width=64 height=64></canvas></div>";
                
                var sprite = new SpriteSheet();

                for(var j=0;j<chars[i]["layers"].length;j++)
                {
                    var idx = chars[i]["layers"][j];
                    sprite.addSheet("img/sheets/" + this.layers[idx]["img-path"]);
                }
                sprite.fps = 50;
                sprite.frameY = 10;
                addRender({"canvasID":"canvas-show-" + i, "sprite": sprite});
    
                document.getElementById("char-list-contents").innerHTML+= html;
            }
    
            this.currChar.layers = chars[0].layers;
            document.getElementById("txt-char-name").value = chars[0]["char-name"];
        }
        else
        {
            loadNewChar();
        }

        startRenderingLoop();

        gui.showView("viewEntrance");
    }

        
    this.loadMainCategories = function()
    {    
        document.getElementById("tags-filter-tabs").innerHTML = "";

        for(var i=0;i<this.tags["main-categories"].length;i++)
        {
            var d = document.getElementById("tags-filter-tabs");
            d.innerHTML+="<div class='panel-tab' onclick=\"play.applyFilter('" + this.tags["main-categories"][i] + "');\">" + this.tags["main-categories"][i] + "</div>";
        }

    }


    this.loadChar = function(charIdx)
    {
        gui.showView("viewCharEditor");

        var chars = data.get("chars");

        this.currChar = chars[charIdx];

        document.getElementById("txt-char-name").value = this.currChar["char-name"];

        this.loadCharSprites();

        this.applyFilter("hair");
    }

    this.loadNewChar = function()
    {
        gui.showView("viewCharEditor");
        this.currChar = {"char-id": -1, "char-name":"", "layers":[0]};
        document.getElementById("txt-char-name").value = "";
        this.applyFilter("Hair");
        this.loadCharSprites();        
    }

        
    this.loadCharSprites = function()
    {
        sprite = new Array();

        sprite.push(new SpriteSheet());
        sprite.push(new SpriteSheet());
        sprite.push(new SpriteSheet());
        sprite.push(new SpriteSheet());
        
        for(var i=0;i<this.currChar.layers.length;i++)
        {
            for(var j=0;j<sprite.length;j++)
            {
                sprite[j].addSheet("img/sheets/" + this.layers[this.currChar.layers[i]]["img-path"]);
            }
        }
        
        var fps = 50;
        sprite[0].fps = fps;
        sprite[1].fps = fps;
        sprite[2].fps = fps;
        sprite[3].fps = fps;



        sprite[0].frameY = 10;
        sprite[1].frameY = 8;
        sprite[2].frameY = 9;
        sprite[3].frameY = 11;       
        
        addRender({"canvasID":"canvas-0", "sprite": sprite[0]});
        addRender({"canvasID":"canvas-1", "sprite": sprite[1]});
        addRender({"canvasID":"canvas-2", "sprite": sprite[2]});
        addRender({"canvasID":"canvas-3", "sprite": sprite[3]});

    }


        
    this.applyFilter = function(filter)
    {
        var html = "";
        for(var i=0;i<this.layers.length;i++)
        {
            var path = this.layers[i]["img-path"];
            var tags = this.layers[i]["tags"];

            if(path.includes(filter.toLowerCase()) || tags.includes(filter.toLowerCase()))
            {
                var imgSrc = "img/sheets/" + this.layers[i]["img-path"];

                html+= "<div style=\"background: url('img/sheets/body/male/dark.png') 0px -384px; width:64px; height:64px;display:inline-block;\">";
                html+="<div onclick='play.addLayer(" + i + ");' style=\"background: url('" + imgSrc + "') 0px -384px;width:64px;height:64px;\"></div></div>";

                console.log("Adding " + this.layers[i]["img-path"] + " to output");
            }
        }    
        
        document.getElementById("filter-layers-results").innerHTML = html;
    }



    this.addLayer = function(layerIdx)
    {
        var newLayer= this.layers[layerIdx];
    
        var layerWasAdded = false;
    
        for(var i=0;i<this.currChar.layers.length;i++)
        {
            var tmpLayer = this.layers[this.currChar.layers[i]];
            if(tmpLayer["layer-level"] == newLayer["layer-level"])
            {
                this.currChar.layers[i] = layerIdx;
                layerWasAdded = true;
                console.log("Layer replaced");
            }
        }
        
        if(!layerWasAdded)
        {
            this.currChar.layers.push(layerIdx);
            console.log("Layer Added");
        }
    
        this.loadCharSprites();
    }
    


    this.saveChar = function()
    {
        var charName = document.getElementById("txt-char-name").value;
        if(charName == "")
        {
            gui.growl("Character name required", 3000);
            return;
        }
        
        var chars = data.get("chars");
        if(chars === undefined || chars == null)
        {
            chars = [{"char-id": 1,"char-name":charName, "layers":this.currChar.layers}];
        }
        else
        {
            if(this.currChar["char-id"] == -1)
            {
                chars.push({"char-id": chars.length+1, "char-name":charName, "layers":this.currChar.layers});
            }
            else
            {
                for(var i=0;i<chars.length;i++)
                {
                    if(chars[i]["char-id"] == this.currChar["char-id"])
                    {
                        chars[i] = this.currChar;
                        chars[i]["char-name"] = charName;
                    }
                }
                
            }
        }
    
        data.save("chars",chars);
        console.log(chars);
    
        gui.growl("Saved", 3);
    
    }
        

    this.destroy = function() {
        stopRenderingLoop();
    }

    this.emptySpaceClicked = function(mouseX, mouseY){ }

    this.mouseMoved = function(mouseX, mouseY){ }
    
    this.mouseMoveEnd  = function(mouseX, mouseY){}

    this.mouseClicked = function(mouseX, mouseY){}



}
