const readTopTenUserFollow = (account, rankUser) =>
    `<li>
    <div class="single-chef">
        <a href="/account/information/${account.username}"><img src=${account.avatarImageUrl} alt="team" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/></a>
        <div class="chef-detail">
            <div class="chef-detail-inner">
                <h4>${account.firstName} ${account.lastName}</h4>
                <span class="type">${rankUser}</span>
                <p>${account.description}</p>
                <!--follow area-->
                <div class="follow-area-${account.id}">
                            <div class="follow-btn-custom" onclick="followUserFuntion(${account.id})">
                            <input type="hidden" value="" id="following-user-id">
                            <div class="favourite clearfix">
                               <div id="friend-status-div" class="btn-friend-stat">
                                <div data-bind="visible:true" style="">
                                    <span style="cursor:default">
                                    <a title="Theo dõi">
                                        <span class="fa fa-user-plus"></span>
                                        <span data-bind="visible: isposting" style="display: none;" class="fa fa-spin fa-spinner"></span>
                                        <span>Theo dõi</span>
                                    </a>
                                    <span class="count" title="Ðang du?c quan tâm"><i style=""></i><b></b><span class="countFollowing-${account.id}"></span></span>
                                </span>
                                </div>
                              </div>
                            </div>
                            </div>
             <!--end follow area-->
            </div>
        </div>
    </div>
  </li>`;

const readTopTenUserUnfollow = (account, rankUser) =>
    `<li>
    <div class="single-chef">
        <a href="/account/information/${account.username}"><img src=${account.avatarImageUrl} alt="team"/></a>
        <div class="chef-detail">
            <div class="chef-detail-inner">
                <h4><a href="/account/information/${account.username}">${account.firstName} ${account.lastName}</a></h4>
                <span class="type">${rankUser}</span>
                <p>${account.description}</p>
                <!--follow area-->
                <div class="follow-area-${account.id}">
                            <div class="follow-btn-custom" onclick="unfollowUserFuntion(${account.id})">
                            <input type="hidden" value="" id="unfollowing-user-id">
                            <div class="favourite clearfix">
                               <div id="friend-status-div" class="btn-friend-stat">
                                <div data-bind="visible:true" style="">
                                    <span style="cursor:default" >
                                    <a title="H?y theo dõi">
                                        <span class="fa fa-check"></span>
                                        <span>Ðang theo dõi</span>
                                    </a>
                                    <span class="count" title="Ðang du?c quan tâm"><i style=""></i><b></b><span class="countFollowing-${account.id}"></span></span>
                                </span>
                                </div>
                              </div>
                            </div>
                            </div>
             <!--end follow area-->
            </div>
        </div>
    </div>
  </li>`;

const readTopUserFollow = (account, rankUser) =>
    `<div class="left-side" >
                        <a href="/account/information/${account.username}"><img src=${account.avatarImageUrl} alt="thành viên d?ng d?u" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/></a>
                    </div>
                    <div class="right-side">
                        <h3><a href="/account/information/${account.username}">${account.firstName} ${account.lastName}</a></h3>
                        <span class="type">${rankUser}</span>
                        
                        <div class="separator-chef"></div>
                        <p>${account.description}</p>
                        <br />
                        <ul class="social-icons-chef">
                           <div class="follow-area-${account.id}">
                            <div class="follow-btn-custom" onclick="followUserFuntion(${account.id})">
                            <input type="hidden" value="" id="unfollowing-user-id">
                            <div class="favourite clearfix">
                               <div id="friend-status-div" class="btn-friend-stat">
                                <div data-bind="visible:true" style="">
                                    <span style="cursor:default" >
                                    <a title="Theo dõi">
                                        <span class="fa fa-user-plus"></span>
                                        <span>Theo dõi</span>
                                    </a>
                                    <span class="count" title="Ðang du?c quan tâm"><i style=""></i><b></b><span class="countFollowing-${account.id}"></span></span>
                                </span>
                                </div>
                              </div>
                            </div>
                            </div>
                        </ul>
                    </div>`;

