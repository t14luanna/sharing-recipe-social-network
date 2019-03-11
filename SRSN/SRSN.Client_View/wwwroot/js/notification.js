//Initialize Firebase
var config = {
    apiKey: "AIzaSyAD2Vqg-rHzg9WJee0Yh0VGH_i_5BQT61E",
    authDomain: "srsnproject.firebaseapp.com",
    databaseURL: "https://srsnproject.firebaseio.com",
    projectId: "srsnproject",
    storageBucket: "srsnproject.appspot.com",
    messagingSenderId: "237911674213"
};
firebase.initializeApp(config);

////ko dùng dc token vì mõi lần đăng nhập thì sẽ tạo ra 1 token mới khác với token cũ mặc dù cùng 1 userid, vậy vậy dùng username lun
//var authorization = localStorage.getItem("authorization");
//var token = (JSON.parse(authorization))["token"];//dựa vào token để lấy noti, ko dựa vào id sẽ bị lộ
var countNoti = 0;
var usernameLocal = window.localStorage.getItem("username");//username của mõi người đều khác nhau, nó là unique key, nên dùng username lưu ở fire. và nó sẽ ko thay đổi sau mõi lần đăng nhập
if (usernameLocal != null) {
   
    var myDataRef = firebase.database().ref(usernameLocal);
    myDataRef.on('child_changed', function (snapshot) {//Handle child data change

        var link = "";
        var username = "";
        var text = "";
        var noti = "";
        snapshot.forEach(function (childSnapshot) {
            //var childKey = childSnapshot.key;
            if (childSnapshot.key == "isRead") {
                if (childSnapshot.val() != "True") {
                    countNoti++;
                    
                }
            } else if (childSnapshot.key == "link") {
                link = `<li ><a href="${childSnapshot.val()}">`;
            } else if (childSnapshot.key == "username") {
                username = "<b>" + childSnapshot.val() + " </b>";
            } else {
                text += childSnapshot.val() + "<br/>";
            }
        });
        noti = link + username + text + "</a></li>";
        displayNotifi(noti);

    });

    myDataRef.on('child_added', function (snapshot) {//Handle khi có một child mới

        var link = "";
        var username = "";
        var text = "";
        var noti = "";
        snapshot.forEach(function (childSnapshot) {
            //var childKey = childSnapshot.key;
            if (childSnapshot.key == "isRead") {
                if (childSnapshot.val() != "True") {// read status is true
                    countNoti++;
                   
                }
            } else if (childSnapshot.key == "link") {
                link = `<li ><a href="${childSnapshot.val()}">`;
            } else if (childSnapshot.key == "username") {
                username = "<b>" + childSnapshot.val() + " </b>";
            } else {
                text += childSnapshot.val() + "<br/>";
            }
        });
        noti = link + username + text + "</a></li>";
        displayNotifi(noti);
        
    });
   
}

//them data vao firebase
//var myDataRef = firebase.database().ref(usernameLocal);
//var myDataRef = firebase.database().ref("baongoc");
//myDataRef.push({
//    "username": "NghiaHH",
//    "content": "toi bit roi",
//    "date": "15/3/2019",
//    "link": "/recipe/8",
//    "isRead": "True"
//});


//update all child isRead = True
function changeStatusNoti() {
    let dbCon = firebase.database().ref("/" + usernameLocal + "/");
    
    dbCon.on("value", function (snapshot) {
        snapshot.forEach(function (child) {
            child.ref.update({
                isRead: "True"
            });
        });
    });
    location.reload();
}
function displayNotifi(noti) {
    $("#list-notification").prepend(noti);
    if (countNoti > 0 && countNoti <= 9) {
        $("#number-of-notification").text(countNoti);
    } else if (countNoti > 9) {
        $("#number-of-notification").text("9+");
    }
};
