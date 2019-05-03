
var createSingleLatestRecipeElementPage = (recipe, ratingStarElement) =>
    `                            <div class="listing" itemid="${recipe.id}" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
                                <div class="image">
                                    <a href="/recipe/${recipe.id}">
                                        <img src="${recipe.imageCover}" alt="image" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
                                    </a>
                                </div>
                                <div class="detail">

                                    <h4><a href="/recipe/${recipe.id}" > ${recipe.recipeName}</a></h4>
                                    <p>
                                        ${recipe.contentRecipe}
                                    </p>
                                    <div class="meta-listing">
                                        <ul class="post-meta">
                                            <li class="author"><a href="#">${recipe.fullName}</a></li>
                                            <li class="calendar" id="createTime">${ new Date(recipe.createTime).getDate()}/${new Date(recipe.createTime).getMonth() + 1}/${new Date(recipe.createTime).getFullYear()}</li>
                                        </ul>
                                        <div class="rating-box">
                                            <span class="rating-figure" id="evRating">${ratingStarElement}&nbsp&nbsp
                                                     (${recipe.evRating != 0 ? recipe.evRating : "Chưa có đánh giá nào"} ${recipe.evRating != 0 ? "/ 5" : ""})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
const createSingleRecipeWidgetPageElement = (recipe) =>
    ` <li>
                                        <div class="thumb" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
                                            <a href="/recipe/${recipe.id}">
                                                <img src="${recipe.imageCover}" alt="thumbnail" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
                                            </a>
                                        </div>
                                        <div class="detail">
                                            <a href="/recipe/${recipe.id}">${recipe.recipeName}</a>
                                            <span class="post-date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</span>
                                        </div>
                                    </li>

                                   `;
const createSingleCategoryItemRecipePage = (item) =>
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
                                            </li>
                                           `;
const callAllLatestRecipes = async (limit = 18, page = 0) => {
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-latest-page?limit=${limit}&page=${page}`);
    var data = await res.json();
    for (var item of data) {
        var numStar = item.evRating % 10;
        var ratingStarElement = "";
        if (numStar > 0) {
            for (var j = 0; j < parseInt(numStar); j++) {
                ratingStarElement += `<i class="fa fa-star" aria-hidden="true" style="font-size: 20px;color: green;"></i>`;
            }
        }
        $('#list-latest-recipe-page').append(createSingleLatestRecipeElementPage(item, ratingStarElement));
        ratingStarElement = "";
    }
};
const callListCategoryItemRecipePage = async () => {
    var res = await fetch(`${BASE_API_URL}/api/category/read-categoryitem?categoryMainId=1`);
    var data = await res.json();
    for (var item of data) {
        for (var cateItem of item.listCategoryItem) {
            let element = createSingleCategoryItemRecipePage(cateItem);
            $("#list-category-item-recipe-page").append(element);
        }
    }
};
const callPopularRecipePageApi = async () => {
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-popular`);
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        var element = createSingleRecipeWidgetPageElement(item);
        $("#list-popular-recipe-widget").append(element);
        if (count >= 5) {
            break;
        }
    }
};



