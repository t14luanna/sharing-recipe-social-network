var getSearchResultAPI = (recipe) =>
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

const callSearchResultAPI = async (searchValue) => {
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-recipename-page?recipeName=${encodeURIComponent(searchValue)}`);
    var data = await res.json();
    for (var item of data) {
        console.log(item);
        let element = getSearchResultAPI(item);
        $("#list-latest-recipe-page").append(element);
    } 
};