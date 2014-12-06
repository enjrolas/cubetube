$(function(){
	checkCookie();
	$("#login-form-button").click(function(e){ 
		e.preventDefault();  //prevent the page from reloading
		login( $("#login-form-email").val(), $("#login-form-password").val());
	    });

	$("#create-user-button").click( function(e){
		e.preventDefault();  //prevent the page from reloading
		createUser( $("#create-user-email").val(), $("#create-user-password").val())
		    });

	$("#logout").click(function(e) {
		e.preventDefault();  //prevent the page from reloading
		logout();
	    });
    });


function login( email, password)
{
    var loginPromise = window.spark.login({ username: email, password: password });
    loginPromise.then(
      function(data) {
	  $('#login-form-email').val('');
	  $('#login-form-password').val('');
        displayLoginError('');
	displayLoginResult(JSON.stringify(data));
	$.cookie("accessToken", data.access_token, { expires: data.expires_in/86400 });
      },
      function(error) {
        if (error.message === 'invalid_client') {
          displayLoginError('Invalid username or password.');
        } else if (error.cors === 'rejected') {
          displayLoginError('Request rejected.');
        } else {
          displayLoginError('Unknown error.');
          console.log(error);
        }
      }
    );
}

function createUser(email, password)
{
    window.spark.createUser(email, password, function(err, data) {
	    console.log('err on create user:', err);
	    console.log('data on create user:', data);

  if (!err) {
      displayCreateUserResult(JSON.stringify(data));
      // We try to login and get back an accessToken to verify user creation
      console.log("trying to log in...");
      login(email, password);
  }
  else
      displayCreateUserError(err.message);
    });

}

function logout()
{
    status="logged out";
    $.removeCookie("accessToken");
}

function listCubes()
{
    var devicesPr = window.spark.listDevices();

    devicesPr.then(
		   function(devices){
		       console.log('Devices: ', devices);
		   },
		   function(err) {
		       console.log('List devices call failed: ', err);
		   }
		   );
}

function checkCookie()
{
    console.log($.cookie("accessToken"));
}

function getCookie(name) {
    if (document.cookie.length > 0) {
	c_start = document.cookie.indexOf(name + "=");
	if (c_start != -1) {
	    c_start = c_start + name.length + 1;
	    c_end = document.cookie.indexOf(";", c_start);
	    if (c_end == -1) {
		    c_end = document.cookie.length;
	    }
		return unescape(document.cookie.substring(c_start, c_end));
	}
    }
    return "";
}

function displayLoginError(message) {
    $('#login-error').text(message);
}

function displayLoginResult(message) {
    $('#login-result').text(message);
}

function displayCreateUserError(message) {
    $('#create-user-error').text(message);
}

function displayCreateUserResult(message) {
    $('#create-user-result').text(message);
}

