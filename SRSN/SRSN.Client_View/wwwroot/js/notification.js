
var listNotification = [];
//$(document).ready((e) =>{
//    displayCountNotifi();
//});
$(".fa-bell").hover(function () {
    displayNotifi();
});
var usernameLocal = window.localStorage.getItem("username");//username của mõi người đều khác nhau, nó là unique key, nên dùng username lưu ở fire. và nó sẽ ko thay đổi sau mõi lần đăng nhập
if (usernameLocal != null) {
    //var countNoti = 0;

    var myDataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);
    //load tất cả data đã dc add vào trong firebase, chạy 1 lần duy nhất
    myDataRef.on('child_added', function (snapshot) {//Handle khi có một child mới, 

        var link = "";
        var username = "";
        var text = "";
        var noti = "";
        var uid = "";
        var isRead = "";
        snapshot.forEach(function (childSnapshot) {
            //var childKey = childSnapshot.key;
            if (childSnapshot.key == "uid") {
                uid = childSnapshot.val();
            } else if (childSnapshot.key == "isRead") {
                isRead = childSnapshot.val();
            } else if (childSnapshot.key == "link") {
                link = childSnapshot.val();
            } else if (childSnapshot.key == "username") {
                username = childSnapshot.val();
            } else {
                text += childSnapshot.val() + "<br/>";
            }
        });
        noti = {
            "uid": uid,
            "username": username,
            "content": text,
            "link": link,
            "isRead": isRead
        }


        if (noti.uid != "") {
            var flag = false;
            for (var itemNoti of listNotification) {
                if (itemNoti.uid == uid) {
                    flag = true;
                    break;
                }
            }

            if (flag != true) {//không tồn tại trong list
                listNotification.push(noti);

            }

        } displayCountNotifi();

    });
    //load dử liệu vừa dc thay đổi trên firebase, chạy nhiều lần khi data trên firebase thay đổi
    myDataRef.on('child_changed', function (snapshot) {
        var link = "";
        var username = "";
        var text = "";
        var noti = "";
        var uid = "";
        var isRead = "";
        snapshot.forEach(function (childSnapshot) {
            //var childKey = childSnapshot.key;
            if (childSnapshot.key == "uid") {
                uid = childSnapshot.val();
            } else if (childSnapshot.key == "isRead") {
                isRead = childSnapshot.val();
            } else if (childSnapshot.key == "link") {
                link = childSnapshot.val();
            } else if (childSnapshot.key == "username") {
                username = childSnapshot.val();
            } else {
                text += childSnapshot.val() + "<br/>";
            }
        });
        noti = {
            "uid": uid,
            "username": username,
            "content": text,
            "link": link,
            "isRead": isRead
        }


        if (noti.uid != "") {
            var flag = false;
            for (var itemNoti of listNotification) {
                if (itemNoti.uid == uid) {
                    flag = true;
                    break;
                }
            }

            if (flag != true) {//không tồn tại trong list
                listNotification.push(noti);
                play();    
            }
        }
        displayCountNotifi();
        
        //
    });
    
}
//update all child isRead = True
function changeStatusNoti() {
    SRSN.FIREBASE_DATABASE.ref(usernameLocal).update({ "numberOfLatestNotis": "0" });
    $("#number-of-notification").text("");
}
var createSingleNoti = (noti, isRead) =>
    `<li style="width: 100%;${isRead}"><a href="${noti.link}" onclick="isReadNotication('${noti.uid}')"><b>${noti.username}</b> ${noti.content}</a></li>`;
function displayNotifi() {
    $(`#list-notification`).html("");//xóa cái củ, để vào cái mới

    for (var itemNoti of listNotification) {
        var read = itemNoti.isRead == "True" ? "" : "background-color: white;";
        var element = createSingleNoti(itemNoti, read);
        $("#list-notification").prepend(element);
    }


};
function isReadNotication(uidKey) {
    //update uid into firebase 
    SRSN.FIREBASE_DATABASE.ref("/" + usernameLocal + "/" + uidKey).update({
        isRead : "True"
    });
};
function displayCountNotifi() {
    var countNoti = 0;
    var dataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);
    dataRef.on('value', function (snapshot) {
        countNoti = snapshot.val().numberOfLatestNotis;
    });
    if (countNoti > 0 && countNoti <= 9) {
        $("#number-of-notification").text(countNoti);
    } else if (countNoti > 9) {
        $("#number-of-notification").text("9+");
    }
   
}

function play() {
    var audio = document.getElementById("myAudio");
    audio.play();
}
