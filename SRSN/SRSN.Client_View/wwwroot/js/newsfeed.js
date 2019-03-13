

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
                                            <div class="details-social-icons newsfeeds-social-icons">

                                            <a id="btn-add-comment" title="Bình luận"><i class="fa fa-2x fa-comments-o"></i></a>
                                                <a href="#" title="Like" class="like-button">
                                                    <i class="fa fa-2x fa-heart-o" onclick="toggleLikeButton(this, ${recipe.id})" id="like-heart"></i>
                                                </a>
                                            <a class="btn-share-post" title="Chia sẻ" data-recipe-id="${recipe.id}"><i class="fa fa-2x fa-share"></i></a>
                                                </div>
                                                    </div>
                                                </div>
                                            </li>`;

const callNewsfeedPageApi = async () => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/recipe/newsfeed`, {
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
        callIsLikeRecipe(item.id);
        $(".activity--items").append(element);
        if (count >= 5) {
            break;
        }
    }
};
const callIsLikeRecipe = async (recipeId) => {
    try {
        var authorization = localStorage.getItem("authorization");
        var token = (JSON.parse(authorization))["token"];
        var res = await fetch(`${BASE_API_URL}/api/UserReactionRecipe/is-like?recipeId=${recipeId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status == 200) {
            $("#like-heart").removeClass("fa-heart");
            $("#like-heart").addClass("fa-heart");
        }
    } catch (e) {
        $("#like-heart").removeClass("fa-heart");
        console.log("Is not liked")
    }

};

async function toggleLikeButton(x, recipeId) {
    try {
        var token = JSON.parse(localStorage.getItem('authorization')).token;
        var res = await fetch(`https://localhost:44361/api/userreactionrecipe/like?recipeId=${recipeId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        var data = await res.json();
        if (data.isLike) {
            x.classList.add("fa-heart");
            //them data vao firebase
            var chefUsername = window.localStorage.getItem("chefusername");//chủ sở hữu recipe
            var usernameLocal = window.localStorage.getItem("username");//người đang like

            var myDataRef = firebase.database().ref(chefUsername);
            myDataRef.push({
                "username": usernameLocal,
                "content": "đã thích công thức của bạn.",
                "date": new Date().toLocaleString(),
                "link": "/recipe/" + recipeId,
                "isRead": "False"
            });

        }
        else {
            x.classList.remove("fa-heart");
        }
    } catch (e) {
        alert("Like không thành công")

    }
}
const createShareRecipeModal = (recipe, dataUser) => `<div class="activity--list share-post-item">
                    <ul class="activity--items nav">
                        <li>
                            <div class="activity--item">
                                <div class="activity--avatar">
                                    <a href="/MemberProfile">
                                        <img src="${dataUser.avatarImageUrl}" alt="">
                                    </a>
                                </div>

                                <div class="activity--info fs--14">
                                    <div class="activity--header">
                                        <p><a href="/MemberProfile">${dataUser.username}</a></p>
                                    </div>

                                    <div class="activity--content">
                                        <textarea placeholder="Chia sẻ của bạn" class="textarea-caption"></textarea>
                                        <div class="link--embed">
                                            <a class="link--url" href="/recipe/2" data-trigger="video_popup"></a>

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
                            </div>
                        </li>
                    </ul>
                    <a id="btn-share-recipe" onclick="callCreateShareRecipeModalApi(${recipe.id})" class="default-btn mid-button theme-color pull-right">Chia sẻ bài viết</a>
                </div>`;

const callShareRecipeModalApi = async (id) => {
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipeid?recipeId=${id}`);
    var data = (await res.json());
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var resUser = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var elements = $(`.share-post-item`);

    if (elements[0]) {

        elements.remove();

    }
    var dataUser = await resUser.json();
    for (var item of data) {
        var content = createShareRecipeModal(item, dataUser);
        $(".modal-body-share-post").append(content);
    }
};
const callCreateShareRecipeModalApi = async (id) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var comment = $(`.textarea-caption`).val();
    var data = {
        referencedRecipeId: id,
        sharedStatus: comment,
    };
    var res = await fetch(`${BASE_API_URL}/api/recipe/create-share-recipe`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status == 200) {
        $(".modal-share-post").css("display", "none");
        swal("", "Bạn đã chia sẻ công thức thành công", "success")
    }
};