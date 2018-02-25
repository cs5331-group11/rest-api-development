$(function () {                                        						
                if(!testing)
				{
					if(testingAlerts){alert("testing:false");}
					submitData();
				}
				else{
					if(testingAlerts){alert("testing:true");}
					processResponse(testingPublicDiaryResponse);
				}				
   
    UiWidgets.init();
});	
						
function submitData()
{	$("#mainW").empty();
              
              $.ajax({
				type: 'GET',
				async: false,
				url: publicDiaryGetUrl,
				contentType: "application/json",
				dataType: 'json',
                success : function(r) {
                   if(testingAlerts){alert(JSON.stringify(r));}
				   processResponse(JSON.stringify(r));
                },
                error : function(xhr, textStatus, errorThrown) {
                  alert("[ajax] server connection/internal error");
                }
	});
}
function processResponse(data)
{	
	 var json = $.parseJSON(data);
	 if(json.status==true)
	 { 
		for(var i=0;i<json.result.length;i++){
        var obj = json.result[i];
		if(obj.public==true)
		appndData(obj.title,obj.author,obj.publish_date,obj.text);         
         }
		
	 }
	 else
	 {
		alert("server returns no/false response");		 
	 }
	
}

function appndData(title,author,publishdate,text)
{
			var tr = "<div class=\"col-sm-4\">"+
												"<a href=\"javascript:void(0)\" class=\"widget\">"+
												
												"<div class=\"widget-content themed-background text-light-op\">"+
                                            "<i class=\"fa fa-fw fa-file-text\"></i> <strong>"+title+"</strong>"+
                                            "</div>"+
                                            "<div class=\"widget-content text-right clearfix\">"+
                                                "<img src=\"img/placeholders/avatars/avatar9.jpg\" alt=\"author\" class=\"img-circle img-thumbnail img-thumbnail-avatar pull-left\">"+
                                                "<h2 class=\"widget-heading h3\"><strong>"+author+"</strong></h2>"+
                                                "<span class=\"text-muted\" style='font-size:10px'><i>Published on "+publishdate+"</i></span>"+
                                            "</div>"+											
											"<div class=\"widget-content themed-background-muted text-dark text-center\">"+
                                             text
                                           " </div>"+
                                        "</a>"+
                                    "</div>";
	$('#mainW').append(tr);
	
}