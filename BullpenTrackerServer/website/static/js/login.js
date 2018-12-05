$(document).ready(function() {

    $("input[name=login_btn]").click(function(event) {

        var username = $("input[name=username]").val();
        var password = $("input[name=password]").val();

        $.post("http://bullpentracker.com/api/login", {email: username, pass: password}, function(data) {
            var p_token = data.p_token;
        }, "json");
        event.preventDefault();
    });


});
