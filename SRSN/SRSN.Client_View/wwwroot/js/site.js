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

})();
// Initialize Firebase
//var config = {
//    apiKey: "AIzaSyAD2Vqg-rHzg9WJee0Yh0VGH_i_5BQT61E",
//    authDomain: "srsnproject.firebaseapp.com",
//    databaseURL: "https://srsnproject.firebaseio.com",
//    projectId: "srsnproject",
//    storageBucket: "srsnproject.appspot.com",
//    messagingSenderId: "237911674213"
//};
//firebase.initializeApp(config);


////token
//var authorization = localStorage.getItem("authorization");
//var token = (JSON.parse(authorization))["token"];//dựa vào token để lấy noti, ko dựa vào id sẽ bị lộ

//var payload = token.split(".")[1];
//if (payload != null) {
//    var count = 0;
//    var myDataRef = firebase.database().ref(payload);
//    myDataRef.on('child_changed', function (snapshot) {
//        var link = "";
//        var username = "";
//        var text = "";
//        var noti = "";
//        snapshot.forEach(function (childSnapshot) {
//            //var childKey = childSnapshot.key;
//            if (childSnapshot.key == "isRead") {
//                if (childSnapshot.val() != "True") {
//                    count++;
//                }
//            } else if (childSnapshot.key == "link") {
//                link = `<li ><a href="${childSnapshot.val()}">`;
//            } else if (childSnapshot.key == "username") {
//                username = "<b>" + childSnapshot.val() + "</b>";
//            } else {
//                text += childSnapshot.val() + "<br/>";
//            }
//        });
//        noti = link + username + text + "</a></li>";
//        displayNotifi(noti);
//    });

//    myDataRef.on('child_added', function (snapshot) {
//        var link = "";
//        var username = "";
//        var text = "";
//        var noti = "";
//        snapshot.forEach(function (childSnapshot) {
//            //var childKey = childSnapshot.key;
//            if (childSnapshot.key == "isRead") {
//                if (childSnapshot.val() != "True") {
//                    count++;
//                }
//            } else if (childSnapshot.key == "link") {
//                link = `<li ><a href="${childSnapshot.val()}">`;
//            } else if (childSnapshot.key == "username") {
//                username = "<b>" + childSnapshot.val() + " </b>";
//            } else {
//                text += childSnapshot.val() + "<br/>";
//            }
//        });
//        noti = link + username + text + "</a></li>";
//        displayNotifi(noti);
//    });
//}
////them data vao firebase
////var myDataRef = firebase.database().ref("eyJuYW1laWQiOiIyNyIsInVuaXF1ZV9uYW1lIjoibmdoaWFoaCIsIm5iZiI6MTU1MTg0MzIwNSwiZXhwIjoxNTUyNDczMjA1LCJpYXQiOjE1NTE4NDMyMDUsImlzcyI6Imh0dHA6Ly9zcnNuLmNvbSIsImF1ZCI6Imh0dHA6Ly9zcnNuLmNvbSJ9");
////myDataRef.push({
////    "username": "BaoLK",
////    "content": "hom nay ngay 6/3",
////    "date": "6/3/2019",
////    "link": "/recipe/9",
////    "isRead": "True"
////});
//function displayNotifi(noti) {
//    alert("adfsad");
//    $("#list-notification-layout").prepend(noti);
//};