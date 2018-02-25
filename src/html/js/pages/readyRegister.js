
var ReadyRegister = function() {

    return {
        init: function() {

            $('#form-register').validate({
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
                    'register-username': {
                        required: true,
                        minlength: 3
                    },
					 'register-fullname': {
                        required: true
                    },
					 'register-dob': {
                        required: true,
						date: true
                    },
                    'register-email': {
                        required: true,
                        email: true
                    },
                    'register-password': {
                        required: true,
                        minlength: 5
                    },
                    'register-password-verify': {
                        required: true,
                        equalTo: '#register-password'
                    },
                    'register-terms': {
                        required: true
                    }
                },
                messages: {
                    'register-username': {
                        required: 'Please enter a username',
                        minlength: 'Please enter a username'
                    },
					   'register-fullname': {
                        required: 'Please enter your full name'
                    },
					   'register-dob': {
                        required: 'Please enter your date of birth',
						date: "Can contain digits only"
                    },
                    'register-email': 'Please enter a valid email address',
                    'register-password': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long'
                    },
                    'register-password-verify': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long',
                        equalTo: 'Please enter the same password as above'
                    }
                },
				submitHandler : function(form, event) { 
					event.preventDefault();
					$(".lblsucsess").hide();
					$(".lblerror").hide();
					var age= getyears($("#register-dob").datepicker( 'getDate' ));
					var username= $("#register-username").val(); 
					var fullname= $("#register-fullname").val(); 
					var pass= $("#register-password").val(); 
					if(testingAlerts){alert("registering........age: "+age+" pass:***** username: "+username+" fullname: "+fullname);}
			    if(!testing)
				{
					submitData(username,pass,fullname,age);
				}
				else{
					
					processResponse(testingRegisterResponse);
				}	
					
					
					
			}
            });
        }
    };
}();

function submitData(username,pass,fullname,age)
{	
             var dt = {"username": username,"password": pass,"fullname": fullname,"age": parseInt(age)};
			 if(testingAlerts){alert("submitting data: "+JSON.stringify(dt));}
			  postRequest(registerPostUrl,dt,processResponse);
}

var getyears = function(seconddate){
    var firstyear = (new Date()).getFullYear();
    var secondyear = seconddate.getFullYear();
    return 	(firstyear-secondyear);

};

function processResponse(data)
{	
	 var json = $.parseJSON(data);
	 if(json.status==true)
	 { 
		 $(".lblsucsess").fadeIn(1000);		
	 }
	 else
	 {
		 //TODO show server error log
		$(".lblerror").fadeIn(1000);	
		$( ".servererror" ).empty();
		$(".servererror").append(": "+json.error);
		
	 }
	
}