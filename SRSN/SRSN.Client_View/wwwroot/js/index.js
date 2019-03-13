
const createSingleNotificationElement = (name) =>
    `<li ><a href="#">${name}</a></li>`;
const createSingleRecipeElement = (singeRecipe) =>
    `<div class="recipe-single animated wow flipInY" onclick="saveToLocalStorage(${singeRecipe.id},'${singeRecipe.recipeName}', '${singeRecipe.imageCover}',
                                                                                        '${new Date(singeRecipe.createTime).getDay() + "/" + new Date(singeRecipe.createTime).getMonth() + "/" + new Date(singeRecipe.createTime).getFullYear()}')">
        <div class="recipe-image">
            <a href="/recipe/${singeRecipe.id}"><img src="${singeRecipe.imageCover}" alt="image" /></a>
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
                <ul class="news-post-meta post-meta">
                    <li class="rating-figure"><i class="fa fa-eye" aria-hidden="true">${singeRecipe.viewQuantity}</i></li>
                    <li class="rating-icons">
                         <i class="fa fa-star-half-o" aria-hidden="true"></i>
                        <span class="rating-figure">(${singeRecipe.evRating} / 5)</span>
                    </li>
                </div>
            </div>
        </div>
    </div>`;
const createSingleLatestRecipeElement = (recipe) =>
    `<div class="recipe-single animated wow flipInY" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
        <div class="recipe-image">
            <a href="/recipe/${recipe.id}"><img src="${recipe.imageCover}" alt="image" /></a>
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
    `<div class="recipe-single animated wow flipInY" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
                                    <div class="recipe-image">
                                        <a href="/recipe/${recipe.id}"><img src="${recipe.imageCover}" alt="image" /></a>
                                    </div>
                                    <div class="outer-detail">
                                        <div class="detail">
                                            <h3>
                                                <a href="/recipe/${recipe.id}">
                                                   ${recipe.recipeName}
                                                </a>
                                            </h3>
                                            <div class="short-separator"></div>
                                            <a href="#" class="read-more">read more</a>
                                        </div>
                                    </div>
      </div>`;
const createSingleRecipeWidgetElement = (recipe) =>
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
const createSingleBanner = (recipe) =>
    `<div class="slide-detail-inner" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
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
                            <a class="read-more-bordered" href="/recipe/${recipe.id}">Read More</a>
                        </div>`;
const createSingleRecipeOfDay = (recipe) =>
    `<img src="${recipe.imageCover}" alt="Recipe of the day" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
                            <div class="recipe-contents-outer">
                                <div class="recipe-contents text-center">
                                    <div class="recipe-content-inner">
                                        <span class="tag">Recipe of the Day</span>
                                        <h2><a href="/recipe/${recipe.id}">${recipe.recipeName}</a></h2>
                                        <div class="short-separator"></div>
                                        <p>
                                            ${recipe.contentRecipe}
                                        </p>
                                        <a href="/recipe/${recipe.id}" class="read-more">Read More</a>
                                    </div>
                                </div>
                            </div>`;
const createSingleCategoryItem = (item) =>
    ` <li>
                                                <a href="#" class="text">${item.categoryItemName}</a>
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

const RedirectAPI = async () => {
    $(".text").on("click", function (e) {
        e.preventDefault();
        var categoryName = $(this).text();
        console.log(categoryName);
        fetch("https://localhost:44361/api/recipe/read-recipe-by-category?categoryName=" + categoryName,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
            .then(res => res.json())
            .then(response => {
                
                var win = window.open('/RecipeByCategory?categoryName=' + categoryName);
                if (win) {
                    //Browser has allowed it to be opened
                    win.focus();
                } else {
                    //Browser has blocked it
                    alert('Please allow popups for this website');
                }
                //window.location.pathname = '/SearchRecipe';
                console.log(response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
};
    


//choxem khúc giao diện
const callListCategoryItem = async () => {
    var res = await fetch("https://localhost:44361/api/category/read-categoryitem?categoryMainId=1");
    var data = await res.json();
    for (var item of data) {
        for (var cateItem of item.listCategoryItem) {
            let element = createSingleCategoryItem(cateItem);
            $("#list-category-item").append(element);
        }
    }
};
const callRandomRecipeApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-random");
    var data = await res.json();
    for (var item of data) {
        let element = createSingleRandomRecipeElement(item);
        $("#list-random-recipe").append(element);
    }
};

const callLatestRecipeApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-latest");
    var data = await res.json();
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
    try {
        var res = await fetch("https://localhost:44361/api/recipe/read-popular");
        var data = await res.json();
        var count = 0;
        for (let item of data) {
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
            if (count == 3) {
                break;
            }
        }
    } catch (e) {
        console.log(e);
    }
};
const getRecipeResult = (recipe) => `<div class="quick-search-item" onclick="bindingQuickSearchValue('${recipe.recipeName}')">${recipe.recipeName}</div>`
const getUserName = (account) => `<div>${account.userName}</div>`
const callPopularRecipeApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-popular");
    var list = await res.json();
    var count = 0;
    for (var item of list) {
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
    var list = await res.json();
    var count = 0;
    for (var item of list) {
        count++;
        if (count >= 10) {
            let element = createSingleRecipeWidgetElement(item);
            $("#list-popular-recipe-widget").append(element);
        }
    }
};
const callLatestRecipeWidgetApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-latest");
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        if (count >= 8) {
            let element = createSingleRecipeWidgetElement(item);
            $("#list-latest-recipe-widget").append(element);
        }
    }
};

//Gọi API search Recipe
const callSearchRecipeApi = async (searchVal) => {
    if (!searchVal) {
        $("#custom-quick-result div").remove();
        $("#custom-quick-result").css('display', 'none');
        return;
    }
    var res = await fetch("https://localhost:44361/api/recipe/read-recipename" + (searchVal ? "?recipeName=" + searchVal : ""));
    var data = (await res.json()).result;
    if (data.length == 0) {
        $("#custom-quick-result div").remove();
        $("#custom-quick-result").css('display', 'none');
        return;
    }
    $("#custom-quick-result div").remove();
    $("#custom-quick-result").css('display', 'none');
    for (var item of data) {
        let element = getRecipeResult(item);
        $("#custom-quick-result").append(element);
    }
    $('#custom-quick-result').css('display', 'flex');
}

var bindingQuickSearchValue = function (quickSearchValue) {
    $("#custom-input-search").val(quickSearchValue);

    $("#custom-quick-result div").remove();
    $("#custom-quick-result").css('display', 'none');
};

const attachInputSearchCallback = () => {
    $('#custom-input-search').on("keyup", function () {
        var searchVal = $("#custom-input-search").val();
        callSearchRecipeApi(searchVal);
    })

    //$("#custom-input-search").on("focus", function () {
    //    var searchVal = $("#custom-input-search").val();
    //    if (searchVal) {
    //        callSearchRecipeApi(searchVal);
    //    } else {
    //        return;
    //    }
    //})

    $(document).on("click", function (e) {
        if (e.target.className != "quick-search-item" && e.target.id != "custom-input-search") {
            $("#custom-quick-result div").remove();
            $("#custom-quick-result").css('display', 'none');
        }
    });

    //$("#custom-input-search").on("blur", function () {
    //    $("#custom-quick-result div").remove();
    //    $("#custom-quick-result").css('display', 'none');
    //})
}


