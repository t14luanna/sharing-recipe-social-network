﻿var currentPage = 0;
var indexUser;
const createRecipePost = (recipe) =>
    `<li class="col-md-12 timeline-post" style ="list-style-type: none"><div class="activity--item col-md-8  col-md-offset-2">
                                                    <div class="activity--avatar">
                                                        <a href="/account/timeline/${recipe.accountVM.username}">
                                                            <img src="${recipe.accountVM.avatarImageUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                                        </a>
                                                    </div>

                                                    <div class="activity--info fs--14">
                                                        <div class="activity--meta fs--12 popular-post-item popular-item-${recipe.id}">
                                                        </div>
                                                        <div class="activity--header">
                                                            <p><a href="/account/timeline/${recipe.accountVM.username}"">${recipe.accountVM.firstName} ${recipe.accountVM.lastName}</a> đã đăng một công thức</p>
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

const createShareRecipePost = (post, recipe) =>
    `<li class="col-md-12 timeline-post" style ="list-style-type: none"><div class="activity--item col-md-8  col-md-offset-2">
                                                    <div class="activity--avatar">
                                                        <a href="/account/timeline/${post.accountVM.username}">
                                                            <img src="${post.accountVM.avatarImageUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                                        </a>
                                                    </div>

                                                    <div class="activity--info fs--14">
<div class="activity--meta fs--12 popular-item-${post.id}  popular-post-item ">
                                                        </div>
                                                        <div class="activity--header">
                                                            <p><a href="/account/timeline/${post.accountVM.username}">${post.accountVM.firstName} ${post.accountVM.lastName}</a> đã chia sẻ một công thức</p>
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

