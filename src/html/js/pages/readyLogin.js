var ReadyLogin = function() {

    return {
        init: function() {

            $('#form-login').validate({
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
                    e.closest('.form-group').removeClass('has-success has-error');
                    e.closest('.help-block').remove();
					
                },
                rules: {
                    'login-username': {
                        required: true
                    },
                    'login-password': {
                        required: true
                    }
                },
                messages: {
                    'login-username': 'Please enter your account\'s username',
                    'login-password': {
                        required: 'Please provide your password'
                    }
                },
				submitHandler : function(form, event) { 
					event.preventDefault();
					var username= $("#login-username").val(); 
					var pass= $("#login-password").val(); 
				$(".lblerror").hide();				
                if(!testing)
				{
					submitData(username,pass);
				}
				else{
					
					authenticate(testingLoginResponse);
				}					
				
			}
            });
        }
    };
}();

function submitData(username,pass)
{	
             var dt = {"username": username,"password": pass};
postRequest(loginPostUrl,dt,authenticate);
         
}

function authenticate(data)
{	
	 var json = $.parseJSON(data);
	 if(json.status==true)
	 { 
		 window.sessionStorage.setItem("tkn", json.token);
		 window.location.href = "./public_diary.html";
		
	 }
	 else
	 {
		$(".lblerror").fadeIn(1000);		 
	 }
	
}