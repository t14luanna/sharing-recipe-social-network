var listIngredient, recipeMainId;
const createSingleBannerRecipeDetail = (recipe) =>
    `<div class="wrapper-recipe-heading">
        <div class="heading">
            <h2>${recipe.recipeName}</h2>
        </div>
    </div>
<div class="dropdown col-md-offset-12" id="btnReportUser">
                    <span class="fa fa-ellipsis-v dropdown-toggle dropdown-report-user" type="button" data-toggle="dropdown" style="color:black;">
                    </span>
                    <ul class="dropdown-menu">
                        <li><a class="" data-toggle="modal" data-target="#myModal" href="">Báo cáo công thức</a></li>
                    </ul>
                </div>
    <div class="slider-recipe-detail2">
        <div class="wrapper-slider-detail">
            <div class="recipe-slider">
                <div class="slider-detail2">
                    <div>
                        <a href="${recipe.imageCover}" class="swipebox" rel="recipe-gallery"><img src="${recipe.imageCover}" alt="slide" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/></a>
                    </div>
                </div>
              
            </div>
            <ul class="recipe-specs-2">
                <li><span>Khẩu phần : </span>${recipe.serving}</li>
                <li><span>Thời gian nấu : </span>${recipe.cookTime} phút</li>
                <li><span>Độ khó : </span>${RECIPE_LEVEL_ENUM[recipe.levelRecipe]}</li>
            </ul>
        </div>
        ${ recipe.videoLink == null || recipe.videoLink == "" ? "":`<a href="${recipe.videoLink}" class="swipebox slider-video-button">Xem Video</a>`}
    </div>`;
const createContentRecipe = (recipe) =>
    `<span class="rating-figure" id="evRating"><u>Đánh giá: </u><span id="number-of-star-${recipe.id}" style="color:#56E920; font-size:20px"></span>&nbsp&nbsp(${recipe.evRating != 0 ? recipe.evRating : "Chưa có đánh giá nào"} ${recipe.evRating != 0 ? "/ 5" : ""}) 
    <i class="rating-figure" style="float: right;">Lượt xem: ${recipe.viewQuantity != null ? recipe.viewQuantity : "0"}</i>
    <i class="rating-figure" style="float:right; margin-right:20%">Ngày tạo: ${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</i>
    </span>
        <div class="separator-post"></div>
        <p>${recipe.contentRecipe}</p>`;

const createSingleIngredientOfRecipe = (ingredient) =>
    ` <li class="col-sm-4">
        <label>
            <input type="checkbox" value="${ingredient.recipeId}-${ingredient.ingredientName}" name="ori-ingredient"/><h4 class="title-ingredients">${ingredient.ingredientName}</h4> ${ingredient.quantitative} 
        </label>
    </li>`;
const createNumSteps = (num) =>
    `<dt class="current">
        <span class="arrow"><i class="fa fa-minus"></i><i class="fa fa-minus stand"></i></span><strong>Bước ${num}: </strong>
    </dt>`;
const createSingleStepOfRecipe = (step, images) =>
    `<dd>
        <div class="row">
            <div class="col-md-12">
                <p>
                    ${step.description}
                </p>
                                                    
            </div>
            <div id="step-images" class="col-md-12">
                ${images}
            </div>
        </div>
           ${step.tips == null || step.tips == "" ? "" : ` <div class="tips-variations">
                <h3>Mẹo nhỏ &amp; thông tin cần thiết</h3>
                <ul>
                    <li>
                        <p>
                            ${step.tips}
                        </p>
                    </li>
                </ul>
            </div>`}
    </dd>`;


const createStepImage = (imageUrl, count) => `<div class=" col-md-${count} img-step-recipe-${count}">
<img class="" src="${imageUrl}" alt="image" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
</div>`
const createStepOneImage = imageUrl => `<div class="col-md-12">
<img class="one-img-step-recipe" src="${imageUrl}" alt="image" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
</div>`
const createSingleRelatedRecipe = (recipe) =>
    `<div class="recipe-single" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
        <div class="recipe-image">
            <a href="/recipe/${recipe.id}"><img src="${recipe.imageCover}" alt="image" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"></a>
        </div>
        <div class="outer-detail">
            <div class="detail">
                <h3>
                    <a href="/recipe/${recipe.id}">
                        ${recipe.recipeName}
                    </a>
                </h3>
                <div class="short-separator"></div>
                <a href="/recipe/${recipe.id}" class="read-more">Xem thêm...</a>
            </div>
        </div>
    </div>`;
const createSingleRecipeDetailPageElement = (recipe) =>
    ` <li onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
            <div class="thumb" >
                <a href="/recipe/${recipe.id}">
                    <img src="${recipe.imageCover}" alt="thumbnail" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
                </a>
            </div>
            <div class="detail">
                <a href="/recipe/${recipe.id}">${recipe.recipeName}</a>
                <span class="post-date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</span>
            </div>
        </li>`;

