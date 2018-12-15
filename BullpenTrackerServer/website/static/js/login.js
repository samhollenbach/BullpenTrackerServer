$(document).ready(function() {

    $("#login_btn > input[name=login_btn]").click(function(event) {

        var email = $("input[name=email]").val();
        var password = $("input[name=password]").val();

        event.preventDefault();

        $.post("/api/login", {email: email, pass: password}, function(data, status, xhr) {
            var p_token = data.p_token;
            document.cookie = "p_token="+ p_token;
            window.location.href='/';
        }, "json");
    });


    function signup_alert(main, text){
        $('#signup-alert').html("<b>" + main + "</b> " + text)
        $('#signup-alert').show();
    }


    $("button#signup_btn").click(function(event) {

        event.preventDefault();

        var email = $("input#email").val();
        var password = $("input#password").val();
        var password_conf = $("input#confirm_password").val();
        var fname = $("input#fname").val();
        var lname = $("input#lname").val();
        var throws = $("input[name=throwSide]").val();

   
        if (fname == "" || lname == "" || email == "" || password == "" || password_conf == "" || throws == "") {
            signup_alert("Signup Error", "All fields are required")
            return
        }


        if (password != password_conf) {
            signup_alert("Signup Error", "Passwords do not match")
            return
        }

        $.post("/api/pitcher", {email: email, pass: password, firstname: fname, lastname: lname, throws: throws}, function(data, status, xhr) {

            console.log(data);
            console.log(status);


            var p_token = data.p_token;
            document.cookie = "p_token="+ p_token;
            

            window.location.href='/';

        }, "json");

    });



});
