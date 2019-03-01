// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.


// Check signed user
(() => {
    var username = window.localStorage.getItem("username");
    var authorization = window.localStorage.getItem("authorization");

    if (authorization && username) {
        $(".authorized-group").css("display", "inline-table");//index, recipe page
        $(".noti-message-icon").css("display", "inline-table");//index, recipe page
        $("#noti-message-icon").css("display", "inline-table");//member profile page
        $("#authorized-group-username").text(username);
        $(".unauthorized-group").css("display", "none");

    } else {
        $(".authorized-group").css("display", "none");
        $(".unauthorized-group").css("display", "inline-table");
    }


})();