const createProductItemElement = (product) =>
    `<li class="col-sm-12 item-checked-ingre">
        <label class="ingre-name-item">
            <input type="checkbox" value="${product.ingredientName}" name="ingredient" class="modal-product-item" data-product-id="${product.id}" data-product-name="${product.ingredientName}">${product.ingredientName}
        </label>
    </li>`;
//const createCheckedItemElement = (product) =>
//    `<li class="modal-product-item" data-product-id="${product}" data-product-name="${product}">${product}</li>`;
const createCheckedItemElement = (product) =>
    `<li class="col-sm-12 item-checked-ingre">
        <label class="ingre-name-item">
            <input type="checkbox" value="${product}" name="ingredient" class="modal-product-item" data-product-id="${product}" data-product-name="${product}">${product}
        </label>
    </li>`;
const createSingleRatingComment2 = (comment, commentReplyCount) =>
    `<li data-user-id="${comment.id}" name="main-comment">
        <div class="avatar">
            <a href="#"><img class="avatar-comment" src="${comment.avatarUrl}" alt="avatar" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';" /></a>
        </div>
        <div class="comment">
            <h5><a href="#">${comment.fullName}</a></h5>
            <span class="time">${comment.ratingTime}</span>

            <span class="rating-figure comment-rating-star">${comment.ratingRecipe} / 5 <span id="comment-id-${comment.id}"></span></span>
            
            <p>
                ${comment.ratingContent}
            </p>
                <a href="#/" id="comment-link-${comment.id}" onclick="openReplyView(${comment.id}, ${comment.recipeId})" class="reply-button">Bình luận (<span id="countComment">${commentReplyCount}</span>)</a>                        
        </div>
    </li>`;

const createChefByRecipeId = (chef, btnActionFollow) => `<h3 class="lined">Thông tin người thực hiện</h3>
    <div class="listing">
        <div class="image">
            <div class="image-inner">
                <a href="/account/timeline/${chef.username}"><img src="${chef.avatarImageUrl}" alt="chef" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/></a>
            </div>
        </div>
        <div class="detail">
            <div class="row">
                <div class="col-sm-8">
                    <h4><a href="/account/timeline/${chef.username}">${chef.lastName} ${chef.firstName}</a></h4>

                </div>
                <div class="col-sm-4" >
                    <ul style="position: absolute;right: -10px;">
                        <li>
                                ${btnActionFollow}
                        </li>
                    </ul>
                </div>
            </div>
            <p>
               ${ chef.description}
            </p>
            <a href="/account/timeline/${chef.username}" class="read-more-angle">Xem thêm...</a>
        </div>
    </div>`;
const followElement = (userId) => 
    `             <!--follow area-->
                                <div class="follow-area-${userId}">
                                            <div class="follow-btn-custom" onclick="followUserFuntion(${userId})">
                                            <div class="favourite clearfix">
                                               <div id="friend-status-div" class="btn-friend-stat">
                                                <div data-bind="visible:true" style="">
                                                    <span style="cursor:default">
                                                    <a title="Theo dõi">
                                                        <span class="fa fa-user-plus"></span>
                                                        <span>Theo dõi</span>
                                                    </a>
                                                    <span class="count" title="Đang được quan tâm"><i style=""></i><b></b><span class="countFollowing-${userId}">0</span></span>
                                                </span>
                                                </div>
                                              </div>
                                            </div>
                                            </div>
                             <!--end follow area-->`;
const unfollowElement = (userId) =>
    ` <!--follow area-->
                                <div class="follow-area-${userId}">
                                            <div class="follow-btn-custom" onclick="unfollowUserFuntion(${userId})">
                                            <div class="favourite clearfix">
                                               <div id="friend-status-div" class="btn-friend-stat">
                                                <div data-bind="visible:true" style="">
                                                    <span style="cursor:default">
                                                    <a title="Hủy theo dõi">
                                                        <span class="fa fa-check"></span>
                                                        <span>Đang theo dõi</span>
                                                    </a>
                                                    <span class="count" title="Đang được quan tâm"><i style=""></i><b></b><span class="countFollowing-${userId}">0</span></span>
                                                </span>
                                                </div>
                                              </div>
                                            </div>
                                            </div>
                             <!--end follow area-->`;
const callPopularRecipeDetailPageApi = async () => {
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-popular`);
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        let element = createSingleRecipeDetailPageElement(item);
        $("#popular-recipes-detail").append(element);
        if (count >= 5) {
            break;
        }
    }
};

const callRelatedRecipeApi = async (id) => {
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-related-recipe?userId=${id}`);
    var data = (await res.json());

    for (var item of data) {
        
        let element = createSingleRelatedRecipe(item);

        $("#list-related-recipe").append(element);
        
    }
};


