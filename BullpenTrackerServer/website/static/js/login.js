$(document).ready(function() {

    $("#login_btn > input[name=login_btn]").click(function(event) {

        var username = $("input[name=username]").val();
        var password = $("input[name=password]").val();

        event.preventDefault();

        if (username == "" | password == "") {
            window.location.href='/login';
        }
        else {
            $.post("/api/login", {email: username, pass: password}, function(data, status, xhr) {

                var p_token = data.p_token;
                document.cookie = "p_token="+ p_token;

                window.location.href='/';
            }, "json")
            .fail(function() {
                alert("You entered an invalid login, please try again.")
            });



        }



    });


});
