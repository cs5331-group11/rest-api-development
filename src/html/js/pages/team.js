$(function () {                                        						
                if(!testing)
				{
					if(testingAlerts){alert("testing:false");}
					submitData();
				}
				else{
					if(testingAlerts){alert("testing:true");}
					processResponse(testingmetaMembersResponse);
				}				
});	
						
function submitData()
{	$("#teamul").empty();
    getRequest(updatePermissionDiaryPostUrl,processResponse);
         
}
function processResponse(data)
{	
	 var json = $.parseJSON(data);
	 if(json.status==true)
	 { 
		for(var i=0;i<json.result.length;i++){
        var obj = json.result[i];
		
		appndData(obj);         
         
		}
	 }
	 else
	 {
		alert("server returns no/false response");		 
	 }
	
}

function appndData(text)
{
			var member = "<li>"+text+ "</li>";
	        $('#teamul').append(member);
	
}