const callFollowingUserApi = async (userName) => {
        $('#pagination-container').pagination({
        dataSource: `${BASE_API_URL}/api/userfollowing/read-following-user?userName=` + userName,
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
            $('.unfollow-btn').on('click', function (e) {
                var followingUserId = $(e.target).siblings('input').val();;
                var userName = localStorage.getItem('username');
                unfollowUserFunction(userName, followingUserId);
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

const unfollowUserFunction = async (userName, followingUserId) => {
    var res = await fetch(`${BASE_API_URL}/api/userfollowing/unfollow-user?userName=` + userName + "&userFollowingId=" + followingUserId);
    var data = await res.json();
    //location.reload();
};

const createSingleFollowingUserElement = (followingUser) =>
    `<div class="col-md-3 col-xs-6 col-xxs-12">
                                                    <!-- Member Item Start -->
                                                    <div class="member--item online">
                                                        <div class="img img-circle">
                                                            <a href="/account/timeline/${followingUser.username}" class="btn-link">
                                                                <img src="${followingUser.avatarImageUrl}" alt="">
                                                            </a>
                                                        </div>

                                                        <div class="name">
                                                            <h3 class="h6 fs--12">
                                                                <a href="/account/timeline/${followingUser.username}" class="btn-link">${followingUser.firstName} ${followingUser.lastName} </a>
                                                            </h3>
                                                        </div>
                                                        <div class="actions">
                                                            <ul class="nav">
                                                                <li>
                                                                    <a href="#" title="Gửi tin nhắn" class="btn-link" data-toggle="tooltip" data-placement="bottom">
                                                                        <i class="fa fa-envelope-o"></i>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#" title="Bỏ theo dõi" class="btn-link unfollow-btn" data-toggle="tooltip" data-placement="bottom">
                                                                        <input type="hidden" value="${followingUser.id}">
                                                                        <i class="fa fa-user-times"></i>
                                                                    </a>
                                                                </li>
                                                                
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <!-- Member Item End -->
                                                </div>`;

