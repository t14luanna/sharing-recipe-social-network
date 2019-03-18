﻿

const createRecipePost = (recipe) =>
    `<li><div class="activity--item ">
                                                    <div class="activity--avatar">
                                                        <a href="/MemberProfile">
                                                            <img src="${recipe.accountVM.avatarImageUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
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
                                                        <p>${recipe.recipeName}</p>
                                                    </div>

                                                                    <div class="link--desc">
                                                                        <p>${recipe.contentRecipe}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                            <div class="details-social-icons">
                                            <div class="like-count-${recipe.id} newsfeeds-social-icons"> </div>
<div class="newsfeeds-social-icons">
<a class="btn-share-post" title="Chia sẻ" data-recipe-id="${recipe.id}"><i class="fa fa-2x fa-share"></i></a>
<a href="#" title="Like" class="like-button">
                                                    <i class="fa fa-2x fa-heart-o" onclick="toggleLikeButton(this, ${recipe.id})" id="like-heart-${recipe.id}"></i>
                                                </a>
                                            <a id="btn-add-comment" onclick="callOpenCommentPostApi(${recipe.id})" title="Bình luận"><i class="fa fa-2x fa-comments-o"></i></a>
                                                
                                            </div>
                                                </div>
                                                    </div>
<div class="activity--comments fs--12">
                                                                            <ul class="acomment--items nav container-${recipe.id}">
</ul>
                                                                        </div>
                                                </div>

                                            </li>`;

// 
const callNewsfeedPageApi = async (limit = 10, page = 0) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/recipe/newsfeed?limit=${limit}&page=${page}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    var data = await res.json();
    if (!data || !data.length) {
        $(".load-more--btn").hide();
    }
    for (var item of data) {
        let date = new Date(item.createTime);
        var hr = date.getHours();
        var min = date.getMinutes();
        item.createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
        let element = createRecipePost(item);
        callIsLikeRecipe(item.id);
        $(".activity--items").append(element);
        callCountApi(item.id);
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
            $(`#like-heart-${recipeId}`).removeClass("fa-heart");
            $(`#like-heart-${recipeId}`).addClass("fa-heart");
        }
    } catch (e) {
        $(`#like-heart-${recipeId}`).removeClass("fa-heart");
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

            await callCountApi(recipeId);
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
const createShareRecipeModal = (recipe, dataUser) => `<li><div class="activity--list share-post-item">
                    <ul class="activity--items nav">
                        <li>
                            <div class="activity--item">
                                <div class="activity--avatar">
                                    <a href="/MemberProfile">
                                        <img src="${dataUser.avatarImageUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
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
                                                        <p>${recipe.recipeName}</p>
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
                </div></li>`;

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
const openCommentPost = (user, recipeId, username = "") => `<li class="comment-newsfeed-li comment-post-li"><div class="recipe-comments comment-post-container"><ul class="reply-baongoc">
                <li>
                    <div class="acomment--avatar">
                        <a href="#"><img class="user-reply-comment user-comment" src="${user.avatarImageUrl}" alt="avatar" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"></a>
                    </div>
                    <div class="comment comment-newsfeeds">
                        <div class="comment-form">
                            <textarea class="reply-comment" name="comment-${recipeId}" id="message" cols="3" rows="3">${username ? `@${username} ` : ``}</textarea>
                             <a onclick="callCreateCommentApi(${recipeId})" class="reply-button">Đăng</a>
                        </div>
                    </div>
                </li>
            </ul></div></li>`;
const callOpenCommentPostApi = async (recipeId) => {
    await callReadCommentApi(recipeId);
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var data = await res.json();
    var elementComment = openCommentPost(data, recipeId);
    $(`.container-${recipeId}`).append(elementComment)
};
const callCreateCommentApi = async (recipeId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var comment = $(`textarea[name="comment-${recipeId}"]`).val();
    if (comment != "") {
        var data = {
            recipeId: recipeId,
            commentContent: comment
        };
        var res = await fetch(`${BASE_API_URL}/api/comment/createComment`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status == 200) {
            await callOpenCommentPostApi(recipeId);
        }
    }
}
const callReadCommentApi = async (recipeId) => {

    var res = await fetch(`${BASE_API_URL}/${COMMENT_API_URL}/get-comment-by-recipeId?recipeId=${recipeId}`);
    var data = (await res.json()).result;

    var elements = $(`.comment-newsfeed-li`);
    if (elements[0]) {
        elements.remove();
    }
    for (var item of data) {

        let date = new Date(item.createTime);
        var hr = date.getHours();
        var min = date.getMinutes();
        item.createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
        var element = createSingleReplyComment(item);
        $(`.container-${recipeId}`).append(element);
    }
};
const callCountApi = async (recipeId) => {
    var countReply = await fetch(`${BASE_API_URL}/api/userreactionrecipe/get-like-share-count?recipeId=${recipeId}`);
    var dataCount = (await countReply.json());
   
    var elements = $(`.update-like-${recipeId}`);
    if (elements[0]) {
        elements.remove();
    }
    var element = createCountLine(dataCount,recipeId);
    $(`.like-count-${recipeId}`).append(element);
};
const createCountLine = (count, recipeId) => `<p class="update-like-${recipeId}">${count.likeCount} lượt thích, ${count.shareCount} lượt chia sẻ</p>`;
const createSingleReplyComment = (comment) =>
{
    var tagUserContents = comment.commentContent.match(/@(\w+)/gm);
    if (tagUserContents) {
        for (var item of tagUserContents) {
            comment.commentContent = comment.commentContent.replace(item, `<a href="/account/information/${item}">${item}</a>`);
            console.log(comment.commentContent);
        }
    }
    var element = `<li class="comment-newsfeed-li">
        <div class="acomment--item clearfix acomment--item-newsfeed">
            <div class="acomment--avatar">
                <a href="member-activity-personal.html">
                    <img src="${comment.avatarUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                </a>
            </div>
                        
            <div class="acomment--info">
                <div class="acomment--header">
                    <p><a href="#">${comment.fullName}</a> trả lời</p>
                </div>
                        
                <div class="acomment--meta">
                    <p><i class="fa mr--8 fa-clock-o"></i>${comment.createTime}</p>
                </div>
                        
                <div class="acomment--content">${comment.commentContent}
                </div>
                    <a href="#/" id="comment-link-${comment.id}" onclick="openReplyView(${comment.id}, ${comment.recipeId}, '${comment.fullName}')" class="reply-button reply-newsfeed-comment">Trả lời</a>                        
            </div>
        </div>
    </li>`;
    return element;
};

function openReplyView(commentId, commentRecipeId, username) {
    $(".comment-post-li").remove();
    var elementComment = openCommentPost(commentId, commentRecipeId, username);
    $(`.container-${commentRecipeId}`).append(elementComment)
};

