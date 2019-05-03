// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.


// Check signed user
(async () => {
    var username = window.localStorage.getItem("username");
    var authorization = window.localStorage.getItem("authorization");
    if (authorization != null) {

        var token = (JSON.parse(authorization))["token"];
        var res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-userinfo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        var data = await res.json();
    } 
    if (authorization && username) {
        $(".authorized-group").css("display", "inline-table");//index, recipe page
        $(".noti-message-icon").css("display", "inline-table");//index, recipe page
        $("#noti-message-icon").css("display", "inline-table");//member profile page
        $("#authorized-group-username").text(data.lastName + " " + data.firstName);
        $("#authorized-group-username").attr("href", "/account/timeline/" + username);
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

$(document).ready((e) => {
    var username = window.localStorage.getItem("username");
    var authorization = window.localStorage.getItem("authorization");
    if (authorization && username) {
        $(".href-homepage").attr("href", "/Newsfeed")
    } else {
        $(".href-homepage").attr("href", "/Index")
    }
})
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