$(function () {										

				if(!testing)
				{
					submitDataD();
				}
				else{					
					processResponseInit(testingPrivateDiaryResponse);
				}

					UiTables.init();
				
});
function submitDataD()
{		     
			 checkAuth();
			 if(testingAlerts){alert("private data get: "+window.sessionStorage.getItem("tkn"));}
             var dt = {"token": window.sessionStorage.getItem("tkn")};
			 postRequest(privateDiaryPostUrl,dt,processResponseInit);
            
	
}
function processResponseInit(vv)
{	$("#dtbDiaryPublic tbody").empty();
 if(testingAlerts){alert(testingPrivateDiaryResponse);}
          
	 var json = $.parseJSON(vv);
	 if(json.status==true)
	 { 
		for(var i=0;i<json.result.length;i++){
        var obj = json.result[i];
		appndData(obj.id,obj.title,obj.author,obj.publish_date,obj.text,obj.public);         
         
		}
	 }
	 else
	 {
		alert("server returns no response");		 
	 }
	
}

function appndData(id,title,author,publishdate,text,ispublic)
{
	
var tr = "<tr>"+
"<td class=\"text-center\">"+id+"</td>"+
											"<td class=\"text-center\">"+title+"</td>"+
                                            "<td><strong>"+author+"</strong></td>"+
                                            "<td>"+publishdate+"</td>"+
                                            "<td><label class=\"switch switch-success\"><input class=\"chkIsPublic\" type=\"checkbox\" checked=\"\"><span></span></label></td>"+
											"<td>"+text+"</td>"+
                                            "<td class=\"text-center\">"+
                                                " <a href=\"javascript:void(0)\" data-toggle=\"tooltip\" title=\"Delete\" class=\"btn btn-effect-ripple btn-xs btn-danger delDiaryBtn\"><i class=\"fa fa-times\"></i></a>"+
                                            "</td>"+
                                        "</tr>";
											$('#dtbDiaryPublic tbody').append(tr);
	
}
		
		

				  
					$.fn.scrollView = function () {
											  return this.each(function () {
												$('html, body').animate({
												  scrollTop: $(this).offset().top
												}, 1000);
											  });
					}
					$(document).on('click', '.chkIsPublic', function() {					
																
												if(!testing)
												{
													submitDataUpdate($(this).closest('tr').children('td:eq(0)').text(),!$(this).is(':checked'));
												}
												else{
													
													processUpdateResponseBack(testingupdatePermissionDiaryResponse);
												}
					});
											
					$(document).on('click', '.delDiaryBtn', function() {
											
												if(!testing)
												{
													submitDataDelete($(this).closest('tr').children('td:eq(0)').text());
												}
												else{
													
													processDeleteResponseBack(testingdeleteDiaryResponse);
												}
					});
											
					$(document).on('click', '#btnCreateNew', function() {
											$( "div.cr" ).scrollView();
										
					});




var MyDiary = function() {

    return {
        init: function() {

            $('#form-createDiary').validate({
                errorClass: 'help-block animation-slideUp',
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function(e) {
                    if (e.closest('.form-group').find('.help-block').length === 2) {
                        e.closest('.help-block').remove();
                    } else {
                        e.closest('.form-group').removeClass('has-success has-error');
                        e.closest('.help-block').remove();
                    }
                },
                rules: {
                    'valTitle': {
                        required: true
                    },
					 'valNote': {
                        required: true
                    }
                },
                messages: {
                    'valTitle': {
                        required: 'Please enter a title',
                        minlength: 'Please enter a title'
                    },
					   'valNote': {
                        required: 'Please enter note'
                    }
                },
				submitHandler : function(form, event) { 
					event.preventDefault();
					$(".lblsucsess").hide();
					$(".lblerror").hide();
					var title= $("#valTitle").val(); 
					var note= $("#valNote").val(); 
					var ispublic=$('#chkIsPublicCreate').is(":checked");
					
					if(testingAlerts){alert("creating........"+title+" "+note+" "+ispublic);}
					
				if(!testing)
				{
					submitDataCreate(title,note,ispublic);
				}
				else{
					
					processCreateResponseBack(testingcreateDiaryResponse);
				}	
			}
            });
        }
    };
}();

///////////////////////////// update

function submitDataUpdate(diaryId,isPrivate)
{			 
			 checkAuth();
             var dt = {"token": getTkn(), "id": parseInt(diaryId),"private": isPrivate};
			 if(testingAlerts){alert("submitting data: "+JSON.stringify(dt));}
			 
			  postRequest(updatePermissionDiaryPostUrl,dt,processUpdateResponseBack);
            
}

function processUpdateResponseBack(data)
{	
	 var json = $.parseJSON(data);
	 if(json.status==true)
	 { 
				$(".lblsucsessGrid").fadeIn(2000).delay(4000).fadeOut();	
				$('#dtbDiaryPublic').DataTable().destroy();
         	    if(!testing)
				{
					submitDataD();
				}
				else{					
					processResponseInit(testingPrivateDiaryResponseCreated);
				}		 
				
				
                $('#dtbDiaryPublic').DataTable().draw();
	 }
	 else
	 {
		$(".lblerrorGrid").fadeIn(2000).delay(4000).fadeOut();		
        $( ".servererrorGrid" ).empty();
		$(".servererrorGrid").append(": "+json.error);		
	 }
}


///////////////////////////////

///////////////////////////// delete

function submitDataDelete(diaryId)
{			 
			 checkAuth();
             var dt = {"token": getTkn(), "id": parseInt(diaryId)};
			 if(testingAlerts){alert("submitting data: "+JSON.stringify(dt));}
			 postRequest(deleteDiaryPostUrl,dt,processDeleteResponseBack);
            
}

function processDeleteResponseBack(data)
{	
	 var json = $.parseJSON(data);
	 if(json.status==true)
	 { 
				$(".lblsucsessGrid").fadeIn(2000).delay(4000).fadeOut();	
				$('#dtbDiaryPublic').DataTable().destroy();
         	    if(!testing)
				{
					submitDataD();
				}
				else{					
					processResponseInit(testingPrivateDiaryResponseCreated);
				}		 
				
				
                $('#dtbDiaryPublic').DataTable().draw();
	 }
	 else
	 {
		$(".lblerrorGrid").fadeIn(2000).delay(4000).fadeOut();		
        $( ".servererrorGrid" ).empty();
		$(".servererrorGrid").append(": "+json.error);		
	 }
}


///////////////////////////////

function submitDataCreate(title,note,ispublic)
{			 
			 checkAuth();
             var dt = {"token": getTkn(),"title": title,"public": ispublic,"text": note};
			 if(testingAlerts){alert("submitting data: "+JSON.stringify(dt));}
			 postRequest(CreateDiaryPostUrl,dt,processCreateResponseBack);
}

function processCreateResponseBack(data)
{	
	 var json = $.parseJSON(data);
	 if(json.status==true)
	 { 
				$(".lblsucsess").fadeIn(1000);	
				$('#dtbDiaryPublic').DataTable().destroy();
         	    if(!testing)
				{
					submitDataD();
				}
				else{					
					processResponseInit(testingPrivateDiaryResponseCreated);
				}		 
				
				
                $('#dtbDiaryPublic').DataTable().draw();
	 }
	 else
	 {
		$(".lblerror").fadeIn(1000);	
        $( ".servererror" ).empty();
		$(".servererror").append(": "+json.error);		
	 }
	
}