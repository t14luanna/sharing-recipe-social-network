﻿const readTopTenUserFollow = (account, rankUser) =>
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

const readTopUserFollow = (account) =>
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

const readTopUserUnfollow = (account) =>
    `<div class="left-side" >
                        <a href="/account/information/${account.username}"><img src=${account.avatarImageUrl} alt="head chef" /></a>
                    </div>
                    <div class="right-side">
                        <h3><a href="/account/information/${account.username}">${account.firstName} ${account.lastName}</a></h3>
                        <span class="type">head chef</span>
                        <ul class="expertise">
                            <li>
                                <a href="#">
                                    <svg version="1.1" class="icon-container" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                         width="42px" height="48px" viewBox="0 0 42 48" enable-background="new 0 0 42 48" xml:space="preserve">
<g class="icon-svg">
                                    <path class="icon-svg" d="M6,29h0.051C6.019,29.162,6,29.329,6,29.5c0,1.379,1.122,2.499,2.5,2.499h25c1.38,0,2.5-1.12,2.5-2.499
		c0-0.171-0.019-0.338-0.051-0.5H36c0.006,0,0.014,0,0.021,0c0.552,0,1-0.448,1-1c0-0.071-0.008-0.14-0.022-0.207
		C36.888,19.065,29.754,12,21,12c-8.821,0-16,7.179-16,16C5,28.552,5.448,29,6,29z M33.5,29.999h-25C8.225,29.999,8,29.775,8,29.5
		C8,29.224,8.225,29,8.5,29h25c0.274,0,0.5,0.224,0.5,0.5C34,29.775,33.774,29.999,33.5,29.999z M21,14
		c7.383,0,13.45,5.746,13.965,13H33.5h-25H7.035C7.55,19.745,13.617,14,21,14z" />

                                    <circle cx="18.5" cy="22.5" r="1.5" />

                                    <path class="icon-svg" d="M36,31.999c-0.553,0-1,0.448-1,1c0,1.104-0.897,2-2,2H9c-1.102,0-2-0.896-2-2c0-0.552-0.446-1-1-1c-0.552,0-1,0.448-1,1
		C5,35.204,6.794,37,9,37h24c2.206,0,4-1.796,4-4.001C37,32.447,36.554,31.999,36,31.999z" />

                                    <circle class="icon-svg" cx="24.5" cy="18.5" r="1.501" />

                                    <circle class="icon-svg" cx="29.5" cy="22.5" r="1.5" />

</g>
</svg>
                                    fast food
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <svg version="1.1" class="icon-container" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                         width="42px" height="48px" viewBox="0 0 42 48" enable-background="new 0 0 42 48" xml:space="preserve">
<path class="icon-svg" d="M36.793,25.391C36.603,25.146,36.311,25,36,25H6c-0.311,0-0.603,0.146-0.793,0.391c-0.19,0.246-0.253,0.567-0.173,0.867
	l3.208,12.031C8.825,40.473,10.811,42,13.073,42h15.854c2.263,0,4.248-1.527,4.831-3.711l3.208-12.031
	C37.047,25.958,36.983,25.637,36.793,25.391z M31.826,37.773C31.477,39.085,30.283,40,28.927,40H13.073
	c-1.357,0-2.55-0.915-2.899-2.227L7.301,27h27.398L31.826,37.773z" />

<path class="icon-svg" d="M7,23c0.554,0,1-0.448,1-1c0-3.458,2.987-6.273,6.661-6.273c0.207,0,0.413,0.012,0.617,0.031
	c0.323,0.023,0.641-0.105,0.852-0.355C17.404,13.875,19.311,13,21.361,13c1.477,0,2.875,0.448,4.046,1.295
	c0.445,0.323,1.071,0.223,1.396-0.224c0.325-0.446,0.223-1.072-0.224-1.396c-0.748-0.541-1.567-0.954-2.433-1.235
	C24.674,10.762,25,9.922,25,9c0-2.206-1.795-4-4-4c-2.206,0-4,1.794-4,4c0,1.018,0.394,1.939,1.023,2.646
	c-1.164,0.465-2.219,1.168-3.086,2.088c-0.091-0.004-0.184-0.006-0.276-0.006C9.885,13.728,6,17.438,6,22C6,22.552,6.448,23,7,23z
	 M21,7c1.102,0,2,0.896,2,2c0,1.103-0.898,2-2,2c-1.102,0-2-0.896-2-2C19,7.896,19.898,7,21,7z" />

<path class="icon-svg" d="M23.049,18.313c-0.29,0.468-0.145,1.085,0.323,1.377c0.47,0.291,1.087,0.146,1.377-0.323C25.669,17.885,27.258,17,29.001,17
	C31.756,17,34,19.243,34,22c0,0.552,0.447,1,1,1c0.552,0,1-0.448,1-1c0-3.86-3.141-7.001-6.999-7.001
	C26.561,14.999,24.337,16.239,23.049,18.313z" />

</svg>
                                    dessert
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <svg version="1.1" class="icon-container" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                         width="42px" height="48px" viewBox="0 0 42 48" enable-background="new 0 0 42 48" xml:space="preserve">
<g>
                                    <path class="icon-svg" d="M24.576,22.897c0.138,0.065,0.282,0.094,0.423,0.094c0.377,0,0.737-0.213,0.908-0.577l7-14.998
		c0.231-0.5,0.017-1.095-0.484-1.329c-0.5-0.233-1.096-0.015-1.329,0.484l-7,14.997C23.86,22.069,24.077,22.665,24.576,22.897z" />

                                    <path class="icon-svg" d="M20.578,22.897c0.136,0.065,0.28,0.094,0.421,0.094c0.377,0,0.738-0.213,0.908-0.577l7-14.998
		c0.234-0.5,0.018-1.095-0.484-1.329c-0.498-0.233-1.093-0.015-1.328,0.484l-7,14.997C19.86,22.069,20.077,22.665,20.578,22.897z" />

                                    <path class="icon-svg" d="M36.758,18.129c-0.078-0.03-0.156-0.028-0.235-0.036c-0.795-1.986-2.537-3.527-4.727-3.971
		c-0.541-0.113-1.068,0.24-1.179,0.781c-0.109,0.542,0.24,1.069,0.781,1.179C33.485,16.505,35,18.36,35,20.491
		c0,0.553,0.447,1,0.999,1c0.554,0,1.001-0.447,1.001-1c0-0.037-0.009-0.072-0.011-0.109c1.555,0.697,2.012,1.319,2.012,1.61
		c0,1.356-6.354,3.999-18.001,3.999c-11.647,0-18-2.643-18-3.999c0-0.299,0.49-0.945,2.108-1.654C5.039,20.713,5,21.1,5,21.491
		C5,22.043,5.447,22.492,6,22.492c0.552,0,1-0.449,1-1.001c0-2.313,1.805-4.28,4.11-4.479c0.484-0.042,0.869-0.425,0.91-0.91
		c0.199-2.305,2.166-4.108,4.48-4.108c1.273,0,2.494,0.547,3.349,1.502c0.323,0.363,0.862,0.439,1.275,0.183
		c0.425-0.266,0.885-0.458,1.364-0.569c0.538-0.125,0.872-0.664,0.747-1.201c-0.125-0.538-0.664-0.873-1.2-0.747
		c-0.437,0.101-0.86,0.248-1.267,0.438c-1.179-1.029-2.695-1.606-4.268-1.606c-3.072,0-5.724,2.205-6.354,5.145
		c-1.643,0.352-3.037,1.346-3.965,2.68c-3.431,1.07-5.183,2.472-5.183,4.174c0,11.025,8.973,19.996,20.001,19.996
		s20.001-8.971,20.001-19.996C41.001,20.454,39.573,19.155,36.758,18.129z M21,39.988c-8.926,0-16.334-6.536-17.741-15.069
		c3.524,2.025,10.662,3.07,17.741,3.07s14.217-1.045,17.74-3.07C37.334,33.452,29.926,39.988,21,39.988z" />

</g>
</svg>
                                    chinese cuisine
                                </a>
                            </li>
                        </ul>
                        <div class="separator-chef"></div>
                        <p>${account.description}</p>
                        <br />
                        <a class="button-default theme-filled video-button" href="#">Watch Video</a>

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
