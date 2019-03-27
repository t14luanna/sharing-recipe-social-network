var currentPage = 0;
const createRecipePost = (recipe) =>
    `<li><div class="activity--item" onclick="saveToLocalStorage(${recipe.id}, '${recipe.recipeName}', '${recipe.imageCover}','${recipe.createTime.split(' ')[0]}' )">
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

const createShareRecipePost = (post, recipe) =>
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
// 
const popularPost = () => `<p><i class="fa fa-fire" aria-hidden="true"></i> Bài đăng nổi bật</p>`;
const callNewsfeedPageApi = async (limit = 10, page = 0) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/recipe/newsfeed-follow?limit=${limit}&page=${page}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
     
    var data = await res.json();
    if (!data || !data.length) {
        var newPaging = page - currentPage - 1;
        callNewsfeedPagePopularApi(limit, newPaging);
    } else {
        currentPage = page;
        for (var item of data) {
            let date = new Date(item.createTime);
            var hr = date.getHours();
            var min = date.getMinutes();
            item.createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
            if (item.referencedRecipeId == null) {
                let element = createRecipePost(item);
                callIsLikeRecipe(item.id);
                $(".activity--items").append(element);
                callCountApi(item.id);
            } else {
                var recipeRef = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipe?recipeId=${item.referencedRecipeId}`);
                var dataRef = (await recipeRef.json());
                callIsLikeRecipe(item.id);
                for (var recipeRef of dataRef) {
                    let element = createShareRecipePost(item, recipeRef);
                    $(".activity--items").append(element);
                }
                callCountApi(item.id);
            }
        }
    }
   
};

