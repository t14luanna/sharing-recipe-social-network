
const checkFollow = (id, listFollowed) => {
    return listFollowed.some(acc => acc.id == id);
}

//get all user
const callGetAllUserApi = async (limit = 23, page = 0) => {
    var userName = localStorage.getItem('username');
    var resCheck = await fetch(`${BASE_API_URL}/api/userfollowing/read-following-user?userName=` + userName);
    var dataCheck = (await resCheck.json());
    var res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/get-all-user?limit=${limit}&page=${page}`);
    var data = (await res.json());
    var count = 0;
    for (var item of data) {
        var rankUser;
        count++;
        if (item.point >= 0 && item.point <= 99) {
            rankUser = "newbee";
        } else if (item.point >= 100 && item.point <= 499) {
            rankUser = "tastee";
        } else if (item.point >= 500 && item.point <= 999) {
            rankUser = "cookee";
        } else if (item.point >= 1000 && item.point <= 4999) {
            rankUser = "chefee";
        } else if (item.point >= 5000) {
            rankUser = "mastee";
        }
        var isFollowed = checkFollow(item.id, dataCheck);
        var followStatus = isFollowed ? btnFollowed_OnNewsfeed(item.id) : btnFollow_OnNewsfeed(item.id);
        var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${item.id}`);
        var userData = await userRes.json();

        var recipeRes = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read?userId=${item.id}`);
        var recipeData = await recipeRes.json();
        var bestRecipeRes = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/get-best-recipe-of-user?userId=${item.id}`);
        var bestRecipe = await bestRecipeRes.json();
        var element;
        if (count < 4 && page == 0) {
            element = userWithRecipeElement(item, bestRecipe.result, rankUser, count, recipeData.length, userData.length);
        } else {
            element = userElement(item, rankUser, recipeData.length, userData.length);
        }

        $("#list-all-users").append(element);
        if (item.username == userName) {
            $(".btnFollow-" + item.id).remove();
        } else {
            $(".btnFollow-" + item.id).html(followStatus);
        }
    }
    if (data.length < limit) {
        $(".recipe-more").remove();
    }
};

const userWithRecipeElement = (user, recipe, rankUser, num, countRecipe, countFollower) =>
    `<div class="member-item-wrapper ng-scope top-feature" >
                <div class="member-item">
                    <span class="topnum topnum${num}">${num}</span>
                    <div class="member-profile nopadding">
                        <div class="avatar z-effect">
                            <img class="img-responsive img-circle" src="${user.avatarImageUrl}" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                        </div>
                        <div class="profile">
                            <a class="cooky-user-link name ng-binding"  href="/account/information/${user.username}">${user.firstName} ${user.lastName}</a>
                            <span class="stats-text user-lvl ${rankUser}">${rankUser} </span>
                            <div class="stats">
                                <span class="stats-item">
                                    <span class="stats-count ng-binding">${countRecipe}</span>
                                    <span class="stats-text">Công thức</span>
                                </span>
                                <span class="stats-item">
                                    <span class="stats-count ng-binding countFollowing-${user.id}">${countFollower}</span>
                                    <span class="stats-text">Theo dõi</span>
                                </span>
                            </div>
                            <div class="member-acts btnFollow-${user.id}">
                                <button title="Hủy theo dõi" class="btn-follow ng-isolate-scope btn-followed">
                                    <span class="ng-scope">Đang theo dõi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="member-item-recipe clearfix ng-scope" style="padding-top:10px">
                       <div class="top-item ng-scope">
                            <a href="recipe/${recipe.id}">
                                <div class="img-responsive cover-recipe-contain" style="background-image: url(${recipe.imageCover})" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"></div>
                                <div class="name text-ellipsis ng-binding name-seen-recipe title-recipe-top">${recipe.recipeName}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
const userElement = (user, rankUser, countRecipe, countFollower) =>
    ` <div class="member-item-wrapper ng-scope" >
                <div class="member-item">
                    <div class="member-profile nopadding">
                        <div class="avatar z-effect">
                            <img  class="img-responsive img-circle" src="${user.avatarImageUrl}" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                        </div>
                        <div class="profile">
                            <a ng-href="/thanh-vien/hellie1207" class="cooky-user-link name ng-binding"  href="/account/information/${user.username}">${user.firstName} ${user.lastName}</a>
                            <span class="stats-text user-lvl ${rankUser}">${rankUser} </span>
                            <div class="stats">
                                <span class="stats-item">
                                    <span class="stats-count ng-binding">${countRecipe}</span>
                                    <span class="stats-text">Công thức</span>
                                </span>
                                <span class="stats-item">
                                    <span class="stats-count ng-binding countFollowing-${user.id}">${countFollower}</span>
                                    <span class="stats-text">Theo dõi</span>
                                </span>
                            </div>
                            <div class="member-acts btnFollow-${user.id}">
                                <button  title="Theo dõi"  class="btn-follow ng-isolate-scope" >
                                    <span class="ng-scope">Theo dõi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