const callIngrdientsOfRecipeApi = async (id) => {
    recipeMainId = id;
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipe?recipeId=${id}`);
    var data = (await res.json());
    for (var item of data) {
        listIngredient = item.listIngredient;
        for (var ingredients of item.listIngredient) {
            var ingredient = createSingleIngredientOfRecipe(ingredients);
            $("#list-of-ingredients").append(ingredient);
        }
        for (var cateItem of item.listCategory) {
            var cateItemElement = createCateItemTags(cateItem);
            $("#list-category-item-tags").append(cateItemElement);
        }

    }
};
const createCateItemTags = (tag) =>
    `<li class="text"><a href="#">${tag.categoryItemName == "null" ? "không có" : tag.categoryItemName}</a></li>`;

const callRecipeDetailApi = async (id) => {
    
    
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipeid?recipeId=${id}`);
    var data = (await res.json());
    var userid;
    if (data.length == 0) {
        return;
    }
        for (var item of data) {
            userid = item.userId;
            let element = createSingleBannerRecipeDetail(item);
            var content = createContentRecipe(item);
            $("#banner-recipe").append(element);
            $("#content-recipe").append(content);
            var numStar = item.evRating % 10;
            $("#number-of-star-" + item.id).text("");
            for (var i = 0; i < parseInt(numStar); i++) {
                $("#number-of-star-" + item.id).append(`<i class="fa fa-star" aria-hidden="true"></i>`);
            }
        }

        callIngrdientsOfRecipeApi(id);
        callRelatedRecipeApi(userid);
        callReadRatingCommentApi(id);
    

};
const callReadRatingCommentApi = async (recipeId) => {
    //tim user để biết comment của ai, thì người đó có thể xóa comment
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var resUser = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var user = await resUser.json();
    var userId = user.id;
    //
    var res = await fetch(`${BASE_API_URL}/${USER_REACTION_RECIPE_API_URL}/read-reactions?recipeId=${recipeId}`);
    var data = (await res.json()).data;
    var count = 0;
    for (var item of data) {
        var dataCount = (await callCountCommentsApi(recipeId, item.id));
        count++;
        let date = new Date(item.ratingTime);
        var hr = date.getHours();
        var min = date.getMinutes();
        item.ratingTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
        item.ratingContent = item.ratingContent == null ? "" : item.ratingContent
        var element = createSingleRatingComment2(item, dataCount)
        $("#list-rating-comment").append(element);
        var num = item.ratingRecipe % 10;
        for (var i = 0; i < parseInt(num); i++) {
            $("#comment-id-" + item.id).append(`<i class="fa fa-star" aria-hidden="true"></i>`);
        }
    }
    $("#numOfComment").append(count);
    $(`#delete-comment-${userId}`).css("display", "block");
};
const callCountCommentsApi = async (recipeId, recipeParentId) => {
    var countReply = await fetch(`${BASE_API_URL}/api/comment/get-count-reply-comment?recipeId=${recipeId}&recipeParentId=${recipeParentId}`);
    var dataCount = (await countReply.json());
    return dataCount;
};
const callReadProductByIngredientNameApi = async () => {
    try {
        //var res = await fetch(`${BASE_API_URL}/${PRODUCT_API_URL}/read-by-ingredient-name?name=${name}`);
        //var data = (await res.json());
        var itemIngre = $(`.item-checked-ingre`);
        if (itemIngre[0]) {

            itemIngre.remove();

        }
        for (var item of listIngredient) {
            var element = createProductItemElement(item);
            $(".modal-list-product-item").append(element);
        }
    } catch (e) {
        console.log(e);
    }
};

