function Gui()
{
    this.showView = function(viewDivID)
    {
        var i;
        var x = document.getElementsByClassName("view");
        for (i = 0; i < x.length; i++) 
        {
            x[i].style.display = "none"; 
        }
        var d = document.getElementById(viewDivID);
        
        if(d)
        {
            document.getElementById(viewDivID).style.display = "block"; 
        }
        else
        {
            debug("Something went wrong...(view:" + viewDivID + " not found)");
        }        
    }

    this.setLoadingMsg = function(msg)
    {
        var d = document.getElementById("div-loading-msg");
        d.innerHTML = msg;
        this.debug(msg);
    }

    this.debug = function(msg)
    {
        console.log(msg);
    }
}
