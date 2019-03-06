$('#pagination-container').pagination({
    dataSource: 'https://localhost:44361/api/userfollowing/read-following-user?userid=27',
    locator: '',// array
    totalNumberLocator: function (response) {
        return response.length;
    },
    //totalNumber: 40,
    pageSize: 16,
    ajax: {
        beforeSend: function () {
            $('#list-following-user').html('Đang tải dữ liệu ...');
        }
    },
    callback: function (data, pagination) {
        // template method of yourself
        var html = template(data, pagination);
        $('#list-following-user').html(html);
        $('#count-friends').html(data.length);
    }
})
var template = function (data, pagination) {
    var pageSize = pagination.pageSize;
    var currentPageNumber = pagination.pageNumber - 1;
    var s = "";
    console.log(data);
    console.log(pagination);
    var count = 0;
    while (count < pageSize) {
        var i = currentPageNumber * pageSize + count;
        if (i >= data.length) {
            break;
        }
        s += createSingleFollowingUserElement(data[i]);
        count++;
    }
    return s;
}

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAD2Vqg-rHzg9WJee0Yh0VGH_i_5BQT61E",
    authDomain: "srsnproject.firebaseapp.com",
    databaseURL: "https://srsnproject.firebaseio.com",
    projectId: "srsnproject",
    storageBucket: "srsnproject.appspot.com",
    messagingSenderId: "237911674213"
};
firebase.initializeApp(config);
var username = window.localStorage.getItem("username");
var myDataRef = firebase.database().ref(username);
// Đừng xóa cái này nhé, nó dùng để push data lên firebase.
//myDataRef.push({
//    "1": "121",
//    "2": "28/2/2019"
//});
myDataRef.on('child_changed', function (snapshot) {
    var text = "";
    snapshot.forEach(function (childSnapshot) {
        //var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        text += childData + "<br/>";
    });
    displayNotifi(text);
});

myDataRef.on('child_added', function (snapshot) {
    var text = "";
    snapshot.forEach(function (childSnapshot) {
        //var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        text += childData + "<br/>";
    });
    displayNotifi(text);
});

const createSingleNotification = (name) =>
    `<li ><a href="#">${name}</a></li>`;
function displayNotifi(name) {
    let element = createSingleNotification(name);
    $("#list-notifi").prepend(element);
};

const createAvatarContainer = (user) =>
    `<div class="cover--avatar online" data-overlay="0.3" data-overlay-color="primary">
                                <img src="${user.avatarImageUrl}" alt="">
                            </div>

                            <div class="cover--user-name">
                                <h2 class="h3 fw--600">${user.lastName} ${user.firstName}</h2>
                            </div>
                            <div class="mem-statis-box">
                                <div>
                                    <span class="headline">Newbee</span>

                                    <div class="val">
                                        <span class="newbee" id="ranknewbee"></span>
                                        <span class="tastee" id="ranktastee"></span>
                                        <span class="cookee" id="rankcookee"></span>
                                        <span class="chefee" id="rankchefee"></span>
                                        <span class="mastee" id="rankmastee"></span>
                                    </div>
                                    <div class="text">
                                        <span class="user-lvl newbee"> newbee</span>
                                        <span class="user-lvl tastee"> tastee</span>
                                        <span class="user-lvl cookee"> cookee</span>
                                        <span class="user-lvl chefee"> chefee</span>
                                        <span class="user-lvl mastee"> mastee</span>

                                    </div>
                                </div>
                            </div>
                            <div class="cover--user-desc fw--400 fs--18 fstyle--i text-darkest">
                                <p>${user.description}</p>
                            </div>`;
const createSingleFollowingUserElement = (followingUser) =>
    `<div class="col-md-3 col-xs-6 col-xxs-12">
                                                    <!-- Member Item Start -->
                                                    <div class="member--item online">
                                                        <div class="img img-circle">
                                                            <a href="#" class="btn-link">
                                                                <img src="${followingUser.avatarImageUrl}" alt="">
                                                            </a>
                                                        </div>

                                                        <div class="name">
                                                            <h3 class="h6 fs--12">
                                                                <a href="#" class="btn-link">${followingUser.lastName} ${followingUser.firstName}</a>
                                                            </h3>
                                                        </div>
                                                        <div class="actions">
                                                            <ul class="nav">
                                                                <li>
                                                                    <a href="#" title="Send Message" class="btn-link" data-toggle="tooltip" data-placement="bottom">
                                                                        <i class="fa fa-envelope-o"></i>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#" title="Unfollow" class="btn-link" data-toggle="tooltip" data-placement="bottom">
                                                                        <i class="fa fa-user-plus"></i>
                                                                    </a>
                                                                </li>
                                                                
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <!-- Member Item End -->
                                                </div>`;
const callFollowingUserApi = async () => {
    var res = await fetch("https://localhost:44361/api/userfollowing/read-following-user?userid=27");
    var data = await res.json();
    for (var user of data) {
        var element = createSingleFollowingUserElement(user);
        $("#list-following-user").append(element);
    }
};
const callAccountInfoApi = async () => {

    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch("https://localhost:44361/api/account/read-userinfo", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    });
    var data = await res.json();
    var element = createAvatarContainer(data);
    $("#avatar-container").append(element);

    $("#myselect option[data-value='" + data.gender + "']").attr("selected", "selected");
    if (data.point >= 0 && data.point <= 99) {
        $("#ranknewbee").attr("class", "newbee active");
    } else if (data.point >= 100 && data.point <= 499) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
    } else if (data.point >= 500 && data.point <= 999) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
    } else if (data.point >= 1000 && data.point <= 4999) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $("#rankchefee").attr("class", "chefee active");
    } else if (data.point >= 5000) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $("#rankchefee").attr("class", "chefee active");
        $("#rankmastee").attr("class", "mastee active");
    }
};