const getCheckedIngredient = async () => {
    try {
        var itemIngre = $(`.item-checked-ingre`);
        if (itemIngre[0]) {

            itemIngre.remove();

        }
        let listCheckedIngredient = [];
        $("input[name=ori-ingredient]:checked").each(function () {
            listCheckedIngredient.push(this.value.split("-")[1]);
        });
        for (var item of listCheckedIngredient) {
            var element = createCheckedItemElement(item);
            $(".modal-list-product-item").append(element);
        }
    } catch (e) {
        console.log(e);
    }
};
const callStepOfRecipeApi = async (recipeId) => {
    let stepImage;
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipe?recipeId=${recipeId}`);
    var data = (await res.json());
    var count = 0;
    for (var item of data) {
        for (var step of item.listSORVM) {
            count++;
            step.imageUrl = step.imageUrl.slice(0, -1) // remove trailing ";"
            let images = step.imageUrl.split(";");
            let resultStepImages = "";
            for (let image of images) {
                if (images.length > 1) {
                    if (images.length % 2 == 0 && images.length != 6) {
                        stepImage = createStepImage(image, 6);
                    } else {
                        stepImage = createStepImage(image, 4);
                    }
                } else {
                    stepImage = createStepOneImage(image);
                }
                resultStepImages += stepImage;
            }
            var num = createNumSteps(count);
            var step = createSingleStepOfRecipe(step, resultStepImages);
            
            num = num + step;
            $("#list-step-recipe").append(num);
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

const callChefRecipeApi = async (recipeId) => {
    var usernameLocal = window.localStorage.getItem("username");
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipe-chef?recipeId=${recipeId}`);
    var data = (await res.json());
    var chef = data.accountVM;
    var description = chef.description != null ? chef.description : "";
    chef.description = description;

    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var userFollowingRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/check-following-user?followingUserId=${chef.id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var userFollowingData = await userFollowingRes.json();

    var isFollow;

    isFollow = userFollowingData.active;
    
    var chefUsername = chef.username;
    var btnFollow;
    if (chefUsername == usernameLocal) {
        btnFollow = "";
    } else {
        btnFollow = isFollow ? unfollowElement(chef.id) : followElement(chef.id);
    }
    let chefView = createChefByRecipeId(chef, btnFollow);
    
    chefUsername = window.localStorage.setItem("chefusername", chefUsername);
    $(".about-chef").append(chefView);

    var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${chef.id}`);
    var userData = await userRes.json();
    $(".countFollowing-" + chef.id).text(userData.length);
};
const callReadNearByStoresApi = async (userLat, userLong, ingredientName) => {
    setMapOnAll(null);

    var res = await fetch(`${BASE_API_URL}/api/product/read-nearby-store?userLat=${userLat}&userLong=${userLong}&ingredientName=${ingredientName}`);
    var data = (await res.json());

    for (var item of data) {
        var itemLatLng = { lat: item.lat, lng: item.long };
        var marker = new google.maps.Marker({
            position: itemLatLng,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        });
        var itemName = item.name + " (" + item.address + " )";
        marker.setAnimation(google.maps.Animation.BOUNCE);
        addInfoWindow(marker, itemName);
        marker.setMap(map);
        markers.push(marker);
    }
};
const callReadListIngredientNearByStoresApi = async (userLat, userLong, ingredientNames) => {
    setMapOnAll(null);
    for (var ingre of ingredientNames) {
        $(`input[value='${ingre}']`).prop("checked", true);
    }
    var nostores = $(`.warning-no-stores`);
    if (nostores[0]) {

        nostores.remove();

    }
    if (ingredientNames.length > 0) {
        var data = {
            userLat: userLat,
            userLong: userLong,
            ingredientNames: ingredientNames
        };
        var res = await fetch(`${BASE_API_URL}/api/product/read-list-ingredient-nearby-store`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        var dataPos = await res.json();
        setMapOnAll(null);
        if (dataPos.length > 0) {
            for (var item of dataPos) {
                var itemLatLng = { lat: item.lat, lng: item.long };
                var marker = new google.maps.Marker({
                    position: itemLatLng,
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        scaledSize: new google.maps.Size(35, 35),
                    }
                });
                var itemName = item.name + " (" + item.address + " )";

                marker.setAnimation(google.maps.Animation.BOUNCE);
                addInfoWindow(marker, itemName);
                marker.setMap(map);
                markers.push(marker);
            }
        } else {

            $(".checked-ingre-box").append("<h6 class='warning-no-stores'>Không có cửa hàng gần bạn bán những sản phẩm này</h6>")
        }
    }
};
function addInfoWindow(marker, message) {

    var infoWindow = new google.maps.InfoWindow({
        content: message
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    });
};
const alertSucces = () =>
    `<p class="alert green alert-success">Đăng đánh giá thành công!<span class="close-alert"><i class="fa fa-close"></i></span></p>`;
const alertStarWarning = () =>
    `<p class="alert red alert-comment">Bạn chưa chọn mức sao đánh giá (rating).<span class="close-alert"><i class="fa fa-close"></i></span></p>`;
const alertRatedWarning = () =>
    `<p class="alert red alert-comment">Bạn đã rating công thức này trước đây<span class="close-alert"><i class="fa fa-close"></i></span></p>`;
const alertLoginWarning = () =>
    `<p class="alert red alert-comment">Hãy đăng nhập để đánh giá bài viết<span class="close-alert"><i class="fa fa-close"></i></span></p>`;
function removeAlert() {
    var alertItem = $(`.alert`);
    if (alertItem[0]) {

        alertItem.remove();

    }
}
const callCreateRatingRecipe2Api = async (recipeId, star, comment) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    if (!star) {
        removeAlert();
        $(".form-rating-recipe").append(alertStarWarning);
        return;
    }
    if (!token) {
        removeAlert();
        $(".form-rating-recipe").append(alertLoginWarning);
        return;
    }
    var data = {
        recipeId: recipeId,
        ratingContent: comment,
        ratingRecipe: star
    };
    var res = await fetch(`${BASE_API_URL}/${USER_REACTION_RECIPE_API_URL}/create-rating`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status == 200) {//successfully
        $(".form-rating-recipe").append(alertSucces);
        $("textarea[name='comment']").val('');
        var itemIngre = $(`li[name=main-comment]`);
        if (itemIngre[0]) {

            itemIngre.remove();

        }
        callReadRatingCommentApi(recipeId);
        //thông báo
        //Đánh giá (comment) công thức firebase
        var resUser = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        var userData = await resUser.json();
        var chefUsername = window.localStorage.getItem("chefusername");//chủ sở hữu recipe
        var usernameLocal = window.localStorage.getItem("username");//người đang comment
        var myDataRef;
        var uid;
        if (chefUsername == usernameLocal) {
            //do nothinng
        } else {
             myDataRef = SRSN.FIREBASE_DATABASE.ref(chefUsername);
            uid = myDataRef.push({
                "uid": "",
                "username": userData.lastName + " " +  userData.firstName ,
                "content": "đã đánh giá công thức của bạn: " + data.ratingContent + " - " + data.ratingRecipe + " sao",
                "date": new Date().toLocaleString(),
                "link": "/recipe/" + data.recipeId,
                "isRead": "False"
            });
            //update uid into firebase 
            SRSN.FIREBASE_DATABASE.ref("/" + chefUsername + "/" + uid.key).update({
                uid: uid.key
            });
            //update count notifi
            var countNoti = 0;
            var countDataRef = SRSN.FIREBASE_DATABASE.ref(chefUsername);

            countDataRef.once('value', function (snapshot) {
                countNoti = snapshot.val().numberOfLatestNotis;
                countNoti++;
                SRSN.FIREBASE_DATABASE.ref(chefUsername).update({ "numberOfLatestNotis": countNoti });
                countNoti = 0;
            });

            //thong bao cho nhung người đang follow tôi để họ biết tôi đã đánh giá công thức này
            var userRes = await fetch(`${BASE_API_URL}/${USER_FOLLOWING_API_URL}/read-user-following-me-by-id?followingUserId=${userData.id}`);
            var userFollowingData = await userRes.json();
            var chefRes = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-username?username=${chefUsername}`);
            var chefData = await chefRes.json();
            var chefFullname = chefData.lastName + " " + chefData.firstName;
            for (var user of userFollowingData) {
                myDataRef = SRSN.FIREBASE_DATABASE.ref(user.username);
                uid = myDataRef.push({
                    "uid": "",
                    "username": userData.lastName + " " + userData.firstName,
                    "content": "đã đánh giá công thức của <b>" + chefFullname + "</b>",
                    "date": new Date().toLocaleString(),
                    "link": "/recipe/" + data.recipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + user.username + "/" + uid.key).update({
                    uid: uid.key
                });
                
            }
            //update count notifi
                countNoti = 0;
                //myDataRef = SRSN.FIREBASE_DATABASE.ref(user.username);

                myDataRef.once('value', function (snapshot) {
                    countNoti = snapshot.val().numberOfLatestNotis;
                    countNoti++;
                    SRSN.FIREBASE_DATABASE.ref("/" + user.username).update({ numberOfLatestNotis: countNoti });
                });
        }
        //thông báo cộng điểm
        myDataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);
        uid = myDataRef.push({
            "uid": "",
            "username": "Bạn",
            "content": "đã đánh giá công thức và được cộng thêm <b>5 điểm</b>",
            "date": new Date().toLocaleString(),
            "link": "/recipe/" + data.recipeId,
            "isRead": "False"
        });
        //update uid into firebase
        SRSN.FIREBASE_DATABASE.ref("/" + usernameLocal + "/" + uid.key).update({
            uid: uid.key
        });
        //update count notifi
        var countNoti = 0;
        var countDataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);

        countDataRef.once('value', function (snapshot) {
            countNoti = snapshot.val().numberOfLatestNotis;
            countNoti++;
            SRSN.FIREBASE_DATABASE.ref(usernameLocal).update({ "numberOfLatestNotis": countNoti });
            countNoti = 0;
        });
        
        
        $(".close-alert").on("click", function () {
            $(this).parent(".alert").slideUp();
        });
        
    } else if (res.status == 400) {
        removeAlert();
        $(".form-rating-recipe").append(alertRatedWarning);


        $(".close-alert").on("click", function () {
            $(this).parent(".alert").slideUp();
        });
        return;
    }
};
const createReplyView = (replyUser, cmtId, recipeId) => `<ul class="reply-${replyUser.username}">
                <li>
                    <div class="avatar">
                        <a href="#"><img class="user-reply-comment" src="${replyUser.avatarImageUrl}" alt="avatar" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/></a>
                    </div>
                    <div class="comment">
                        <h5><a href="#">${replyUser.lastName} ${replyUser.firstName}</a></h5>
                        <div class="comment-form">
                            <textarea class="reply-comment" name="reply-${cmtId}" id="message" cols="3" rows="3"></textarea>
                                        <a onclick="callCreateReplyCommentApi(${recipeId}, ${cmtId})" class="reply-button">Đăng</a>
                        </div>
                    </div>
                </li>
            </ul>`;
