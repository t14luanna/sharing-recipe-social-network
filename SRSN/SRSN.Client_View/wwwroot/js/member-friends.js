
const callFollowingUserApi = async (userName) => {

    $('#pagination-container').pagination({
        dataSource: "https://localhost:44361/api/userfollowing/read-following-user?userName=" + userName,
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
            $('#list-following-user').css('height', '');
            $('#count-friends').html(data.length);
            $('.unfollow-btn').on('click', function () {
                var followingUserId = $(this).children('input').val();
                console.log(followingUserId);
                unfollowUser(userName, followingUserId);
            });
        }
    });
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
    };
};

const unfollowUser = async (userName, followingUserId) => {
    var res = await fetch("https://localhost:44361/api/userfollowing/unfollow-user?userName=" + userName + "&userId=" + followingUserId);
    var data = await res.json();
    location.reload();
};

const createSingleFollowingUserElement = (followingUser) =>
    `<div class="col-md-3 col-xs-6 col-xxs-12">
                                                    <!-- Member Item Start -->
                                                    <div class="member--item online">
                                                        <div class="img img-circle">
                                                            <a href="/account/information/${followingUser.username}" class="btn-link">
                                                                <img src="${followingUser.avatarImageUrl}" alt="">
                                                            </a>
                                                        </div>

                                                        <div class="name">
                                                            <h3 class="h6 fs--12">
                                                                <a href="/account/information/${followingUser.username}" class="btn-link">${followingUser.firstName} ${followingUser.lastName} </a>
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
                                                                    <a href="#" title="Unfollow" class="btn-link unfollow-btn" data-toggle="tooltip" data-placement="bottom">
                                                                        <input type="hidden" value="${followingUser.id}">
                                                                        <i class="fa fa-user-plus"></i>
                                                                    </a>
                                                                </li>
                                                                
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <!-- Member Item End -->
                                                </div>`;

//const callFollowingUserApi = async (userName) => {
//    var res = await fetch(`https://localhost:44361/api/userfollowing/read-following-user?userName=${userName}`);
//    var data = await res.json();
//    for (var user of data) {
//        var element = createSingleFollowingUserElement(user);
//        $("#list-following-user").append(element);
//    }
//};
//const callAccountInfoApi = async () => {

//    var authorization = localStorage.getItem("authorization");
//    var token = (JSON.parse(authorization))["token"];
//    var res = await fetch("https://localhost:44361/api/account/read-userinfo", {
//        method: "GET",
//        headers: {
//            'Content-Type': 'application/json',
//            'Authorization': `Bearer ${token}`
//        },

//    });
//    var data = await res.json();
//    $("#myselect option[data-value='" + data.gender + "']").attr("selected", "selected");
//    if (data.point >= 0 && data.point <= 99) {
//        $("#ranknewbee").attr("class", "newbee active");
//    } else if (data.point >= 100 && data.point <= 499) {
//        $("#ranknewbee").attr("class", "newbee active");
//        $("#ranktastee").attr("class", "tastee active");
//    } else if (data.point >= 500 && data.point <= 999) {
//        $("#ranknewbee").attr("class", "newbee active");
//        $("#ranktastee").attr("class", "tastee active");
//        $("#rankcookee").attr("class", "cookee active");
//    } else if (data.point >= 1000 && data.point <= 4999) {
//        $("#ranknewbee").attr("class", "newbee active");
//        $("#ranktastee").attr("class", "tastee active");
//        $("#rankcookee").attr("class", "cookee active");
//        $("#rankchefee").attr("class", "chefee active");
//    } else if (data.point >= 5000) {
//        $("#ranknewbee").attr("class", "newbee active");
//        $("#ranktastee").attr("class", "tastee active");
//        $("#rankcookee").attr("class", "cookee active");
//        $("#rankchefee").attr("class", "chefee active");
//        $("#rankmastee").attr("class", "mastee active");
//    }
//};