const callTimeLineApi = async (username, limit = 10, page = 0) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/recipe/get-time-line?userName=${username}&limit=${limit}&page=${page}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    var data = await res.json();
    if (!data || !data.length || data.length < limit) {
        $(".page-nav").hide();
    }
    for (var item of data) {
        let date = new Date(item.createTime);
        var hr = date.getHours();
        var min = date.getMinutes();
        item.createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
        if (item.referencedRecipeId == null) {
            let element = createRecipePost(item);
            callIsLikeRecipe(item.id);
            $(".timeline-personal").append(element);
            callCountApi(item.id);
        } else {
            var recipeRef = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipe?recipeId=${item.referencedRecipeId}`);
            var dataRef = (await recipeRef.json());
            callIsLikeRecipe(item.id);

            for (var recipeRef of dataRef) {
                let element = createShareRecipePost(item, recipeRef);
                $(".timeline-personal").append(element);
            }
            callCountApi(item.id);
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
            $(`#like-heart-${recipeId}`).removeClass("fa-heart");
            $(`#like-heart-${recipeId}`).addClass("fa-heart");
        }
    } catch (e) {
        $(`#like-heart-${recipeId}`).removeClass("fa-heart");
        console.log("Is not liked")
    }

};

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

            await callCountApi(recipeId);
            x.classList.add("fa-heart");
            //them data vao firebase
            //chủ sở hữu recipe
            var usernameLocal = window.localStorage.getItem("username");//người đang like

            if (usernameLocal == recipeOwner) {
                //do nothing
            } else {
                var userRes = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-userinfo`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                var countNoti = 0;
                var countDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);

                countDataRef.once('value', function (snapshot) {
                    countNoti = snapshot.val().numberOfLatestNotis;
                    countNoti++;
                    SRSN.FIREBASE_DATABASE.ref(recipeOwner).update({ "numberOfLatestNotis": countNoti });
                });
                var userData = await userRes.json();
                var myDataRef = firebase.database().ref(recipeOwner);//chủ của recipe
                var uid = myDataRef.push({
                    "uid": "",
                    "username": userData.firstName + " " + userData.lastName,
                    "content": "đã thích Công Thức của bạn.",
                    "date": new Date().toLocaleString(),
                    "link": "/sharerecipe/" + data.recipeId,
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
        callCountApi(recipeId);
    } catch (e) {
        alert("Like không thành công")

    }
}
const createShareRecipeModal = (recipe, dataUser, recipeOwner) => `<li><div class="activity--list share-post-item">
                    <ul class="activity--items nav">
                        <li>
                            <div class="activity--item">
                                <div class="activity--avatar">
                                    <a href="/account/timeline/${dataUser.username}">
                                        <img src="${dataUser.avatarImageUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                    </a>
                                </div>

                                <div class="activity--info fs--14">
                                    <div class="activity--header">
                                        <p><a href="/account/timeline/${dataUser.username}">${dataUser.firstName} ${dataUser.lastName}</a></p>
                                    </div>

                                    <div class="activity--content">
                                        <textarea placeholder="Chia sẻ của bạn" class="textarea-caption"></textarea>
                                        <div class="link--embed">
                                            <a class="link--url" href="/recipe/${recipe.id}" data-trigger="video_popup"></a>

                                            <div class="">
                                                <div class="img-post-newsfeed" style="background-image: url('${recipe.imageCover}'), url('/recipepress/images/no-image-icon-15.png')" alt="">
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
                    <a id="btn-share-recipe" onclick="callCreateShareRecipeModalApi(${recipe.id}, '${recipeOwner}')" class="default-btn mid-button theme-color pull-right">Chia sẻ bài viết</a>
                </div></li>`;

const callShareRecipeModalApi = async (id, recipeOwner) => {
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
        var content = createShareRecipeModal(item, dataUser, recipeOwner);
        $(".modal-body-share-post").append(content);
    }
};
const callCreateShareRecipeModalApi = async (id, postOwner) => {
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
        swal("", "Bạn đã chia sẻ công thức thành công", "success");
        //thông báo chia sẻ công thức (sharing notification)
        callCountApi(id);
        var usernameLocal = window.localStorage.getItem("username");//người đang comment
        var myDataRef;
        var uid;
        if (postOwner == usernameLocal) {// chia sẻ lại bài post
            //do nothing
        } else {
            try {
                var userRes = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-userinfo`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                var userData = await userRes.json();
                console.log("Starting firebase")
                //update count notifi
                var countNoti = 0;
                var countDataRef = SRSN.FIREBASE_DATABASE.ref(postOwner);

                countDataRef.once('value', function (snapshot) {
                    countNoti = snapshot.val().numberOfLatestNotis;
                    countNoti++;
                    SRSN.FIREBASE_DATABASE.ref(postOwner).update({ "numberOfLatestNotis": countNoti });
                });
                //thông báo cho chủ bài chia sẻ biết 
                myDataRef = SRSN.FIREBASE_DATABASE.ref(postOwner);
                uid = myDataRef.push({
                    "uid": "",
                    "username": userData.firstName + " " + userData.lastName,
                    "content": "đã chia sẻ bài viết của bạn.",
                    "date": new Date().toLocaleString(),
                    "link": "/sharerecipe/" + id,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + postOwner + "/" + uid.key).update({
                    uid: uid.key
                });

                
                //update count notifi
                var countNoti2 = 0;
                countDataRef2 = SRSN.FIREBASE_DATABASE.ref(usernameLocal);

                countDataRef2.once('value', function (snapshot) {
                    countNoti2 = snapshot.val().numberOfLatestNotis;
                    countNoti2++;
                    SRSN.FIREBASE_DATABASE.ref(usernameLocal).update({ "numberOfLatestNotis": countNoti2 });
                });

                //thông báo cộng điểm
                myDataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);
                uid = myDataRef.push({
                    "uid": "",
                    "username": "Bạn",
                    "content": "đã chia sẻ bài viết và được cộng thêm <b>5 điểm</b>",
                    "date": new Date().toLocaleString(),
                    "link": "/sharerecipe/" + id,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + usernameLocal + "/" + uid.key).update({
                    uid: uid.key
                });
                
            } catch (e) {
                console.error("Exception create rely comment: ", e);
            }
        }
    }
};
const openCommentPost = (user, recipeId, recipeOwner, commentOwner, replyfullname) => `<li class="comment-newsfeed-li comment-post-li"><div class="recipe-comments comment-post-container"><ul class="reply-baongoc">
                <li>
                    <div class="acomment--avatar">
                        <a href="#"><img class="user-reply-comment user-comment" src="${user.avatarImageUrl}" alt="avatar" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"></a>
                    </div>
                    <div class="comment comment-newsfeeds">
                        <div class="comment-form">
                            <textarea class="reply-comment" name="comment-${recipeId}" id="message" cols="3" rows="3">${commentOwner ? `@${replyfullname} ` : ``}</textarea>
                             <a onclick="callCreateCommentApi(${recipeId},'${recipeOwner}','${user.username}', '${0}' )" class="reply-button">Đăng</a>
                        </div>
                    </div>
                </li>
            </ul></div></li>`;
