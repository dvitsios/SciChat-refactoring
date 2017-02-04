//Get elements
user_attrs = null

const input_email = document.getElementById('inputEmail');
const input_password = document.getElementById('inputPassword');
const input_password_confirm = document.getElementById('inputPasswordConfirm');
const input_email_2 = document.getElementById('inputEmail_2');
const input_password_2 = document.getElementById('inputPassword_2');
const btn_login = document.getElementById('btnLogin');
const btn_signup = document.getElementById('btnSignUp');
const btn_logout = document.getElementById('btnLogout');

$('#input_password, #input_password_confirm').on('keyup', function () {
    if ($('#input_password').val() == $('#input_password_confirm').val()) {
        $('#message').html('Matching').css('color', 'green');
    } else{
        $('#message').html('Not Matching').css('color', '#e6550d');
    }

    if ( String($('#input_password').val()).length < 6 || String($('#input_password_confirm').val()).length <6){
      $('#message2').html('<br/>Passwords must be at least 6 characters').css('color', '#e6550d');
    } else{
      $('#message2').html('')
    }
});

//Add login event
btn_login.addEventListener('click', e => {
  // Get email and pass
  const email = input_email_2.value;
  const pass = input_password_2.value;
  const auth = firebase.auth();

  //Sign in
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

});

// Add Sign Up event
btn_signup.addEventListener('click', e => {
  // Get email and pass
  // TODO: check for real emails
  const email = input_email.value;
  const pass = input_password.value;
  const auth = firebase.auth();


  //Sign up
  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
        //  .then(user => console.log(user))


  var userType = $('#userType').val();
  if(userType == 'public'){
    user_attrs = {
          is_sci: false,
          age: $('#age').val(),
          occupation: $('#occupation :selected').text()
        }
  } else{ // scientist

    var allVals = [];
    $('#areainterest').find('input:checked').each(function() {
      allVals.push($(this).val());
    });

    user_attrs = {
          is_sci: true,
          research_field: $('#ResearchField :selected').text(),
          position: $('#Position :selected').text(),
          interests: allVals
    }
  }
  console.log(user_attrs);

});

btn_logout.addEventListener('click', e => {
  firebase.auth().signOut();
  alert("You have logged out - you'll be redirected to the home page now")
  $('#landing-page-nav').parent().hide();
  $('#login-nav').parent().hide();
  $('#signup-nav').parent().hide();
  $('#home-nav').click();
});


// Add a realtime listener
firebase.auth().onAuthStateChanged(function(user) {
  if(user != null){

    // Unhide logout button
    console.log(user);
    btn_logout.classList.remove('hide');

    if(!user.emailVerified){
      user.sendEmailVerification();
    }

    if(user_attrs){
      console.log('-- found user_attrs, writing to firebase')
      uid = user.uid;
      firebase.database().ref('user_data/'+uid).set(user_attrs);

    }

    // Redirect to landing page
    if(firebase.auth().currentUser) $('#landing-page-nav').click().parent().show();
    $('#login-nav').parent().hide();
    $('#signup-nav').parent().hide();

    setupLandingPage();

  }else{
    //alert('You are not logged in!');
    console.log('not logged in');
    btn_logout.classList.add('hide');
    $('#login-nav').parent().show();
    $('#signup-nav').parent().show();
  }


});

firebase.auth().onAuthStateChanged(function(user) {
  if(user != null){
    (user.emailVerified) ? console.log('Email is verified') : console.log('Email is not verified')
  }
});
