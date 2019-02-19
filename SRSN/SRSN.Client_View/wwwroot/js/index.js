
const createSingleRecipeElement = (singeRecipe) =>
    `<div class="recipe-single animated wow flipInY">
        <div class="recipe-image">
            <a href="#"><img src="${singeRecipe.imageCover}" alt="image" /></a>
        </div>
        <div class="outer-detail">
            <div class="detail">
                <h3>
                    <a href="/recipe/${singeRecipe.id}">
                        ${singeRecipe.recipeName}
                    </a>
                </h3>
                <div class="short-separator"></div>
                <ul class="news-post-meta post-meta">
                   <li class="author"><a href="#">${singeRecipe.fullName}</a></li>
                   <li class="date">${ new Date(singeRecipe.createTime).getDay() + "/" + new Date(singeRecipe.createTime).getMonth() + "/" + new Date(singeRecipe.createTime).getFullYear()}</li >
                   
                </ul>
                <div class="short-separator"></div>
                <div class="rating-box">
                    <span class="rating-figure"><i class="fa fa-eye" aria-hidden="true" style="font-size:20px;">&nbsp&nbsp${singeRecipe.viewQuantity}</i></span>&nbsp&nbsp
                    <span class="rating-icons">
                         <i class="fa fa-star-half-o" aria-hidden="true" style="
                                    font-size: 20px;
                                    color: green;"></i>
                    </span>
                    <span class="rating-figure">(${singeRecipe.evRating} / 5)</span>
                </div>
            </div>
        </div>
    </div>`;
const createSingleLatestRecipeElement = (recipe) =>
    `<div class="recipe-single animated wow flipInY">
        <div class="recipe-image">
            <a href="#"><img src="${recipe.imageCover}" alt="image" /></a>
        </div>
        <div class="outer-detail">
            <div class="detail">
                <h3>
                    <a href="/recipe/${recipe.id}">
                        ${recipe.recipeName}
                    </a>
                </h3>
                <div class="short-separator"></div>
                <ul class="news-post-meta post-meta">
                   <li class="author"><a href="#">${recipe.fullName}</a></li>
                   <li class="date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</li >
                   
                </ul>
                <div class="short-separator"></div>
               
            </div>
        </div>
    </div>`;
const createSingleRandomRecipeElement = (recipe) =>
    `<div class="recipe-single animated wow flipInY">
                                    <div class="recipe-image">
                                        <a href="/recipe/${recipe.id}"><img src="${recipe.imageCover}" alt="image" /></a>
                                    </div>
                                    <div class="outer-detail">
                                        <div class="detail">
                                            <h3>
                                                <a href="#">
                                                   ${recipe.recipeName}
                                                </a>
                                            </h3>
                                            <div class="short-separator"></div>
                                            <a href="#" class="read-more">read more</a>
                                        </div>
                                    </div>
      </div>`;
const createSingleRecipeWidgetElement = (recipe) =>
    `<li>
                                            <div class="thumb">
                                                <a href="/recipe/${recipe.id}">
                                                    <img src="${recipe.imageCover}" alt="thumbnail" />
                                                </a>
                                            </div>
                                            <div class="detail">
                                                <a href="#">${recipe.recipeName}</a>
                                                <span class="post-date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</span>
                                            </div>
                                        </li>`;
const createSingleBanner = (recipe) =>
    `<div class="slide-detail-inner">
                            <h2><a href="/recipe/${recipe.id}">${recipe.recipeName}</a></h2>
                            <div class="short-separator"></div>
                            <div class="rating-box">
                                <span class="rating-figure">
                                    <i class="fa fa-star-half-o" aria-hidden="true" style="
                                    font-size: 20px;
                                    color: green;"></i>&nbsp&nbsp
                                (${recipe.evRating} / 5)</span>
                            </div>
                            <p>
                               ${recipe.contentRecipe}
                            </p>
                            <a class="read-more-bordered" href="recipe-detail.html">Read More</a>
                        </div>`;
const createSingleRecipeOfDay = (recipe) =>
    `<img src="${recipe.imageCover}" alt="Recipe of the day">
                            <div class="recipe-contents-outer">
                                <div class="recipe-contents text-center">
                                    <div class="recipe-content-inner">
                                        <span class="tag">Recipe of the Day</span>
                                        <h2><a href="#">${recipe.recipeName}</a></h2>
                                        <div class="short-separator"></div>
                                        <p>
                                            ${recipe.contentRecipe}
                                        </p>
                                        <a href="#" class="read-more">Read More</a>
                                    </div>
                                </div>
                            </div>`;
const callRandomRecipeApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-random");
    var data = (await res.json()).result;
    for (var item of data) {
        let element = createSingleRandomRecipeElement(item);
        $("#list-random-recipe").append(element);
    }
};

const callLatestRecipeApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-latest");
    var data = (await res.json()).result;
    var count = 0;
    for (var item of data) {
        count++;
        if (count == 1) {
            var elementRecipe = createSingleRecipeOfDay(item);
            $("#single-recipe-of-day").append(elementRecipe);
        } else {
            var element = createSingleLatestRecipeElement(item);
            $("#list-single-latest-recipe").append(element);
            if (count == 7) {
                break;
            }
        }
    }
};
const callPopularRecipeBannerApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-popular");
    var data = (await res.json()).result;
    var count = 0;
    for (var item of data) {
        count++;
        switch (count) {
            case 1:
                var element = createSingleBanner(item);
                $("#single-banner1").append(element);
                break;
            case 2:
                var element = createSingleBanner(item);
                $("#single-banner2").append(element);
                break;
            case 3:
                var element = createSingleBanner(item);
                $("#single-banner3").append(element);
                break;
        }
    }
};
const callPopularRecipeApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-popular");
    var data = (await res.json()).result;
    var count = 0;
    for (var item of data) {
        count++;
        if (count >= 4) {
            let element = createSingleRecipeElement(item);
            $("#list-single-recipe").append(element);
        }
        if (count == 9) {
            break;
        }
    }
};
const callPopularRecipeWidgetApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-popular");
    var data = (await res.json()).result;
    var count = 0;
    for (var item of data) {
        count++;
        if (count >= 10) {
            let element = createSingleRecipeWidgetElement(item);
            $("#list-popular-recipe-widget").append(element);
        }
    }
};
const callLatestRecipeWidgetApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-latest");
    var data = (await res.json()).result;
    var count = 0;
    for (var item of data) {
        count++;
        if (count >= 8) {
            let element = createSingleRecipeWidgetElement(item);
            $("#list-latest-recipe-widget").append(element);
        }
    }
};




// load recipe
$(document).ready((e) => {
    callPopularRecipeBannerApi();
    callPopularRecipeWidgetApi();
    callPopularRecipeApi();
    callLatestRecipeApi();
    callLatestRecipeWidgetApi();
    callRandomRecipeApi();
});

