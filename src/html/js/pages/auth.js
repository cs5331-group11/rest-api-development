checkAuth();

		
function logout() {
	
		if(!testing)
			{
				process();
			}
		else{					
				processLogout(testinguserExpireResponse);
			}
		
}		

function process()
{
	
	   if(window.sessionStorage.getItem("tkn") != null )
		{ 
	      serverExpiretkn();
		}	
		else
		{	
			window.location.href = "./index.html";}	
}

function checkAuth()
{
	if(window.sessionStorage.getItem("tkn") != null ){}
	else
	{
		alert("user session not found. redirecting to login page...");
		 window.location.href = "./index.html";
	}
	
}		

function getTkn()
{
	if(window.sessionStorage.getItem("tkn") != null )
		{ return window.sessionStorage.getItem("tkn");}
	else
	{    alert("user session not found. redirecting to login page...");
		 window.location.href = "./index.html";
	}
	
}

function serverExpiretkn()
{          
		 if(testingAlerts){alert("[Expiretkn] calling server...");}
         var dt = {"token": window.sessionStorage.getItem("tkn")};

              $.ajax({
				type: 'POST',
				async: false,
				url: userExpirePostUrl,
				contentType: "application/json",
				dataType: 'json',
                data: JSON.stringify(dt),
                success : function(r) {
                   if(testingAlerts){alert(JSON.stringify(r));}
				   processLogout(JSON.stringify(r));
                },
                error : function(xhr, textStatus, errorThrown) {
                  alert("[ajax] server connection/internal error");
                }
	});
}
function processLogout(data)
{	 var json = $.parseJSON(data);
	 if(json.status==true)
	 { 
		if(testingAlerts){alert("server success response: logging out the user...");}
	    window.sessionStorage.removeItem("tkn"); //Remove Item 
		window.sessionStorage.clear();//Clear storage
		window.location.href = "./index.html";	
	 }
	 else{
		 alert("server logout status is false, you may try again...");
		 
	 }
}