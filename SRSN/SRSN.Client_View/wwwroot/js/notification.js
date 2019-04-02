

var listNotification = [];
var usernameLocal = window.localStorage.getItem("username");//username của mõi người đều khác nhau, nó là unique key, nên dùng username lưu ở fire. và nó sẽ ko thay đổi sau mõi lần đăng nhập
if (usernameLocal != null) {
    var countNoti = 0;

    var myDataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);
   
    myDataRef.on('child_added', function (snapshot) {//Handle khi có một child mới

        var link = "";
        var username = "";
        var text = "";
        var noti = "";
        var uid = "";
        
        snapshot.forEach(function (childSnapshot) {
            //var childKey = childSnapshot.key;
            if (childSnapshot.key == "uid") {
                uid = childSnapshot.val();
            } else
                if (childSnapshot.key == "isRead") {
                    if (childSnapshot.val() != "True") {// read status is true
                        countNoti++;

                    }
                } else if (childSnapshot.key == "link") {
                    link = childSnapshot.val();
                } else if (childSnapshot.key == "username") {
                    username = childSnapshot.val() ;
                } else {
                    text += childSnapshot.val() + "<br/>";
                }
        });
        noti = {
            "uid": uid,
            "username": username,
            "content": text,
            "link": link,
        }
        
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
        displayNotifi();
    });

}

//update all child isRead = True
function changeStatusNoti() {

    //firebase.initializeApp(config);//goi lai firebase
    var dbCon = firebase.database().ref("/" + usernameLocal + "/");
    dbCon.on("value", function (snapshot) {
        snapshot.forEach(function (child) {
            child.ref.update({
                isRead: "True"
            });
        });
    });
    $("#number-of-notification").text("");
}
var createSingleNoti = (noti) =>
    `<li><a href="${noti.link}"><b>${noti.username}</b> ${noti.content}</a></li>`;
function displayNotifi() {
    $(`#list-notification`).text("");//xóa cái củ, để vào cái mới
    
    for (var itemNoti of listNotification) {
        var element = createSingleNoti(itemNoti);
        $("#list-notification").prepend(element);
    }

    if (countNoti > 0 && countNoti <= 9) {
        $("#number-of-notification").text(countNoti);
    } else if (countNoti > 9) {
        $("#number-of-notification").text("9+");
    }
};
