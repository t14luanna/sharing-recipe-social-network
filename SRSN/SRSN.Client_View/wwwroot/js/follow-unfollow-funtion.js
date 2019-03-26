﻿async function followUserFuntion(userId) {
    var userNameLocalStorage = localStorage.getItem("username");
    var check = false;
    var res = await fetch("https://localhost:44361/api/userfollowing/follow-user?userName=" + userNameLocalStorage + "&userFollowingId=" + userId)
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                $(".follow-area-" + userId).html(btnFollowed(userId));
                //thông báo follow user
                callNotification(userId);
                check = true;
            }
        });
    if (check) {
        var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${userId}`);
        var userData = await userRes.json();
        $(".countFollowing-" + userId).text(userData.length);
    }
};

const callNotification = async (userId) => {
    var userNameLocalStorage = localStorage.getItem("username");
    var userRes = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read?userId=${userId}`);
    var userData = await userRes.json();
    var myDataRef = SRSN.FIREBASE_DATABASE.ref(userData.username);
    var uid = myDataRef.push({
        "uid": "",
        "username": userNameLocalStorage,
        "content": "đang theo dõi bạn",
        "date": new Date().toLocaleString(),
        "link": "/account/information/" + userData.username,
        "isRead": "False"
    });
    //update uid into firebase
    SRSN.FIREBASE_DATABASE.ref("/" + userData.username + "/" + uid.key).update({
        uid: uid.key
    });
};
async function unfollowUserFuntion(userId) {
    var userNameLocalStorage = localStorage.getItem("username");
    var check = false;
    var res = await fetch(`${BASE_API_URL}/api/userfollowing/unfollow-user?userName=` + userNameLocalStorage + "&userFollowingId=" + userId)
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                //location.reload();
                $(".follow-area-" + userId).html(btnFollow(userId));
                check = true;
            }
        });
    if (check) {
        var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${userId}`);
        var userData = await userRes.json();
        $(".countFollowing-" + userId).text(userData.length);
    }
};

const btnFollow = (userId) => `<div class="follow-btn-custom"  onclick="followUserFuntion(${userId})">
                            <input type="hidden" value="${userId}" id="following-user-id">
                            <div class="favourite clearfix">
                               <div id="friend-status-div" class="btn-friend-stat">
                                <div data-bind="visible:true" style="">
                                    <span style="cursor:default">
                                        <a title="Quan tâm">
                                            <span class="fa fa-user-plus"></span>
                                            <span data-bind="visible: isposting" style="display: none;" class="fa fa-spin fa-spinner"></span>
                                            <span>Theo dõi</span>
                                        </a>
                                        <span class="count" title="Đang được quan tâm"><i style=""></i><b></b><span class="countFollowing-${userId}"></span>
                                        </span>
                                  </span>
                                </div>
                              </div>
                            </div>`;
const btnFollowed = (userId) => `
<div class="follow-btn-custom"  onclick="unfollowUserFuntion(${userId})">
                            <input type="hidden" value="${userId}" id="unfollowing-user-id">
                            <div class="favourite clearfix">
                               <div id="friend-status-div" class="btn-friend-stat">
                                <div data-bind="visible:true" style="">
                                    <span style="cursor:default" data-bind="visible: status()==1">
                                    <a title="Hủy quan tâm" href="javascript:void(0)" data-bind="click:remove">
                                        <span class="fa fa-check"></span>
                                        <span data-bind="visible: isposting" style="display: none;" class="fa fa-spin fa-spinner"></span>
                                        <span>Đang theo dõi</span>
                                    </a>
                                    <span class="count" title="Đang được quan tâm"><i style=""></i><b></b><span class="countFollowing-${userId}"></span></span>
                                </span>
                                </div>
                              </div>
                            </div>`;


