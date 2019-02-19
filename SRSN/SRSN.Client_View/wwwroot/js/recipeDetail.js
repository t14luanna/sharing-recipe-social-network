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
                                            <li><span>Nguyên liệu : </span>Nguyên liệu</li>
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
                                                    <input type="checkbox" id="${ingredient.ingredientId}"/>
                                                    ${ingredient.ingredientName} ${ingredient.quantitative}
                                                </label>
                                            </li>`;
const createSingleStepOfRecipe = (step) =>
    ` <dt class="current">
                                            <span class="arrow"><i class="fa fa-minus"></i><i class="fa fa-minus stand"></i></span><strong>Bước 1 </strong>
                                        </dt>
                                        <dd>
                                            <div class="row">
                                                <div class="col-sm-7">
                                                    ${step.Description}
                                                </div>
                                                <div class="col-sm-5">
                                                    <img src="${step.ImageUrl}" alt="image" />
                                                </div>
                                            </div>
                                        </dd>`;

const createSingleRelatedRecipe = (recipe) =>
    `
                                    <div class="recipe-single">
                                        <div class="recipe-image">
                                            <a href="#"><img src="${recipe.imageCover}" alt="image"></a>
                                        </div>
                                        <div class="outer-detail">
                                            <div class="detail">
                                                <h3>
                                                    <a href="#">
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
const callRelatedRecipeApi = async (id) => {
    var res = await fetch(`https://localhost:44361/api/recipe/read-related-recipe?userId=${id}`);
    var data = (await res.json()).result;

    for (var item of data) {
        let element = createSingleRelatedRecipe(item);

        $("#list-related-recipe").append(element);
    }
};
const callRecipeDetailApi = async (id) => {
    var res = await fetch(`https://localhost:44361/api/recipe/read-recipeid?recipeId=${id}`);
    var data = (await res.json()).result;

    for (var item of data) {
        let element = createSingleBannerRecipeDetail(item);
        var content = createContentRecipe(item);
        $("#banner-recipe").append(element);
        $("#content-recipe").append(content);
    }
};
const callIngrdientsOfRecipeApi = async (id) => {
    var res = await fetch(`https://localhost:44361/api/recipe/read-ingredients-of-recipe?recipeId=${id}`);
    var data = (await res.json()).result;

    for (var item of data) {
        var ingredient = createSingleIngredientOfRecipe(item);
        $("#list-of-ingredients").append(ingredient);
    }
};

const callStepOfRecipeApi = async (id) => {
    
    var res = await fetch(`https://localhost:44361/api/StepsOfRecipe/read-steps?recipeId=${id}`);
    var data = (await res.json()).result;

    for (var item of data) {
        var step = createSingleStepOfRecipe(item);
        $("#list-step-recipe").append(step);
    }
};
