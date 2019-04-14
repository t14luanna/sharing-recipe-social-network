const createShareRecipePostElement = (post, recipe) =>
    `<li><div class="activity--item ">
                                                    <div class="activity--avatar">
                                                        <a href="/MemberProfile">
                                                            <img src="${post.accountVM.avatarImageUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                                        </a>
                                                    </div>

                                                    <div class="activity--info fs--14">
<div class="activity--meta fs--12 popular-item-${post.id}  popular-post-item ">
                                                        </div>
                                                        <div class="activity--header">
                                                            <p><a href="/MemberProfile">${post.accountVM.username}</a> đã chia sẻ một công thức</p>
                                                        </div>

                                                        <div class="activity--meta fs--12">
                                                            <p><i class="fa mr--8 fa-clock-o"></i>${post.createTime}</p>
                                                            <p class="share-content-newsfeed">${post.sharedStatus}</p>
                                                        </div>

                                                        <div class="activity--content">
                                                            <div class="link--embed">
                                                                <a class="link--url" href="/recipe/${recipe.id}" data-trigger="video_popup"></a>

                                                                <div class="">
                                                                    <div class="img-post-newsfeed"  style="background-image: url('${recipe.imageCover}'), url('/recipepress/images/no-image-icon-15.png')" alt="">
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
                                            <div class="like-count-${post.id} newsfeeds-social-icons"> </div>
                                            <div class="newsfeeds-social-icons">
                                            <a class="btn-share-post" onclick="openShareModal(this)" title="Chia sẻ" data-recipe-id="${recipe.id}" data-recipeOwner-name="${post.accountVM.username}"><i class="fa fa-2x fa-share"></i></a>
                                            <a href="#/" title="Like" class="like-button">
                                                                                                <i class="fa fa-2x fa-heart-o" onclick="toggleLikeButton(this, ${post.id},'${post.accountVM.username}')" id="like-heart-${post.id}"></i>
                                                                                            </a>
                                                                                        <a id="btn-add-comment" onclick="callOpenCommentPostApi(${post.id}, '${post.accountVM.username}')" title="Bình luận"><i class="fa fa-2x fa-comments-o"></i></a>
                                                
                                                                                        </div>
                                                                                            </div>
                                                                                                </div>
                                            <div class="activity--comments fs--12">
                                                                            <ul class="acomment--items nav container-${post.id}">
                                                                            </ul>
                                                                        </div>
                                                </div>

                                            </li>`;

const callIsLikeRecipeFunction = async (sharedId) => {
    try {
        var authorization = localStorage.getItem("authorization");
        var token = (JSON.parse(authorization))["token"];
        var res = await fetch(`${BASE_API_URL}/api/UserReactionRecipe/is-like?recipeId=${sharedId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status == 200) {
            $(`#like-heart-${sharedId}`).removeClass("fa-heart");
            $(`#like-heart-${sharedId}`).addClass("fa-heart");
        }
    } catch (e) {
        $(`#like-heart-${sharedId}`).removeClass("fa-heart");
        console.log("Is not liked")
    }

};
const callSharedReipeDetail = async (recipeId) => {
    var sharedRecipeRes = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipeid?recipeId=${recipeId}`);//lấy nội dung bài share
    var sharedRes = (await sharedRecipeRes.json());

    let date = new Date(sharedRes[0].createTime);
    var hr = date.getHours();
    var min = date.getMinutes();
    sharedRes[0].createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
    if (sharedRes[0].referencedRecipeId == null) {
        let element = createRecipePostElement(sharedRes[0]);
        callIsLikeRecipeFunction(sharedRes[0].id);
        $(".activity--items").append(element);
        callCountActionApi(sharedRes[0].id);
    } else {
        var recipeRes = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipeid?recipeId=${sharedRes[0].referencedRecipeId}`);//lấy nội dung recipe
        var recipeDetail = (await recipeRes.json());
        callIsLikeRecipeFunction(sharedRes[0].id);
        let element = createShareRecipePostElement(sharedRes[0], recipeDetail[0]);
        $(".activity--items").append(element);

        //$(`.popular-item-${sharedRes.id}`).append(popularPost);
        callCountActionApi(sharedRes[0].id);
    }

    

};
const callCountActionApi = async (recipeId) => {
    var countReply = await fetch(`${BASE_API_URL}/api/userreactionrecipe/get-like-share-count?recipeId=${recipeId}`);
    var dataCount = (await countReply.json());

    var elements = $(`.update-like-${recipeId}`);
    if (elements[0]) {
        elements.remove();
    }
    var element = createCountLine(dataCount, recipeId);
    $(`.like-count-${recipeId}`).append(element);
};
function openShareModal(e) {
    var recipeId = e.getAttribute("data-recipe-id");
    callShareRecipeModalApi(recipeId);
    $(".modal-share-post").css("display", "block");
}

