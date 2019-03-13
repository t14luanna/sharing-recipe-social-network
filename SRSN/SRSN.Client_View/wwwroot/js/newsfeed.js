

const createRecipePost = (recipe) =>
    `<li><div class="activity--item">
                                                    <div class="activity--avatar">
                                                        <a href="/MemberProfile">
                                                            <img src="${recipe.accountVM.avatarImageUrl}" alt="">
                                                        </a>
                                                    </div>

                                                    <div class="activity--info fs--14">
                                                        <div class="activity--header">
                                                            <p><a href="/MemberProfile">${recipe.accountVM.username}</a> đã đăng một công thức</p>
                                                        </div>

                                                        <div class="activity--meta fs--12">
                                                            <p><i class="fa mr--8 fa-clock-o"></i>${recipe.createTime}</p>
                                                        </div>

                                                        <div class="activity--content">
                                                            <div class="link--embed">
                                                                <a class="link--url" href="/recipe/${recipe.id}" data-trigger="video_popup"></a>

                                                                <div class="">
                                                                    <div class="img-post-newsfeed" style="background-image: url('${recipe.imageCover}');" alt="">
                                                                </div>

                                                                <div class="link--info fs--12">
                                                                    <div class="link--title">
                                                                        <h4 class="h6">${recipe.recipeName}</h4>
                                                                    </div>

                                                                    <div class="link--desc">
                                                                        <p>${recipe.contentRecipe}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>`;

const callNewsfeedPageApi = async () => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch("https://localhost:44361/api/recipe/newsfeed", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        
    });
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        let date = new Date(item.createTime);
        var hr = date.getHours();
        var min = date.getMinutes();
        item.createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
        let element = createRecipePost(item);
        $(".activity--items").append(element);
        if (count >= 5) {
            break;
        }
    }
};