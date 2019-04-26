
const CallGetAllFollowUser = async (userName, limit = 16, page = 0) => {
    var res = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-following-user?userName=${userName}&limit=${limit}&page=${page}`);
    var data = await res.json();
    if (data.length < limit) {
        $(".recipe-more").css("display", "none");
    }
    for (var item of data) {
        var element = createSingleFollowingUserElement(item);
        $('#list-following-user').append(element);
        $('#list-following-user').css('height', '');
        $('#count-friends').html(data.length);
        $('.unfollow-btn').on('click', function (e) {
            var followingUserId = $(e.target).siblings('input').val();;
            var userName = localStorage.getItem('username');
            unfollowUserFunction(userName, followingUserId);
        });

    }
    //location.reload();
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
                                                                <a href="/account/timeline/${followingUser.username}" class="btn-link">${followingUser.lastName} ${followingUser.firstName} </a>
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