async function toggleLikeButton(x, recipeId, recipeOwner) {
    try {
        var token = JSON.parse(localStorage.getItem('authorization')).token;
        var res = await fetch(`${BASE_API_URL}/api/userreactionrecipe/like?recipeId=${recipeId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        var data = await res.json();
        if (data.isLike) {

            await callCountActionApi(recipeId);
            x.classList.add("fa-heart");
            //them data vao firebase
            //chủ sở hữu recipe
            var usernameLocal = window.localStorage.getItem("username");//người đang like
            if (usernameLocal == recipeOwner) {
                //do nothing
            } else {
                
                var myDataRef = firebase.database().ref(recipeOwner);//chủ của recipe
                var uid = myDataRef.push({
                    "uid": "",
                    "username": usernameLocal,
                    "content": "đã thích Công Thức của bạn.",
                    "date": new Date().toLocaleString(),
                    "link": "/recipe/" + data.recipeId,
                    "isRead": "False"
                });
                //update uid into firebase
                SRSN.FIREBASE_DATABASE.ref("/" + recipeOwner + "/" + uid.key).update({
                    uid: uid.key
                });
            }
        }
        else {
            x.classList.remove("fa-heart");
        }
        callCountActionApi(recipeId);
    } catch (e) {
        alert("Like không thành công")

    }
}

const callOpenCommentPostApi = async (postRecipeId, recipeOwner) => {
    await callReadCommentApi(postRecipeId, recipeOwner);
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
    var elementComment = openCommentPost(data, postRecipeId, recipeOwner);
    $(`.container-${postRecipeId}`).append(elementComment)
};

const createCountLine = (count, recipeId) => `<p class="update-like-${recipeId}">${count.likeCount} lượt thích, ${count.shareCount} lượt chia sẻ</p>`;
const callReadCommentApi = async (recipeId, recipeOwner) => {

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
        var element = createSingleReplyComment(item, recipeOwner);
        $(`.container-${recipeId}`).append(element);
    }
};
const createSingleReplyComment = (comment, recipeOwner) => {
    var tagUserContents = comment.commentContent.match(/@(\w+)/gm);
    if (tagUserContents) {
        for (var item of tagUserContents) {
            comment.commentContent = comment.commentContent.replace(item, `<a href="/account/timeline/${item}">${item}</a>`);
            console.log(comment.commentContent);
        }
    }
    var element = `<li class="comment-newsfeed-li">
        <div class="acomment--item clearfix acomment--item-newsfeed">
            <div class="acomment--avatar">
                <a href="#">
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
                    <a href="#/" id="comment-link-${comment.id}" onclick="openReplyView(${comment.id}, ${comment.recipeId}, '${comment.fullName}', '${recipeOwner}')" class="reply-button reply-newsfeed-comment">Trả lời</a>                        
            </div>
        </div>
    </li>`;
    return element;
};
const openCommentPost = (user, postRecipeId, recipeOwner, commentOwner) => `<li class="comment-newsfeed-li comment-post-li"><div class="recipe-comments comment-post-container"><ul class="reply-baongoc">
                <li>
                    <div class="acomment--avatar">
                        <a href="#"><img class="user-reply-comment user-comment" src="${user.avatarImageUrl}" alt="avatar" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"></a>
                    </div>
                    <div class="comment comment-newsfeeds">
                        <div class="comment-form">
                            <textarea class="reply-comment" name="comment-${postRecipeId}" id="message" cols="3" rows="3">${commentOwner ? `@${commentOwner} ` : ``}</textarea>
                             <a onclick="callCreateCommentApi(${postRecipeId},'${recipeOwner}','${commentOwner}' )" class="reply-button">Đăng</a>
                        </div>
                    </div>
                </li>
            </ul></div></li>`;
function openReplyView(commentId, postRecipeId, commentOwner, recipeOwner) {
    $(".comment-post-li").remove();
    var elementComment = openCommentPost(commentId, postRecipeId, recipeOwner, commentOwner);
    $(`.container-${postRecipeId}`).append(elementComment)
};

const callCreateCommentApi = async (postRecipeId, recipeOwner, commentOwner) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var comment = $(`textarea[name="comment-${postRecipeId}"]`).val();
    if (comment != "") {
        var data = {
            recipeId: postRecipeId,
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
            await callOpenCommentPostApi(postRecipeId, recipeOwner);
            var usernameLocal = window.localStorage.getItem("username");//người đang comment
            if (commentOwner == "") {
                //comment notification
                //Đánh giá (comment) công thức firebase
                
                var myDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);//người sở hữu công thức
                var uid = myDataRef.push({
                    "uid": "",
                    "username": usernameLocal,
                    "content": "đã bình luận công thức của bạn",
                    "date": new Date().toLocaleString(),
                    "link": "/sharerecipe/" + postRecipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + recipeOwner + "/" + uid.key).update({
                    uid: uid.key
                });
            } else
                if (commentOwner != "") {//thông báo trả lời comment
                    //Đánh giá (comment) công thức firebase
                    if (recipeOwner != usernameLocal) {


                        var myDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);//người sở hữu công thức
                        var uid1 = myDataRef.push({
                            "uid": "",
                            "username": usernameLocal,
                            "content": "đã trả lời bình luận về công thức của bạn",
                            "date": new Date().toLocaleString(),
                            "link": "/sharerecipe/" + postRecipeId,
                            "isRead": "False"
                        });
                        //update uid into firebase 
                        SRSN.FIREBASE_DATABASE.ref("/" + recipeOwner + "/" + uid1.key).update({
                            uid: uid1.key
                        });
                    }
                    usernameLocal = window.localStorage.getItem("username");//người đang comment
                    if (usernameLocal != commentOwner) {

                        var myDataRef = SRSN.FIREBASE_DATABASE.ref(commentOwner);//người sở hữu comment

                        var uid2 = myDataRef.push({
                            "uid": "",
                            "username": usernameLocal,
                            "content": "đã trả lời bình luận của bạn",
                            "date": new Date().toLocaleString(),
                            "link": "/sharerecipe/" + postRecipeId,
                            "isRead": "False"
                        });
                        //update uid into firebase 
                        SRSN.FIREBASE_DATABASE.ref("/" + commentOwner + "/" + uid2.key).update({
                            uid: uid2.key
                        });
                    }
                }

        }
    }
}
const createRecipePostElement = (recipe) =>
    `<li><div class="activity--item ">
                                                    <div class="activity--avatar">
                                                        <a href="/MemberProfile">
                                                            <img src="${recipe.accountVM.avatarImageUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                                        </a>
                                                    </div>

                                                    <div class="activity--info fs--14">
                                                        <div class="activity--meta fs--12 popular-post-item popular-item-${recipe.id}">
                                                        </div>
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
                                                                    <div class="img-post-newsfeed"  style="background-image: url('${recipe.imageCover}'), url('/recipepress/images/no-image-icon-15.png')" alt="">
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
                                            <a class="btn-share-post" onclick="openShareModal(this)" title="Chia sẻ" data-recipe-id="${recipe.id}" data-recipeOwner-name="${recipe.accountVM.username}"><i class="fa fa-2x fa-share"></i></a>
                                            <a href="#/" title="Like" class="like-button">
                                                                                                <i class="fa fa-2x fa-heart-o" onclick="toggleLikeButton(this, ${recipe.id},'${recipe.accountVM.username}')" id="like-heart-${recipe.id}"></i>
                                                                                            </a>
                                                                                        <a id="btn-add-comment" onclick="callOpenCommentPostApi(${recipe.id}, '${recipe.accountVM.username}')" title="Bình luận"><i class="fa fa-2x fa-comments-o"></i></a>
                                                
                                                                                        </div>
                                                                                            </div>
                                                                                                </div>
                                            <div class="activity--comments fs--12">
                                                                            <ul class="acomment--items nav container-${recipe.id}">
                                                                            </ul>
                                                                        </div>
                                                </div>

                                            </li>`;
