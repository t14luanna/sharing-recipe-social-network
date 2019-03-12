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
        $("#authorized-group-username").attr("href", "/account/information/" + username);
        $(".unauthorized-group").css("display", "none");
        $("#noti-color").css("color", "red");
   
    } else {
        $(".authorized-group").css("display", "none");
        $(".unauthorized-group").css("display", "inline-table");
    }
    $("#logoutBtn>.login").on("click", function (e) {
        localStorage.clear();
        window.location.href = '/';
    });
})();
const notifiElement = () =>
    ` <li>
                                                    <a href="#" onclick="changeStatusNoti()"><i class="fa fa-bell"></i></a>
                                                    <span style="
                                                          position: absolute;
                                                          top: 5px;
                                                          right: -4px;
                                                          padding: 0px 5px;
                                                          border-radius: 50%;
                                                          background-color: red;
                                                          color: white; font-size: 12px" id="number-of-notification"></span>
                                                    <ul id="list-notification"></ul>
                                                </li>`;
$("#notification").append(notifiElement);