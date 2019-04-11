

var listNotification = [];
var usernameLocal = window.localStorage.getItem("username");//username của mõi người đều khác nhau, nó là unique key, nên dùng username lưu ở fire. và nó sẽ ko thay đổi sau mõi lần đăng nhập
if (usernameLocal != null) {
    //var countNoti = 0;

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
                        //countNoti++;

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
            displayNotifi(); 
        }
           
    });
    

}

//update all child isRead = True
function changeStatusNoti() {
    
    SRSN.FIREBASE_DATABASE.ref(usernameLocal).update({"numberOfLatestNotis":"0"});
    $("#number-of-notification").text("");
}
var createSingleNoti = (noti) =>
    `<li><a href="${noti.link}"><b>${noti.username}</b> ${noti.content}</a></li>`;
function displayNotifi() {
    $(`#list-notification`).html("");//xóa cái củ, để vào cái mới
    var countNoti = 0;
    var dataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);
    dataRef.on('value', function (snapshot) {
        countNoti = snapshot.val().numberOfLatestNotis;
    });
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
