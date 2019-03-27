const apikey = 'Al45YPe3PTkSEr6vjtzg6z';
const client = filestack.init(apikey);
function uploadFile(file) {
    return new Promise((resolve, reject) => {
        client.upload(file)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    })
}

const createAvatarContainerUnfollow = (user, count) =>
    `<div class="cover--avatar online" data-overlay="0.3" data-overlay-color="primary">
                                <img src="${user.avatarImageUrl}" alt=""/>
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
                            </div>
                            <!--follow area-->
                            <div class="follow-area-${user.id}">
                            <div class="follow-btn-custom" onclick="unfollowUserFuntion(${user.id})">
                            <input type="hidden" value="${user.id}" id="unfollowing-user-id">
                            <div class="favourite clearfix">
                               <div id="friend-status-div" class="btn-friend-stat">
                                <div data-bind="visible:true" style="">
                                    <span style="cursor:default" data-bind="visible: status()==1">
                                    <a title="Hủy theo dõi" href="javascript:void(0)" data-bind="click:remove">
                                        <span class="fa fa-check"></span>
                                        <span data-bind="visible: isposting" style="display: none;" class="fa fa-spin fa-spinner"></span>
                                        <span>Đang theo dõi</span>
                                    </a>
                                    <span class="count" title="Đang được quan tâm"><i style=""></i><b></b><span class="countFollowing-${user.id}">${count}</span></span>
                                </span>
                                </div>
                              </div>
                            </div>
                            </div>
                            <!--end follow area-->
                            `;
//const createAvatarContainerFollow = (user) =>
//    `<div class="cover--avatar online" data-overlay="0.3" data-overlay-color="primary">
//                                <img src="${user.avatarImageUrl}" alt=""/>`;
const createAvatarContainer = (user, count) =>
    `<div class="cover--avatar online profile-pic" data-overlay="0.3" data-overlay-color="primary">
        <input type="hidden" name="avatarUrl"/>
                                <img class="" id="imgAvatar" src="${user.avatarImageUrl}" alt="" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
<div class="edit"><a href="javascript:void()" onclick="document.getElementById('avatarPicker').click()"><i class="fa fa-pencil fa-lg"></i><input type="file" id="avatarPicker" onchange="avatarPickerChange(this)" style="display:none;" /></a></div>
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
                            </div>
                            <div class="edit-avatar" style="display: none">
                                                    <button id="btnUpdateAvatar" onclick="btnUpdateAvatar_Click(this)" class="btn btn-primary btn-update-info"><span>Lưu thay đổi</span></button>
                                                </div>
                           <!--follow area-->
                            <div class="follow-area-${user.id}">
                            <div class="follow-btn-custom" onclick="followUserFuntion(${user.id})">
                            <input type="hidden" value="${user.id}" id="following-user-id">
                            <div class="favourite clearfix">
                               <div id="friend-status-div" class="btn-friend-stat">
                                <div data-bind="visible:true" style="">
                                    <span style="cursor:default">
                                        <a title="Quan tâm">
                                            <span class="fa fa-user-plus"></span>
                                            <span data-bind="visible: isposting" style="display: none;" class="fa fa-spin fa-spinner"></span>
                                            <span>Theo dõi</span>
                                        </a>
                                        <span class="count" title="Đang được theo dõi"><i style=""></i><b></b><span class="countFollowing-${user.id}">${count}</span>
                                        </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            </div>
                            <!--end follow area-->
                            `;
async function followUserFuntion(userId) {
    var userNameLocalStorage = localStorage.getItem("username");
    var res = await fetch(`${BASE_API_URL}/api/userfollowing/follow-user?userName=` + userNameLocalStorage + `&userFollowingId=` + userId)
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                $(".follow-area").html(btnFollowed(userId));
                //thông báo follow user
                callNotification(userId);

            }
        });
};
//const callNotification = async (userId) => {
//    var userNameLocalStorage = localStorage.getItem("username");
//    var userRes = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read?userId=${userId}`);
//    var userData = await userRes.json();
//    var myDataRef = SRSN.FIREBASE_DATABASE.ref(userData.username);
//    var uid = myDataRef.push({
//        "uid": "",
//        "username": userNameLocalStorage,
//        "content": "đang theo dõi bạn",
//        "date": new Date().toLocaleString(),
//        "link": "/account/information/" + userData.username,
//        "isRead": "False"
//    });
//    //update uid into firebase
//    SRSN.FIREBASE_DATABASE.ref("/" + userData.username + "/" + uid.key).update({
//        uid: uid.key
//    });
//};
async function unfollowUserFuntion(userId) {
    var userNameLocalStorage = localStorage.getItem("username");
    var res = await fetch(`${BASE_API_URL}/api/userfollowing/unfollow-user?userName=` + userNameLocalStorage + "&userFollowingId=" + userId)
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                //location.reload();
                $(".follow-area").html(btnFollow(userId));
            }
        });
};