const openReplyView = async (cmtId, recipeId) => {
    var repliedEle = $(`.replied`);
    if (repliedEle[0]) {

        repliedEle.remove();

    }
    await callGetReplyComtApi(cmtId, recipeId);
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
    var elements = $(`.reply-${data.username}`);

    if (elements[0]) {
        elements.remove();
    }
    let chefView = createReplyView(data, cmtId, recipeId);
    $(`li[data-user-id=${cmtId}]`).append(chefView);
};
const createSingleReplyComment = (replyComment, parentId) => `<ul class="replied replied-${parentId}" id="reply-${replyComment.id}">
                <li>
                    <div class="avatar">
                        <a href="#"><img class="user-reply-comment" src="${replyComment.avatarUrl}"  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';" alt="avatar"/></a>
                    </div>
                    <div class="comment">
                    <div class="dropdown dropdown-custom" id="delete-comment-${replyComment.userId}" style="display:none">
                        <span class="fa fa-ellipsis-v dropdown-toggle" type="button" id="menu1" data-toggle="dropdown"></span>
                            <ul class="dropdown-menu dropdown-menu-custom"  role="menu" aria-labelledby="menu1" >
                                <li class="comment-owner-${replyComment.userId}" ><a href="#" onclick="deactivateComment(${replyComment.id},${replyComment.recipeId}, ${parentId})">Xóa</a></li>
                                
                            </ul>
                    </div>
                    
                        <h5><a href="#">${replyComment.fullName}</a></h5><span class="time">${replyComment.createTime}</span>
                        <p>${replyComment.commentContent}</p>
                    </div>
                </li>
            </ul>`;