const callNewsfeedPagePopularApi = async (limit, page) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/recipe/newsfeed-no-follow?limit=${limit}&page=${page}`, {
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
        if (item.referencedRecipeId == null) {
            let element = createRecipePost(item);
            callIsLikeRecipe(item.id);
            $(".activity--items").append(element);

            $(`.popular-item-${item.id}`).append(popularPost);
            callCountApi(item.id);
        } else {
            var recipeRef = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipe?recipeId=${item.referencedRecipeId}`);
            var dataRef = (await recipeRef.json());
            callIsLikeRecipe(item.id);
            
            for (var recipeRef of dataRef) {
                let element = createShareRecipePost(item, recipeRef);
                $(".activity--items").append(element);
            }
            $(`.popular-item-${item.id}`).append(popularPost);
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
            if (usernameLocal == recipeOwner) {
                //do nothing
            } else {
                var usernameLocal = window.localStorage.getItem("username");//người đang like
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
const callCreateShareRecipeModalApi = async (id, recipeOwner) => {
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
        //thông báo chia sẽ công thức (sharing notification)
        callCountApi(id);
        var usernameLocal = window.localStorage.getItem("username");//người đang comment
        var myDataRef;
        var uid;
        if (recipeOwner == usernameLocal) {
            //do nothing
        } else {
            try {
                console.log("Starting firebase")
                myDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);
                 uid = myDataRef.push({
                    "uid": "",
                    "username": usernameLocal,
                    "content": "đã chia sẽ bài viết của bạn.",
                    "date": new Date().toLocaleString(),
                    "link": "/recipe/" + data.recipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + recipeOwner + "/" + uid.key).update({
                    uid: uid.key
                });
                //thông báo cộng điểm
                myDataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);
                 uid = myDataRef.push({
                    "uid": "",
                    "username": "Bạn",
                    "content": "đã chia sẽ bài viết và được cộng thêm <b>5 điểm</b>",
                    "date": new Date().toLocaleString(),
                    "link": "/recipe/" + data.recipeId,
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
const openCommentPost = (user, recipeId, recipeOwner, commentOwner) => `<li class="comment-newsfeed-li comment-post-li"><div class="recipe-comments comment-post-container"><ul class="reply-baongoc">
                <li>
                    <div class="acomment--avatar">
                        <a href="#"><img class="user-reply-comment user-comment" src="${user.avatarImageUrl}" alt="avatar" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"></a>
                    </div>
                    <div class="comment comment-newsfeeds">
                        <div class="comment-form">
                            <textarea class="reply-comment" name="comment-${recipeId}" id="message" cols="3" rows="3">${commentOwner ? `@${commentOwner} ` : ``}</textarea>
                             <a onclick="callCreateCommentApi(${recipeId},'${recipeOwner}','${commentOwner}' )" class="reply-button">Đăng</a>
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
    var elementComment = openCommentPost(data, recipeId, recipeOwner);
    $(`.container-${recipeId}`).append(elementComment)
};
const callCreateCommentApi = async (recipeId, recipeOwner, commentOwner) => {
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
            await callOpenCommentPostApi(recipeId, recipeOwner);
            var usernameLocal = usernameLocal = window.localStorage.getItem("username");//người đang comment
            if (commentOwner == "") {


                //comment notification
                //Đánh giá (comment) công thức firebase
                 

                var myDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);//người sở hữu công thức
                var uid = myDataRef.push({
                    "uid": "",
                    "username": usernameLocal,
                    "content": "đã bình luận công thức của bạn",
                    "date": new Date().toLocaleString(),
                    "link": "/recipe/" + data.recipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + recipeOwner + "/" + uid.key).update({
                    uid: uid.key
                });
            } else
                if (commentOwner != "") {//thông báo trả lời comment
                    //Đánh giá (comment) công thức firebase

                    var myDataRef = SRSN.FIREBASE_DATABASE.ref(recipeOwner);//người sở hữu công thức
                    var uid1 = myDataRef.push({
                        "uid": "",
                        "username": usernameLocal,
                        "content": "đã trả lời bình luận về công thức của bạn",
                        "date": new Date().toLocaleString(),
                        "link": "/recipe/" + data.recipeId,
                        "isRead": "False"
                    });
                    //update uid into firebase 
                    SRSN.FIREBASE_DATABASE.ref("/" + recipeOwner + "/" + uid1.key).update({
                        uid: uid1.key
                    });

                    var usernameLocal = window.localStorage.getItem("username");//người đang comment

                    var myDataRef = SRSN.FIREBASE_DATABASE.ref(commentOwner);//người sở hữu comment
                    var uid2 = myDataRef.push({
                        "uid": "",
                        "username": usernameLocal,
                        "content": "đã trả lời bình luận của bạn",
                        "date": new Date().toLocaleString(),
                        "link": "/recipe/" + data.recipeId,
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

function openReplyView(commentId, commentRecipeId, commentOwner, recipeOwner) {
    $(".comment-post-li").remove();
    var elementComment = openCommentPost(commentId, commentRecipeId, recipeOwner, commentOwner);
    $(`.container-${commentRecipeId}`).append(elementComment)
};

const checkFollowUser = (id, listFollowed) => {
    return listFollowed.some(acc => acc.id == id);
};
//Get top 6 user
const callTopUserApi = async () => {
    var userName = localStorage.getItem('username');
    var res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/get-top-ten`);
    var data = (await res.json());
    var resCheck = await fetch(`${BASE_API_URL}/api/userfollowing/read-following-user?userName=` + userName);
    var dataCheck = (await resCheck.json());
    var count = 0
    for (var item of data) {
        var rankUser;
        var classRank;
        count++; 
        if (count > 6) {
            break;
        }
        if (item.point >= 0 && item.point <= 99) {
            rankUser = "Newbee";
            classRank = "user-lvl newbee";
        } else if (item.point >= 100 && item.point <= 499) {
            rankUser = "Tastee";
            classRank = "user-lvl tastee";
        } else if (item.point >= 500 && item.point <= 999) {
            rankUser = "Cookee";
            classRank = "user-lvl cookee";
        } else if (item.point >= 1000 && item.point <= 4999) {
            rankUser = "Chefee";
            classRank = "user-lvl chefee";
        } else if (item.point >= 5000) {
            rankUser = "Mastee";
            classRank = "user-lvl mastee";
        }
        var description = item.description == null ? "" : item.description;
        item.description = description;
        let isFollowed = checkFollowUser(item.id, dataCheck);
        let element = isFollowed ? followed_UserElement(item, rankUser, classRank) : follow_UserElement(item, rankUser, classRank);
        $("#top-user-list").append(element);

        var recipeRes = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read?userId=${item.id}`);
        var recipeData = await recipeRes.json();
        $(".countRecipe-" + item.id).text(recipeData.length);
        var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${item.id}`);
        var userData = await userRes.json();
        $(".countFollowing-" + item.id).text(userData.length);
        if (item.username == userName) {
            $(`.btnFollow-${item.id}`).remove();
        }
    };
}
const followed_UserElement = (user, rankUser, classRank) =>
    `<div class="member-item-wrapper">
                                            <div class="member-item" style="margin-top:10px">
                                                <div class="member-profile nopadding">
                                                    <div class="avatar z-effect">
                                                        <img src="${user.avatarImageUrl}" class="img-responsive img-circle">
                                                    </div>
                                                    <div class="profile">
                                                        <a class="cooky-user-link name" href="/account/information/${user.username}" >${user.firstName} ${user.lastName}</a>
                                                        <span class="${classRank}">${rankUser}</span>
                                                        <div class="stats">
                                                            <span class="stats-item">
                                                                <span class="countRecipe-${user.id}">57</span>
                                                                <span class="stats-text">Công thức</span>
                                                            </span>
                                                            <span class="stats-item">
                                                                <span class="countFollowing-${user.id}">0</span>
                                                                <span class="stats-text">Theo dõi</span>
                                                            </span>
                                                        </div>
                                                        <div class="member-acts btnFollow-${user.id}">
                                                            <button title="Hủy theo dõi" class="btn-follow ng-isolate-scope btn-followed" onclick="unfollowUserFuntion(${user.id})">
                                                                <span>Đang theo dõi</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
const follow_UserElement = (user, rankUser, classRank) =>
    `<div class="member-item-wrapper">
                                            <div class="member-item" style="margin-top:10px">
                                                <div class="member-profile nopadding">
                                                    <div class="avatar z-effect">
                                                        <img src="${user.avatarImageUrl}" class="img-responsive img-circle">
                                                    </div>
                                                    <div class="profile">
                                                        <a class="cooky-user-link name"  href="/account/information/${user.username}" >${user.firstName} ${user.lastName}</a>
                                                        <span class="${classRank}">${rankUser}</span>
                                                        <div class="stats">
                                                            <span class="stats-item">
                                                                <span class="countRecipe-${user.id}">57</span>
                                                                <span class="stats-text">Công thức</span>
                                                            </span>
                                                            <span class="stats-item">
                                                                <span class="countFollowing-${user.id}">0</span>
                                                                <span class="stats-text">Theo dõi</span>
                                                            </span>
                                                        </div>
                                                        <div class="member-acts btnFollow-${user.id}">
                                                            <button title="Theo dõi" class="btn-follow ng-isolate-scope btn-followed" ng-class="itemClass()" onclick="followUserFuntion(${user.id})">
                                                                <span>Theo dõi</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;