const callOpenCommentPostApi = async (recipeId, recipeOwner) => {
    await callReadCommentApi(recipeId, recipeOwner);
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
    indexUser = data;
    var elementComment = openCommentPost(data, recipeId, recipeOwner, );
    $(`.container-${recipeId}`).append(elementComment)
};
const callCreateCommentApi = async (recipeId, recipeOwner, commentParentOwner, commentParentId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];

    var comment = $(`textarea[name="comment-${recipeId}"]`).val();
    if (comment != "") {
        if (commentParentId != 0) {
            var data = {
                recipeId: recipeId,
                commentContent: comment,
                commentParentID: commentParentId
            };
        } else {
            var data = {
                recipeId: recipeId,
                commentContent: comment
            };
        }
        var res = await fetch(`${BASE_API_URL}/api/comment/createComment`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status == 200) {
            await callOpenCommentPostApi(recipeId, recipeOwner);
            var usernameLocal = usernameLocal = window.localStorage.getItem("username");//người đang comment
            var userRes = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-userinfo`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            //commentParentOwner :  comment cha
            //username local: người đang login
            //comment parent id : có đang tl cho comment nào ko
            var userData = await userRes.json();
            if (recipeOwner != usernameLocal && commentParentId == 0) {
                
                //comment notification
                //Đánh giá (comment) công thức firebase
                //thông báo cho chủ bài viết
                var countNoti = 0;
                var countDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);

                countDataRef.once('value', function (snapshot) {
                    countNoti = snapshot.val().numberOfLatestNotis;
                    countNoti++;
                    SRSN.FIREBASE_DATABASE.ref(recipeOwner).update({ "numberOfLatestNotis": countNoti });
                });

                var myDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);//người sở hữu bài viết
                var uid = myDataRef.push({
                    "uid": "",
                    "username": userData.firstName + " " + userData.lastName,
                    "content": "đã bình luận công thức của bạn",
                    "date": new Date().toLocaleString(),
                    "link": "/sharerecipe/" + data.recipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + recipeOwner + "/" + uid.key).update({
                    uid: uid.key
                });
            } else if (commentParentOwner != usernameLocal && commentParentId != 0) {//thông báo trả lời comment
                //Đánh giá (comment) công thức firebase
                //update count notifi
                var countNoti = 0;
                var countDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);

                countDataRef.once('value', function (snapshot) {
                    countNoti = snapshot.val().numberOfLatestNotis;
                    countNoti++;
                    SRSN.FIREBASE_DATABASE.ref(recipeOwner).update({ "numberOfLatestNotis": countNoti });
                });

                var myDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);//người sở hữu công thức
                var uid1 = myDataRef.push({
                    "uid": "",
                    "username": userData.firstName + " " + userData.lastName,
                    "content": "đã trả lời bình luận về công thức của bạn",
                    "date": new Date().toLocaleString(),
                    "link": "/sharerecipe/" + data.recipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + recipeOwner + "/" + uid1.key).update({
                    uid: uid1.key
                });
               

                //update count notifi
                var countNoti2 = 0;
                var countDataRef = SRSN.FIREBASE_DATABASE.ref(commentParentOwner);

                countDataRef.once('value', function (snapshot) {
                    countNoti2 = snapshot.val().numberOfLatestNotis;
                    countNoti2++;
                    SRSN.FIREBASE_DATABASE.ref(recipeOwner).update({ "numberOfLatestNotis": countNoti2 });
                });

                var myDataRef = SRSN.FIREBASE_DATABASE.ref(commentParentOwner);//người sở hữu comment
                var uid2 = myDataRef.push({
                    "uid": "",
                    "username": userData.firstName + " " + userData.lastName,
                    "content": "đã trả lời bình luận của bạn",
                    "date": new Date().toLocaleString(),
                    "link": "/sharerecipe/" + data.recipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + commentParentOwner + "/" + uid2.key).update({
                    uid: uid2.key
                });
                

            }

        }
    }
}
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
const callCountApi = async (recipeId) => {
    var countReply = await fetch(`${BASE_API_URL}/api/userreactionrecipe/get-like-share-count?recipeId=${recipeId}`);
    var dataCount = (await countReply.json());

    var elements = $(`.update-like-${recipeId}`);
    if (elements[0]) {
        elements.remove();
    }
    var element = createCountLine(dataCount, recipeId);
    $(`.like-count-${recipeId}`).append(element);
};
const createCountLine = (count, recipeId) => `<p class="update-like-${recipeId}">${count.likeCount} lượt thích, ${count.shareCount} lượt chia sẻ</p>`;
const createSingleReplyComment = (comment, recipeOwner) => {
    var tagUserContents = comment.commentContent.match('@' + comment.fullNameOwnerComment);
    if (tagUserContents) {
        for (var item of tagUserContents) {
            comment.commentContent = comment.commentContent.replace(item, `<a class="username-mention" href="/account/timeline/${comment.usernameOwnerComment}">${item}</a>`);
            console.log(comment.commentContent);
        }
    }
    var element = `<li class="comment-newsfeed-li">
        <div class="acomment--item clearfix acomment--item-newsfeed">
            <div class="acomment--avatar">
                <a href="/account/timeline/${comment.username}">
                    <img src="${comment.avatarUrl}" alt=""  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                </a>
            </div>
                        
            <div class="acomment--info">
                <div class="acomment--header">
                    <p><a href="/account/timeline/${comment.username}">${comment.fullName}</a> trả lời</p>
                </div>
                        
                <div class="acomment--meta">
                    <p><i class="fa mr--8 fa-clock-o"></i>${comment.createTime}</p>
                </div>
                        
                <div class="acomment--content">${comment.commentContent}
                </div>
                    <a href="#/" id="comment-link-${comment.id}" onclick="openReplyView(${comment.id}, ${comment.recipeId}, '${comment.username}', '${comment.fullName}', '${recipeOwner}')" class="reply-button reply-newsfeed-comment">Trả lời</a>                        
            </div>
        </div>
    </li>`;
    return element;
};

function openReplyView(commentId, commentRecipeId, commentOwner, replyfullname, recipeOwner) {
    $(".comment-post-li").remove();
    var elementComment = openReplyComment(commentId, commentRecipeId, recipeOwner, commentOwner, replyfullname);
    $(`.container-${commentRecipeId}`).append(elementComment)
};
const openReplyComment = (commentId, recipeId, recipeOwner, commentOwner, replyfullname ) => `<li class="comment-newsfeed-li comment-post-li"><div class="recipe-comments comment-post-container"><ul class="reply-baongoc">
                <li>
                    <div class="acomment--avatar">
                        <a href="#"><img class="user-reply-comment user-comment" src="${indexUser.avatarImageUrl}" alt="avatar" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"></a>
                    </div>
                    <div class="comment comment-newsfeeds">
                        <div class="comment-form">
                            <textarea class="reply-comment" name="comment-${recipeId}" id="message" cols="3" rows="3">${commentOwner ? `@${replyfullname} ` : ``}</textarea>
                             <a onclick="callCreateCommentApi(${recipeId},'${recipeOwner}','${commentOwner}', '${commentId}' )" class="reply-button">Đăng</a>
                        </div>
                    </div>
                </li>
            </ul></div></li>`;

