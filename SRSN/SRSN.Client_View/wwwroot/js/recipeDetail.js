const createSingleBannerRecipeDetail = (recipe) =>
    `<div class="wrapper-recipe-heading">
        <div class="heading">
            <h2>${recipe.recipeName}</h2>
        </div>
    </div>
    <div class="slider-recipe-detail2">
        <div class="wrapper-slider-detail">
            <div class="recipe-slider">
                <div class="slider-detail2">
                    <div>
                        <a href="${recipe.imageCover}" class="swipebox" rel="recipe-gallery"><img src="${recipe.imageCover}" alt="slide" /></a>
                    </div>
                    <div>
                        <a href="${recipe.imageCover} class="swipebox" rel="recipe-gallery"><img src="${recipe.imageCover}" alt="slide" /></a>
                    </div>
                    <div>
                        <a href="${recipe.imageCover}" class="swipebox" rel="recipe-gallery"><img src="${recipe.imageCover}" alt="slide" /></a>
                    </div>
                    <div>
                        <a href="${recipe.imageCover}" class="swipebox" rel="recipe-gallery"><img src="${recipe.imageCover}" alt="slide" /></a>
                    </div>
                    <div>
                        <a href="${recipe.imageCover}" class="swipebox" rel="recipe-gallery"><img src="${recipe.imageCover}" alt="slide" /></a>
                    </div>
                </div>

                <span class="custom-arrows wider">
                    <span class="left-arrow slick-arrow" data-direction="prev" style="display: table-cell;"><i class="fa fa-arrow-left"></i></span>
                    <span class="right-arrow slick-arrow" data-direction="next" style="display: table-cell;"><i class="fa fa-arrow-right"></i></span>
                </span>
            </div>
            <ul class="recipe-specs-2">
                <li><span>Khẩu phần : </span>${recipe.serving}</li>
                <li><span>Thời gian nấu : </span>${recipe.cookTime}</li>
                <li><span>Độ khó : </span>${recipe.levelRecipe}</li>
            </ul>
        </div>
        <a href="${recipe.videoLink}" class="swipebox slider-video-button">Watch Video</a>
    </div>`;
const createContentRecipe = (recipe) =>
    `<span class="rating-figure" id="evRating"><i class="fa fa-star-half-o" aria-hidden="true" style="font-size: 20px;color: green;"></i>&nbsp&nbsp(${recipe.evRating} / 5)</span>
        <div class="separator-post"></div>
        <p>${recipe.contentRecipe}</p>`;

const createSingleIngredientOfRecipe = (ingredient) =>
    ` <li class="col-sm-3">
        <label>
            <input type="checkbox" value="${ingredient.recipeId}-${ingredient.ingredientName}" name="ingredient"/>${ingredient.quantitative} ${ingredient.ingredientName}
        </label>
    </li>`;
const createNumSteps = (num) =>
    `<dt class="current">
        <span class="arrow"><i class="fa fa-minus"></i><i class="fa fa-minus stand"></i></span><strong>Bước ${num}: </strong>
    </dt>`;
const createSingleStepOfRecipe = (step) =>
    `<dd>
        <div class="row">
            <div class="col-sm-7">
                <p>
                    ${step.description}
                </p>
                                                    
            </div>
            <div class="col-sm-5">
                <img class="img-step-recipe" src="${step.imageUrl}" alt="image" />
            </div>
        </div>
    </dd>`;

const createSingleRelatedRecipe = (recipe) =>
    `<div class="recipe-single" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
        <div class="recipe-image">
            <a href="/recipe/${recipe.id}"><img src="${recipe.imageCover}" alt="image"></a>
        </div>
        <div class="outer-detail">
            <div class="detail">
                <h3>
                    <a href="/recipe/${recipe.id}">
                        ${recipe.recipeName}
                    </a>
                </h3>
                <div class="short-separator"></div>
                <div class="rating-box">
                    <span class="rating-figure" id="evRating"><i class="fa fa-star-half-o" aria-hidden="true" style="
                    font-size: 20px;
                    color: green;"></i>&nbsp&nbsp
                        (${recipe.evRating} / 5)
            </span>
                </div>
            </div>
        </div>
    </div>`;
const createSingleRecipeDetailPageElement = (recipe) =>
    ` <li onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
            <div class="thumb" >
                <a href="/recipe/${recipe.id}">
                    <img src="${recipe.imageCover}" alt="thumbnail" />
                </a>
            </div>
            <div class="detail">
                <a href="/recipe/${recipe.id}">${recipe.recipeName}</a>
                <span class="post-date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</span>
            </div>
        </li>`;
const createSingleRecipeDetailElement = (recipe) =>
    `<li onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
        <div class="thumb">
            <a href="/recipe/${recipe.id}">
                <img src="${recipe.imageCover}" alt="thumbnail" />
            </a>
        </div>
        <div class="detail">
            <a href="/recipe/${recipe.id}">${recipe.recipeName}</a>
            <span class="post-date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</span>
        </div>
    </li>`;
