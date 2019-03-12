var getRecipeByCategory = (recipe) =>
    `<div class="listing" itemid="${recipe.id}">
                                <div class="image">
                                    <a href="#">
                                        <img src="${recipe.imageCover}" alt="image"/>
                                    </a>
                                </div>
                                <div class="detail">
                                    <h4><a href="/recipe/${recipe.id}">${recipe.recipeName}</a></h4>
                                    <p>
                                        ${recipe.contentRecipe}
                                    </p>
                                    <div class="meta-listing">
                                        <ul class="post-meta">
                                            <li class="author"><a href="#" >${recipe.fullName}</a></li>
                                            <li class="calendar" id="createTime">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</li>
                                        </ul>
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

const callRecipeByCategoryAPI = async () => {

    var url = window.location.href;
    var categoryName = url.split("=")[1];
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-recipe-by-category?categoryName=` + categoryName);
    var a = await res.json();
    var data = a.result;
    console.log('data: ' + data);
    var count = 0;
    for (var item of data) {
        count++;
        let element = getRecipeByCategory(item);
        $("#list-latest-recipe-page").append(element);
    }
};