//const btnFollow = (userId) => `<div class="follow-btn-custom"  onclick="followUserFuntion(${userId})">
//                            <input type="hidden" value="${userId}" id="following-user-id">
//                            <div class="favourite clearfix">
//                               <div id="friend-status-div" class="btn-friend-stat">
//                                <div data-bind="visible:true" style="">
//                                    <span style="cursor:default">
//                                        <a title="Quan tâm">
//                                            <span class="fa fa-user-plus"></span>
//                                            <span data-bind="visible: isposting" style="display: none;" class="fa fa-spin fa-spinner"></span>
//                                            <span>Theo dõi</span>
//                                        </a>
//                                        <span class="count" title="Đang được quan tâm"><i style=""></i><b></b><span data-bind="text: totalFollowing()">184</span>
//                                        </span>
//                                  </span>
//                                </div>
//                              </div>
//                            </div>`;
//const btnFollowed = (userId) => `
//<div class="follow-btn-custom"  onclick="unfollowUserFuntion(${userId})">
//                            <input type="hidden" value="${userId}" id="unfollowing-user-id">
//                            <div class="favourite clearfix">
//                               <div id="friend-status-div" class="btn-friend-stat">
//                                <div data-bind="visible:true" style="">
//                                    <span style="cursor:default" data-bind="visible: status()==1">
//                                    <a title="Hủy quan tâm" href="javascript:void(0)" data-bind="click:remove">
//                                        <span class="fa fa-check"></span>
//                                        <span data-bind="visible: isposting" style="display: none;" class="fa fa-spin fa-spinner"></span>
//                                        <span>Đang theo dõi</span>
//                                    </a>
//                                    <span class="count" title="Đang được quan tâm"><i style=""></i><b></b><span data-bind="text: totalFollowing()">487</span></span>
//                                </span>
//                                </div>
//                              </div>
//                            </div>`;


const loadAvatarContainer = async (username) => {
    $("#link-to-profile").attr("href", "/account/information/" + username);
    $("#link-to-following-user").attr("href", "/account/memberfriends/" + username);
    var userNameLocalStorage = localStorage.getItem("username");
    var res;
    var data;
    if (username == userNameLocalStorage) {
        var authorization = localStorage.getItem("authorization");
        var token = (JSON.parse(authorization))["token"];
        res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-userinfo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        data = await res.json();
    } else {
        res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-username?userName=${username}`); /* tim theo user name*/
        data = await res.json();//do 2 cach trả về giá trị khác nhau, data[0] là vị trí đầu tiên trong chuổi json

    }

    const checkFollow = (id, listFollowed) => {
        return listFollowed.some(acc => acc.id == id);
    }


    var resCheck = await fetch(`${BASE_API_URL}/api/userfollowing/read-following-user?userName=` + userNameLocalStorage);
    var dataCheck = (await resCheck.json());
    //get count user following
    var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${data.id}`);
    var userData = await userRes.json();

    var isFollowed = checkFollow(data.id, dataCheck);
    data.description = data.description == null ? "" : data.description;

    var element = isFollowed ? createAvatarContainerUnfollow(data, userData.length) : createAvatarContainer(data, userData.length);

    $("#avatar-container").append(element);
    if (username == userNameLocalStorage) {
        $(".follow-area-" + data.id).hide();
    }
    if (data.point >= 0 && data.point <= 99) {
        $("#ranknewbee").attr("class", "newbee active");
    } else if (data.point >= 100 && data.point <= 499) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $(".headline").text("Tastee").css("color", "#ffc107");
    } else if (data.point >= 500 && data.point <= 999) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $(".headline").text("Cookee").css("color", "#ff4f4f");

    } else if (data.point >= 1000 && data.point <= 4999) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $("#rankchefee").attr("class", "chefee active");
        $(".headline").text("Chefee").css("color", "#a930ca");

    } else if (data.point >= 5000) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $("#rankchefee").attr("class", "chefee active");
        $("#rankmastee").attr("class", "mastee active");
        $(".headline").text("mastee").css("color", "#ff0834");
    }
};

function avatarPickerChange(elePicker) {
    var elePreview = $("#imgAvatar");
    var reader = new FileReader();
    reader.onload = function (e) {
        elePreview.attr("src", e.target.result);
        // if change src
        // show btn Update AVtar Area
        $(".edit-avatar").show(300);
    };
    if (elePicker.files.length > 0) {
        reader.readAsDataURL(elePicker.files[0]);
    }


    if (data.username == userNameLocalStorage) {
        $(".dropdown").css("display", "none");
        //$(".follow-btn").css("display", "none");
        //$(".unfollow-btn").css("display", "none");
    }
};

async function btnUpdateAvatar_Click(btnUpdateAvatar) {
    var srcValue = $("#imgAvatar").attr("src");
    var avatarUrlFromFileStack = await uploadFile(srcValue);
    console.log(avatarUrlFromFileStack);
    $("input[name=avatarUrl]").val(avatarUrlFromFileStack.url);


    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    res = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    data = await res.json();
    var res = await fetch(`${BASE_API_URL}/api/account/update`, {
        method: 'PUT',
        body: JSON.stringify({
            'avatarImageUrl': $("input[name=avatarUrl]").val(),
            'firstName': $('#firstName').val(),
            'lastName': $('#lastName').val(),
            'gender': $('#gender>option:selected').val(),
            'birthdate': $('#birthdate').val(),
            'description': $('#hiddenDescription').val(),
            'phone': $('#hiddenPhone').val(),
            'email': $('#hiddenEmail').val(),
            'address': $('#hiddenAddress').val()
        }),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status == 200) {
        Swal.fire({
            type: 'success',
            title: 'Thông báo',
            text: 'Cập nhật thông tin thành công!',
        })
        setTimeout(async function () {
            var username = localStorage.getItem("username");
            window.location.href = `/account/information/${username}`
        }, 1500);
    }
}