const createProductItemElement = (product) =>
    `<li class="modal-product-item" data-product-id="${product.id}" data-product-name="${product.name}">${product.name}</li>`;

const createSingleRatingComment = (comment) =>
    `<li data-user-id="${comment.id}" name="main-comment">
       
        <div class="avatar">

            <a href="#"><img class="avatar-comment" src="${comment.avatarUrl}" alt="avatar" /></a>
        </div>
        <div class="comment">
            
<h5><a href="#">${comment.fullName}</a></h5>
            <span class="time">${comment.createTime}</span>
            <span class="rating-figure comment-rating-star">${comment.star} / 5 <i class="fa fa-star" aria-hidden="true"></i></span>
            <p>
                ${comment.contentRating}
            </p>
                <a href="#/" onclick="openReplyView(${comment.id})" class="reply-button">Reply</a>                        
        </div>
    </li>`;
const createSingleCategoryItemDetailPage = (item) =>
    ` <li>
                                                <a href="#">${item.categoryItemName}</a>
                                                <div class="list-icons">
                                                    <svg version="1.1" class="icon-container" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                         width="42px" height="42px" viewBox="0 0 42 42" enable-background="new 0 0 42 42" xml:space="preserve">
<path class="icon-svg" d="M38.001,22.42v11.577c0,1.653-1.349,3-3.001,3h-8H7c-1.654,0-2.999-1.347-2.999-3V22.42C2.036,20.542,1,18.331,1,16.001
	C1,9.937,8.177,5.003,17,5.003h8c8.823,0,16,4.934,16,10.998C41,18.331,39.964,20.541,38.001,22.42L38.001,22.42z M17,7.003
	c-7.719,0-14,4.036-14,8.998c0,1.873,0.921,3.684,2.665,5.234C5.877,21.426,6,21.695,6,21.982v12.015c0,0.552,0.449,1.001,1,1.001
	h20c0.552,0,1.001-0.449,1.001-1.001V21.982c0-0.287,0.12-0.558,0.334-0.748C30.079,19.683,31,17.873,31,16.001
	C31,11.039,24.721,7.003,17,7.003L17,7.003z M26.249,7.043c4.077,1.996,6.752,5.263,6.752,8.958c0,2.33-1.036,4.54-3.001,6.419
	v11.577c0,0.354-0.073,0.687-0.186,1.001H35c0.551,0,1-0.449,1-1.001V23h-2c-0.555,0-0.999-0.447-0.999-1
	c0-0.552,0.444-0.999,0.999-0.999h2.578C38.157,19.5,39,17.78,39,16.001C39,11.311,33.385,7.451,26.249,7.043L26.249,7.043z
	 M20.5,16.001c-0.828,0-1.5-0.672-1.5-1.499c0-0.828,0.672-1.501,1.5-1.501s1.5,0.673,1.5,1.501
	C22,15.329,21.328,16.001,20.5,16.001L20.5,16.001z M21,25.499C21,26.328,20.328,27,19.5,27c-0.829,0-1.5-0.672-1.5-1.501
	C18,24.671,18.671,24,19.5,24C20.328,24,21,24.671,21,25.499L21,25.499z M11.5,21.001c-0.829,0-1.5-0.672-1.5-1.501
	c0-0.828,0.672-1.499,1.5-1.499S13,18.672,13,19.5C13,20.329,12.329,21.001,11.5,21.001L11.5,21.001z" />

</svg>
                                                </div>
                                            </li>`;
const createChefByRecipeId = (chef) => `<h3 class="lined">About Chef</h3>
    <div class="listing">
        <div class="image">
            <div class="image-inner">
                <a href="#"><img src="${chef.avatarImageUrl}" alt="chef"/></a>
            </div>
        </div>
        <div class="detail">
            <div class="row">
                <div class="col-sm-8">
                    <h4><a href="#">${chef.username}</a></h4>

                </div>
                <div class="col-sm-4">
                    <ul class="chef-social-links">
                        <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                        <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                        <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                    </ul>
                </div>
            </div>
            <p>
               ${ chef.description }
            </p>
            <a href="#" class="read-more-angle">Read More</a>
        </div>
    </div>`;
const callListCategoryItemDetailPage = async () => {
    var res = await fetch("https://localhost:44361/api/category/read-categoryitem?categoryMainId=1");
    var data = await res.json();
    for (var item of data) {
        for (var cateItem of item.listCategoryItem) {
            let element = createSingleCategoryItemDetailPage(cateItem);
            $("#list-category-item-recipe-detail").append(element); 
        }
    }
};
const callLatestRecipeDetailApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-latest");
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        if (count >= 8) {
            let element = createSingleRecipeDetailElement(item);
            $("#latest-recipe-detail").append(element);
        }
    }
};
const callPopularRecipeDetailPageApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-popular");
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
    var res = await fetch(`https://localhost:44361/api/recipe/read-related-recipe?userId=${id}`);
    var data = (await res.json());

    for (var item of data) {
        let element = createSingleRelatedRecipe(item);

        $("#list-related-recipe").append(element);
    }
};


