    
	
	
var contentType ="application/json";
 
if(window.XDomainRequest)
        contentType = "text/plain";
	
function postRequest(urlX,dt,func)
{	
         $.ajax({
         url:urlX,
		 crossDomain: true,
         data: JSON.stringify(dt),
         type:"POST",
         dataType:"json",   
         contentType:contentType,	 
         success:function(data)
         {
			if(testingAlerts){alert(JSON.stringify(data));}
            func(JSON.stringify(data));
         },
         error:function(jqXHR,textStatus,errorThrown)
         {
            alert("[ajax] server connection/internal error"+errorThrown);
         }
        });   
	
}
 
function getRequest(urlX,func)
{	
        $.ajax(
        {
         url:urlX,
         dataType:"json",
		 crossDomain: true,
         contentType:contentType,
         success:function(data)
         {
          if(testingAlerts){alert(JSON.stringify(data));}
            func(JSON.stringify(data));
         },
         error:function(jqXHR,textStatus,errorThrown)
         {
           alert("[ajax] server connection/internal error"+errorThrown);
         }
        });
 
}