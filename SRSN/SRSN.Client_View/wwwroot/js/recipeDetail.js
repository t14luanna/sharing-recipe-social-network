const createSingleBannerRecipeDetail = (recipe) =>
    ` 
                                <div class="wrapper-recipe-heading">
                                    <div class="heading">
                                        <h2>${recipe.recipeName}</h2>

                                    </div>
                                    <div class="recipe-media">
                                        <a class="print-button" href="#"><i class="fa fa-print"></i> In công thức</a>
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
                                    <a href="${recipe.videoLink}" class="swipebox slider-video-button">Xem Video</a>
                                </div>`;
const createContentRecipe = (recipe) =>
    `<span class="rating-figure" id="evRating"><i class="fa fa-star-half-o" aria-hidden="true" style="
                                                    font-size: 20px;
                                                    color: green;"></i>&nbsp&nbsp
                                                     (${recipe.evRating} / 5)
                                            </span>
                                    <div class="separator-post"></div>
                                    <p>
                                        ${recipe.contentRecipe}
                                    </p>`  ;

const createSingleIngredientOfRecipe = (ingredient) =>
    ` <li>
                                                <label>
                                                    <input type="checkbox" id="${ingredient.recipeId}"/>
                                                    ${ingredient.ingredientName} ${ingredient.quantitative}
                                                </label>
                                            </li>`;
const createNumSteps = (num) =>
    `<dt class="current">
                                            <span class="arrow"><i class="fa fa-minus"></i><i class="fa fa-minus stand"></i></span><strong>Bước ${num}: </strong>
                                        </dt>`;
const createSingleStepOfRecipe = (step) =>
    `                                   
                                        <dd>
                                            <div class="row">
                                                <div class="col-sm-7">
                                                    <p>
                                                        ${step.description}
                                                    </p>
                                                    
                                                </div>
                                                <div class="col-sm-5">
                                                    <img src="${step.imageUrl}" alt="image" />
                                                </div>
                                            </div>
                                        </dd>`;

const createSingleRelatedRecipe = (recipe) =>
    `
                                    <div class="recipe-single">
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
    ` <li>
                                        <div class="thumb">
                                            <a href="/recipe/${recipe.id}">
                                                <img src="${recipe.imageCover}" alt="thumbnail" />
                                            </a>
                                        </div>
                                        <div class="detail">
                                            <a href="/recipe/${recipe.id}">${recipe.recipeName}</a>
                                            <span class="post-date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</span>
                                        </div>
                                    </li>

                                   `;
const createSingleRecipeDetailElement = (recipe) =>
    `<li>
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

const createSingleRatingComment = (comment) =>
    `<li>
                                   <span class="rating-icons">
                                                             <i class="fa fa-star-half-o" aria-hidden="true" style="
                                                                        font-size: 20px;
                                                                        color: green;"></i>
                                                        </span>
                                                        <span class="rating-figure">(${comment.star} / 5)</span>
                                    <div class="avatar">
                                        <a href="#"><img src="${comment.avatarUrl}" alt="avatar" /></a>
                                    </div>
                                    <div class="comment">
                                        <h5><a href="#">${comment.fullName}</a></h5>
                                        <span class="time">${comment.createTime}</span>
                                        <p>
                                            ${comment.contentRating}
                                        </p>
                                        
                                    </div>
                                </li>`;
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
        
        var element = createSingleRatingComment(item)
        $("#list-rating-comment").append(element);
    }
    $("#numOfComment").append(count);
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