const readTopUserUnfollow = (account, rankUser) =>
    `<div class="left-side" >
                        <a href="/account/information/${account.username}"><img src=${account.avatarImageUrl} alt="head chef" /></a>
                    </div>
                    <div class="right-side">
                        <h3><a href="/account/information/${account.username}">${account.firstName} ${account.lastName}</a></h3>
                        <span class="type">${rankUser}</span>
                        <div class="separator-chef"></div>
                        <p>${account.description}</p>
                        <br />

                        <ul class="social-icons-chef">
                           <div class="follow-area-${account.id}">
                            <div class="follow-btn-custom" onclick="unfollowUserFuntion(${account.id})">
                            <input type="hidden" value="" id="unfollowing-user-id">
                            <div class="favourite clearfix">
                               <div id="friend-status-div" class="btn-friend-stat">
                                <div data-bind="visible:true" style="">
                                    <span style="cursor:default" >
                                    <a title="H?y theo dõi">
                                        <span class="fa fa-check"></span>
                                        <span data-bind="visible: isposting" style="display: none;" class="fa fa-spin fa-spinner"></span>
                                        <span>Ðang theo dõi</span>
                                    </a>
                                    <span class="count" title="Ðang du?c quan tâm"><i style=""></i><b></b><span class="countFollowing-${account.id}"></span></span>
                                </span>
                                </div>
                              </div>
                            </div>
                            </div>
                        </ul>
                    </div>`



const checkFollow = (id, listFollowed) => {
    return listFollowed.some(acc => acc.id == id);
}
//Get top ten user
const callTopTenAccountApi = async () => {
    var userName = localStorage.getItem('username');
    var res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/get-top-ten`);
    var data = (await res.json());
    var resCheck = await fetch(`${BASE_API_URL}/api/userfollowing/read-following-user?userName=` + userName);
    var dataCheck = (await resCheck.json());
    var flag = false;
    for (var item of data) {
        if (flag == false) {
            flag = true;
            continue;
        }
        var rankUser;
        if (item.point >= 0 && item.point <= 99) {
            rankUser = "Newbee";
        } else if (item.point >= 100 && item.point <= 499) {
            rankUser = "Tastee";
        } else if (item.point >= 500 && item.point <= 999) {
            rankUser = "Cookee";
        } else if (item.point >= 1000 && item.point <= 4999) {
            rankUser = "Chefee";
        } else if (item.point >= 5000) {
            rankUser = "Mastee";
        }
        var description = item.description == null ? "" : item.description;
        item.description = description;
        //let element = readTopTenUsers(item, rankUser);
        let isFollowed = checkFollow(item.id, dataCheck);
        let element = isFollowed ? readTopTenUserUnfollow(item, rankUser) : readTopTenUserFollow(item, rankUser);
        $("#list-top-ten-users").append(element);
        var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${item.id}`);
        var userData = await userRes.json();
        $(".countFollowing-" + item.id).text(userData.length);
    }


};



//Get top user
const callTopAccountApi = async () => {
    var userName = localStorage.getItem('username');
    var res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/get-popular`);
    var data = (await res.json());
    var resCheck = await fetch(`${BASE_API_URL}/api/userfollowing/read-following-user?userName=` + userName);
    var dataCheck = (await resCheck.json());
    for (var item of data) {
        var rankUser;
        if (item.point >= 0 && item.point <= 99) {
            rankUser = "Newbee";
        } else if (item.point >= 100 && item.point <= 499) {
            rankUser = "Tastee";
        } else if (item.point >= 500 && item.point <= 999) {
            rankUser = "Cookee";
        } else if (item.point >= 1000 && item.point <= 4999) {
            rankUser = "Chefee";
        } else if (item.point >= 5000) {
            rankUser = "Mastee";
        }
        var description = item.description == null ? "" : item.description;
        item.description = description;
        //let element = readTopUser(item, rankUser);
        let isFollowed = checkFollow(item.id, dataCheck);
        let element = isFollowed ? readTopUserUnfollow(item, rankUser) : readTopUserFollow(item, rankUser);
        $("#read-top-user").append(element);
        var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${item.id}`);
        var userData = await userRes.json();
        $(".countFollowing-" + item.id).text(userData.length);
    }
};
