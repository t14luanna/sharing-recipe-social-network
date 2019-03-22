const readTopTenUserFollow = (account, rankUser) =>
 `<li>
    <div class="single-chef">
        <a href="/account/information/${account.username}"><img src=${account.avatarImageUrl} alt="team" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/></a>
        <div class="chef-detail">
            <div class="chef-detail-inner">
                <h4>${account.firstName} ${account.lastName}</h4>
                <span class="type">${rankUser}</span>
                <p>${account.description}</p>
                <ul class="social-icons-chef">
                    <li><a href="#" title="Theo dõi" class="btn-link follow-btn" data-toggle="tooltip" data-placement="bottom">
                            <input type="hidden" value="${account.id}">
                            <i class="fa fa-user-plus"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" title="Gửi tin nhắn" class="btn-link" data-toggle="tooltip" data-placement="bottom">
                            <i class="fa fa-envelope-o"></i>
                        </a>
                   </li>
                </ul>
            </div>
        </div>
    </div>
  </li>`;

const readTopTenUserUnfollow = (account, rankUser) =>
    `<li>
    <div class="single-chef">
        <a href="/account/information/${account.username}"><img src=${account.avatarImageUrl} alt="team" /></a>
        <div class="chef-detail">
            <div class="chef-detail-inner">
                <h4><a href="/account/information/${account.username}">${account.firstName} ${account.lastName}</h4>
                <span class="type">${rankUser}</span>
                <p>${account.description}</p>
                <ul class="social-icons-chef">
                    <li><a href="#" title="Unfollow" class="btn-link unFollow-btn" data-toggle="tooltip" data-placement="bottom">
                            <input type="hidden" value="${account.id}">
                            <i class="fa fa-user-times"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" title="Send Message" class="btn-link" data-toggle="tooltip" data-placement="bottom">
                            <i class="fa fa-envelope-o"></i>
                        </a>
                   </li>
                </ul>
            </div>
        </div>
    </div>
  </li>`;

const readTopUserFollow = (account, rankUser) =>
    `<div class="left-side" >
                        <a href="/account/information/${account.username}"><img src=${account.avatarImageUrl} alt="thành viên đứng đầu" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/></a>
                    </div>
                    <div class="right-side">
                        <h3><a href="/account/information/${account.username}">${account.firstName} ${account.lastName}</a></h3>
                        <span class="type">${rankUser}</span>
                        
                        <div class="separator-chef"></div>
                        <p>${account.description}</p>
                        <br />
                        <ul class="social-icons-chef">
                            <li><a href="" title="Follow" class="btn-link top-follow-btn" data-toggle="tooltip" data-placement="bottom">
                                    <input type="hidden" value="${account.id}" id="followTopAccount">
                                    <i class="fa fa-user-plus"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" title="Gửi tin nhắn" class="btn-link" data-toggle="tooltip" data-placement="bottom">
                            <i class="fa fa-envelope-o"></i>
                                </a>
                            </li>
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
                            <li>
                                <a href="#" title="Unfollow" class="btn-link unfollow-btn" data-toggle="tooltip" data-placement="bottom">
                                    <input type="hidden" value="${account.id}" id="unfollowTopAccount">
                                    <i class="fa fa-user-times"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" title="Send Message" class="btn-link" data-toggle="tooltip" data-placement="bottom">
                            <i class="fa fa-envelope-o"></i>
                                </a>
                            </li>
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
        //let element = readTopTenUsers(item, rankUser);
        let isFollowed = checkFollow(item.id, dataCheck);
        let element = isFollowed ? readTopTenUserUnfollow(item, rankUser) : readTopTenUserFollow(item, rankUser);
        $("#list-top-ten-users").append(element);
    }
    $('.follow-btn').click((e) => {
        e.preventDefault();
        var followingUserId = $(e.target).siblings('input').val();
        followUser(userName, followingUserId);
    });
    $('.unfollow-btn').click((e) => {
        e.preventDefault();
        var followingUserId = $(e.target).siblings('input').val();
        unfollowUser(userName, followingUserId);
    });
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
    }
    $('.top-follow-btn').click((e) => {
        e.preventDefault();
        var followingUserId = $("#followTopAccount").val();
        var userName = localStorage.getItem('username');
        followUser(userName, followingUserId);
    });
    $('.unfollow-btn').click((e) => {
        e.preventDefault();
        var followingUserId = $("#unfollowTopAccount").val();
        var userName = localStorage.getItem('username');
        unfollowUser(userName, followingUserId);
    });
};

const followUser = async (userName, followingUserId) => {
    var res = await fetch("https://localhost:44361/api/userfollowing/follow-user?userName=" + userName + "&userFollowingId=" + followingUserId)
        .then(res => res.json())
        .then(response => {
        if (response.success) {
            location.reload();
        }
    });
};

const unfollowUser = async (userName, followingUserId) => {
    var res = await fetch(`${BASE_API_URL}/api/userfollowing/unfollow-user?userName=` + userName + "&userFollowingId=" + followingUserId)
        .then(res => res.json())
        .then(response => {
        if (response.success) {
            location.reload();
        }
    });
};

$(document).ready((e) => {
    callTopTenAccountApi();
    callTopAccountApi();
});