const callIngrdientsOfRecipeApi = async (id) => {
    var res = await fetch(`https://localhost:44361/api/recipe/read-ingredients?recipeId=${id}`);
    var data = (await res.json());
    for (var item of data) {
        for (var ingredients of item.listIngredient) {
            var ingredient = createSingleIngredientOfRecipe(ingredients);
            $("#list-of-ingredients").append(ingredient);
        }

    }
};
const callRecipeDetailApi = async (id) => {
    callIngrdientsOfRecipeApi(id);
    var res = await fetch(`https://localhost:44361/api/recipe/read-recipeid?recipeId=${id}`);
    var data = (await res.json());
    var userid;
    for (var item of data) {
        userid = item.userId;
        let element = createSingleBannerRecipeDetail(item);
        var content = createContentRecipe(item);
        $("#banner-recipe").append(element);
        $("#content-recipe").append(content);
    }

    callRelatedRecipeApi(userid);
    callReadRatingCommentApi(id);
};
const callReadRatingCommentApi = async (id) => {
    var res = await fetch(`https://localhost:44361/api/RatingRecipe/read-rating?recipeId=${id}`);
    var data = (await res.json());
    var count = 0;
    for (var item of data) {

        count++;
        let date = new Date(item.createTime);
        var hr = date.getHours();
        var min = date.getMinutes();
        item.createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
        var element = createSingleRatingComment(item)
        $("#list-rating-comment").append(element);
    }
    $("#numOfComment").append(count);
}
const callReadProductByIngredientNameApi = async (name) => {
    try {
        var res = await fetch(`https://localhost:44361/api/Product/read-by-ingredient-name?name=${name}`);
        var data = (await res.json());
        for (var item of data) {
            var element = createProductItemElement(item);
            $(".modal-list-product-item").append(element);
        }
    } catch (e) {
        console.log(e);
    }
}


const callStepOfRecipeApi = async (id) => {

    var res = await fetch(`https://localhost:44361/api/recipe/read-ingredients?recipeId=${id}`);
    var data = (await res.json());
    var count = 0;
    for (var item of data) {
        for (var steps of item.listSORVM) {
            count++;
            var num = createNumSteps(count);
            var step = createSingleStepOfRecipe(steps);
            num = num + step;
            $("#list-step-recipe").append(num);
        }
    }
};

const callChefRecipeApi = async (id) => {

    var res = await fetch(`https://localhost:44361/api/recipe/read-recipe-chef?recipeId=${id}`);
    var data = (await res.json());
    var chef = data.accountVM;
    var description = chef.description != null ? chef.description : "";
    chef.description = description;
    let chefView = createChefByRecipeId(chef);
    $(".about-chef").append(chefView);
};
const callReadNearByStoresApi = async (userLat, userLong, productId) => {

    var res = await fetch(`https://localhost:44361/api/product/read-nearby-store?userLat=${userLat}&userLong=${userLong}&productId=${productId}`);
    var data = (await res.json());

    for (var item of data) {
        var itemLatLng = { lat: item.lat, lng: item.long };
        var marker = new google.maps.Marker({
            position: itemLatLng,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        });
        addInfoWindow(marker, item.name);
        marker.setMap(map);
    }
};

function addInfoWindow(marker, message) {

    var infoWindow = new google.maps.InfoWindow({
        content: message
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    });
}
const callCreateRatingRecipeApi = async (recipeId, star, comment) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    if (!star) {
        $(".alert-comment").css("display", "block");
        $(".alert-comment").html("Bạn chưa chọn mức sao đánh giá (rating)");
        return;
    }
    if (!token) {
        $(".alert-comment").css("display", "block");
        $(".alert-comment").html("Hãy đăng nhập để đánh giá bài viết");
        return;
    }
    var data = {
        recipeId: recipeId,
        contentRating: comment,
        star: star
    };
    var res = await fetch("https://localhost:44361/api/ratingrecipe/create-rating", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status == 200) {
        $(".alert-success").css("display", "block");
        $("textarea[name='comment']").val('');
        callReadRatingCommentApi(recipeId);
    }
};


const createReplyView = (replyUser) => `<ul>
                <li>
                    <div class="avatar">
                        <a href="#"><img class="user-reply-comment" src="${replyUser.avatarImageUrl}" alt="avatar"/></a>
                    </div>
                    <div class="comment">
                        <h5><a href="#">${replyUser.username}</a></h5>
                        <div class="comment-form">
                            <textarea class="reply-comment" name="message" id="message" cols="3" rows="3"></textarea>
                                        <a href="#" class="reply-button">Đăng</a>
                        </div>
                    </div>
                </li>
            </ul>`;
const openReplyView = async (cmtId) =>{
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`https://localhost:44361/api/account/read-userinfo?token=${token}`);
    var data = (await res.json());
    let chefView = createReplyView(data);
    $(`li[data-user-id=${cmtId}]`).append(chefView);
}