const callGetReplyComtApi = async (parentId, recipeId) => {
    var res = await fetch(`${BASE_API_URL}/api/comment/get-comment-by-parent-comment?recipeId=${recipeId}&recipeParentId=${parentId}`);
    var data = await res.json();
    var elements = $(`.replied-${parentId}`);
    if (elements[0]) {
        elements.remove();
    }
    for (var item of data) {
        let date = new Date(item.createTime);
        var hr = date.getHours();
        var min = date.getMinutes();
        item.createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
        var itemReply = createSingleReplyComment(item, parentId);

        $(`li[data-user-id=${parentId}]`).append(itemReply);
        
    }
    //tim user dựa theo userid để biết comment của ai, thì người đó có thể xóa comment
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var resUser = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var user = await resUser.json();
    var userId = user.id;
    $(`#delete-comment-${userId}`).css("display", "block");
};

//This function to handle create reply comment
// to specify comment
// params:
//    + recipeId: Recipe Id
//    + commentParentId: Speicify comment id
const callCreateReplyCommentApi = async (recipeId, commentParentId) => {
    // get 
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var comment = $(`textarea[name="reply-${commentParentId}"]`).val();
    if (comment != "") {
        var data = {
            recipeId: recipeId,
            commentContent: comment,
            recipeCommentParentID: commentParentId
        };
        // call api to create comment
        var res = await fetch(`${BASE_API_URL}/api/comment/createComment`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        // if api resposne 200 ok
        if (res.status == 200) {
            // Begin render comment link from dataCount
            // get dataCount from server
            var dataCount = (await callCountCommentsApi(recipeId, commentParentId));
            // use datacount to render html comment href
            $(`a[id="comment-link-${commentParentId}"]`).html(`Bình luận (${dataCount})`);
            await openReplyView(commentParentId, recipeId);
            // End render comment link from dataCount

            //thông báo cho người chủ sở hữu recipe
            var chefUsername = window.localStorage.getItem("chefusername");//chủ sở hữu recipe
            var usernameLocal = window.localStorage.getItem("username");//người đang comment
            if (chefUsername == usernameLocal) {
                //do nothing
            } else {
                try {
                    console.log("Starting firebase");
                    var resUser = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    var userData = await resUser.json();
                    var myDataRef = SRSN.FIREBASE_DATABASE.ref(chefUsername);
                    var uid = myDataRef.push({
                        "uid": "",
                        "username": userData.lastName + " " + userData.firstName,
                        "content": "đã trả lời bình luận về bài viết của bạn.",
                        "date": new Date().toLocaleString(),
                        "link": "/recipe/" + data.recipeId,
                        "isRead": "False"
                    });
                    //update uid into firebase 
                    SRSN.FIREBASE_DATABASE.ref("/" + chefUsername + "/" + uid.key).update({
                        uid: uid.key
                    });
                    //update count notifi
                    var countNoti = 0;
                    var countDataRef = SRSN.FIREBASE_DATABASE.ref(chefUsername);

                    countDataRef.once('value', function (snapshot) {
                        countNoti = snapshot.val().numberOfLatestNotis;
                        countNoti++;
                        SRSN.FIREBASE_DATABASE.ref(chefUsername).update({ "numberOfLatestNotis": countNoti });
                    });

                    
                } catch (e) {
                    console.error("Exception create rely comment: ", e);
                }
            }

            // thong bao cho nguoi chủ comment
            notifyDependencyCommentedUser(commentParentId);
        }
    }

};

const notifyDependencyCommentedUser = async function (commentParentId) {

    try {
        // thong bao cho nguoi chủ comment
        var ratingRecipeRes = await fetch(`${BASE_API_URL}/${USER_REACTION_RECIPE_API_URL}/get-userid-by-commentparentId?commentParentId=${commentParentId}`);
        var userRes = await ratingRecipeRes.json();
       
            var userId = userRes.userId;
            //thông báo
            var user = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read?userId=${userId}`);
            var userParentCommentRes = await user.json();
            var usernameParentComment = userParentCommentRes.username;//chủ comment
            var usernameLocal = window.localStorage.getItem("username");//người đang trả lời comment
            if (usernameLocal == usernameParentComment) {
                // do nothing
            } else {

                var resUser = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                var userData = await resUser.json();//nguoi dang comment
                var myDataRef = SRSN.FIREBASE_DATABASE.ref(usernameParentComment);
                var uid = myDataRef.push({
                    "uid": "",
                    "username": userData.lastName + " " + userData.firstName,
                    "content": "đã trả lời bình luận của bạn.",
                    "date": new Date().toLocaleString(),
                    "link": "/recipe/" + data.recipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + usernameParentComment + "/" + uid.key).update({
                    uid: uid.key
                });

                //update count notifi
                var countNoti = 0;
                var countDataRef = SRSN.FIREBASE_DATABASE.ref(usernameParentComment);

                countDataRef.once('value', function (snapshot) {
                    countNoti = snapshot.val().numberOfLatestNotis;
                    countNoti++;
                    SRSN.FIREBASE_DATABASE.ref(usernameParentComment).update({ "numberOfLatestNotis": countNoti });
                });

            }
      
    } catch (e) {
        console.error("Exception notifyDependencyComments: ", e);
        return;
    }
}

const createShareRecipeModal = (recipe, dataUser) => `<div class="activity--list">
                    <ul class="activity--items nav">
                        <li>
                            <div class="activity--item">
                                <div class="activity--avatar">
                                    <a href="/account/timeline/${dataUser.username}">
                                        <img src="${dataUser.avatarImageUrl}"  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                    </a>
                                </div>

                                <div class="activity--info fs--14">
                                    <div class="activity--header">
                                        <p><a href="/account/timeline/${dataUser.username}">${dataUser.lastName} ${dataUser.firstName}</a></p>
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
    var elements = $(`.activity--list`);

    if (elements[0]) {

        elements.remove();

    }
    var dataUser = await resUser.json();
    for (var item of data) {
        var content = createShareRecipeModal(item, dataUser);
        $("#modal-body-share-recipe").append(content);
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
        $("#modal-share-recipe").css("display", "none");
        swal("", "Bạn đã chia sẻ công thức thành công", "success")
        //thông báo chia sẻ công thức (sharing notification)
        var resUser = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        var userData = await resUser.json();
        var chefUsername = window.localStorage.getItem("chefusername");//chủ sở hữu recipe
        var usernameLocal = window.localStorage.getItem("username");//người đang chia sẻ
        var myDataRef, uid;
        if (chefUsername == usernameLocal) {
            //do nothing
        } else {
            try {
                console.log("Starting firebase")
                myDataRef = SRSN.FIREBASE_DATABASE.ref(chefUsername);
                uid = myDataRef.push({
                    "uid": "",
                    "username": userData.lastName + " " + userData.firstName,
                    "content": "đã chia sẻ bài viết của bạn.",
                    "date": new Date().toLocaleString(),
                    "link": "/recipe/" + data.referencedRecipeId,
                    "isRead": "False"
                });
                //update uid into firebase 
                SRSN.FIREBASE_DATABASE.ref("/" + chefUsername + "/" + uid.key).update({
                    uid: uid.key
                });
                //update count notifi
                var countNoti = 0;
                var countDataRef = SRSN.FIREBASE_DATABASE.ref(chefUsername);

                countDataRef.once('value', function (snapshot) {
                    countNoti = snapshot.val().numberOfLatestNotis;
                    countNoti++;
                    SRSN.FIREBASE_DATABASE.ref(chefUsername).update({ "numberOfLatestNotis": countNoti });
                });
                //update count notifi
                var countNoti = 0;
                var countDataRef = SRSN.FIREBASE_DATABASE.ref(usernameLocal);

                countDataRef.once('value', function (snapshot) {
                    countNoti = snapshot.val().numberOfLatestNotis;
                    countNoti++;
                    SRSN.FIREBASE_DATABASE.ref(usernameLocal).update({ "numberOfLatestNotis": countNoti });
                });

                //thông báo cộng điểm
                myDataRef  = SRSN.FIREBASE_DATABASE.ref(usernameLocal);
                uid = myDataRef.push({
                    "uid": "",
                    "username": "Bạn",
                    "content": "đã chia sẻ công thức và được cộng thêm <b>5 điểm</b>",
                    "date": new Date().toLocaleString(),
                    "link": "/recipe/" + data.referencedRecipeId,
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
const createCollectionItemModal = (collection) => `<div class="col-md-3 col-xs-6 col-xxs-12 collection-modal-item" onclick="callCreateAddCollectionApi(${collection.id}, ${recipeMainId})">
                                                        <div class="member--item online  collection-modal-item">
                                                        <div class="img-recipe-avatar">
                                                            <a class="btn-link">
                                                                <img src="${collection.coverImage}" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                                            </a>
                                                        </div>

                                                        <div class="name">
                                                            <h3 class="h6 fs--12">
                                                                <a href="member-activity-personal.html" class="btn-link">${collection.collectionName}</a>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>`;
const callReadCollectionModalApi = async () => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/read`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var elements = $(`.collection-modal-item`);

    if (elements[0]) {

        elements.remove();

    }
    var data = await res.json();
    for (var item of data) {
        var content = createCollectionItemModal(item);
        $("#modal-body-add-collection").append(content);
    }
};
const callCreateAddCollectionApi = async (collectionId, recipeId) => {
    var data = {
        collectionId: collectionId,
        recipePostId: recipeId,
    };
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/collectionPost/create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status == 200) {
        $("#modal-add-collection").css("display", "none");
        swal("", "Bạn đã thêm vào bộ sưu tập thành công", "success")
    };
    if (res.status == 400) {
        $("#modal-add-collection").css("display", "none");
        swal("", "Công thức này đã tồn tại trong bộ sưu tập", "error")
    }
};
var markers = [];
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
const callGetViewRecipe = async (recipeId) => {
    try {
        var authorization = localStorage.getItem("authorization");
        var token = (JSON.parse(authorization))["token"];
        var res = await fetch(`${BASE_API_URL}/api/UserReactionRecipe/view?recipeId=${recipeId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (e) {
        console.log("Is not liked")
    }

};
async function deactivateComment(cmtId, recipeId, commentParentId) {
    swal({
        title: "Bạn muốn xóa?",
        text: "Sau khi xóa, bạn sẽ không thấy bình luận này!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deactiveCommentFuntion(cmtId, recipeId, commentParentId);
            } else {
                //do nothing
            }
        });
    
}
const deactiveCommentFuntion = async (cmtId, recipeId, commentParentId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var cmtRes = await fetch(`${BASE_API_URL}/${COMMENT_API_URL}/deactivateComment?Id=${cmtId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (cmtRes.status == 200) {//successfully
        swal("Bạn đã xóa thành công Bình Luận này!", {
            icon: "success",
        });
        var dataCount = (await callCountCommentsApi(recipeId, commentParentId));
        $(`a[id="comment-link-${commentParentId}"]`).html(`Bình luận (${dataCount})`);
        $(`#reply-${cmtId}`).remove();
    } else {
        alert("Không thể xóa bình luận, vui lòng thử lại!!!");
    }
};
const createSingleSuggestRecipeElement = (recipe) =>
    `<div class="recipe-single animated wow flipInY" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
                                    <div class="recipe-image">
                                        <a href="/recipe/${recipe.id}"><img src="${recipe.imageCover}" alt="image" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/></a>
                                    </div>
                                    <div class="outer-detail">
                                        <div class="detail">
                                            <h3>
                                                <a href="/recipe/${recipe.id}">
                                                   ${recipe.recipeName}
                                                </a>
                                            </h3>
                                            <div class="short-separator"></div>
                                            <a href="/recipe/${recipe.id}" class="read-more">Xem thêm...</a>
                                        </div>
                                    </div>
      </div>`;
const callSuggestRecipeApi = async () => {
    var authorization = localStorage.getItem("authorization");
    if (authorization != null) {
        var token = (JSON.parse(authorization))["token"];
        var res = await fetch(`${BASE_API_URL}/api/recipe/get-similar-recipes`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        var data = await res.json();
        if (data.length == 0) {
            $("#title-maybe-like").hide();
        }
        for (var item of data) {
            let element = createSingleSuggestRecipeElement(item);
            $("#list-suggest-recipe").append(element);
        }
    }
};
var apikeyFilestack = 'A1p11nq0RoGb8BRod5sOgz';
var clientFilestack = filestack.init(apikeyFilestack);
var onProgress = (evt) => {
    document.getElementById('progress').innerHTML = `${evt.totalPercent}%`;
};
$('#upload-image').on("change", function (e) {
    const files = event.target.files;
    const file = files.item(0);
    if (files && file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#fileUploadedPreview').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }
});
$("#comment-form").submit(function (e) {
    e.preventDefault();
    const token = {};
    var file = $('#fileUploadedPreview').attr('src');
    var authorization = localStorage.getItem("authorization");
    var username = localStorage.getItem("username");
    var tokenAuthorize = (JSON.parse(authorization))["token"];
    clientFilestack.upload(file, {}, {}, token)
        .then(res => {
            $('#fileUploadedLink').val(res.url);
            $('#fileUploadedPreview').attr('src', res.url);
            var formData = $('#comment-form').serializeArray();
            var data = {};
            $.map(formData, function (n, i) {
                data[n['name']] = n['value'];
            });
            fetch(`${BASE_API_URL}/api/collection/create`, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAuthorize}`
                }
            }).then(res => {
                if (res.status == 200) {
                    $("#modal-create-new-collection").hide();
                    $("#modal-body-add-collection").html("");
                    callReadCollectionModalApi();
                }
            }).catch(error => console.error('Error:', error));

        })
        .catch(err => {
            console.log(err)
        });
});