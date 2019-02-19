
$('#pagination-container').pagination({
    dataSource: 'https://localhost:44361/api/recipe/read-latest-page',
    locator: 'result',
    totalNumberLocator: function (response) {
        return response.result.length;
    },
    //totalNumber: 40,
    pageSize: 9,
    ajax: {
        beforeSend: function () {
            $('#list-latest-recipe-page').html('Đang tải dữ liệu ...');
        }
    },
    callback: function (data, pagination) {
        // template method of yourself
        var html = template(data, pagination);
        $('#list-latest-recipe-page').html(html);
    }
})
var template = function (data, pagination) {
    var pageSize = pagination.pageSize;
    var currentPageNumber = pagination.pageNumber - 1;
    var s = "";
    console.log(data);
    console.log(pagination);
    var count = 0;
    while (count < pageSize) {
        var i = currentPageNumber * pageSize + count;
        if (i >= data.length) {
            break;
        }
        s += createSingleLatestRecipeElementPage(data[i]);
        count++;
    }
    return s;
}

var createSingleLatestRecipeElementPage = (recipe) =>
    `                            <div class="listing" itemid="${recipe.id}">
                                <div class="image">
                                    <a href="#">
                                        <img src="${recipe.imageCover}" alt="image"/>
                                    </a>
                                </div>
                                <div class="detail">
                                    <h4><a href="#">${recipe.recipeName}</a></h4>
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
const createSingleRecipeWidgetPageElement = (recipe) =>
    ` <li>
                                        <div class="thumb">
                                            <a href="#">
                                                <img src="${recipe.imageCover}" alt="thumbnail" />
                                            </a>
                                        </div>
                                        <div class="detail">
                                            <a href="#">${recipe.recipeName}</a>
                                            <span class="post-date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</span>
                                        </div>
                                    </li>

                                   `;

const callPopularRecipePageApi = async () => {
    var res = await fetch("https://localhost:44361/api/recipe/read-popular");
    var data = (await res.json()).result;
    var count = 0;
    for (var item of data) {
        count++;

        let element = createSingleRecipeWidgetPageElement(item);
        $("#list-popular-recipe-widget").append(element);
        if (count >= 5) {
            break;
        }
    }
};

const saveRecentRecipeLocalStorage = async () => {
    // Local Storage Creation Steps:
    // 1. Create Local Storage Object:
    var storage = document.localStorage;
    // 2. Config Key
    var key = 'recently_viewed_recipe';
    // 3. Prepare value
    var recentlyViewedRecipe = {
        'id': 1,
        'imageCover': 'Nghia'
    };



    var recentRecipe = { 'id': "1", 'imageCover': "nghia", 'recipeName': "đâs", 'createTime': "đâs" };

    
    // Put the object into storage
    localStorage.setItem(key, JSON.stringify(recentRecipe));
    
}

// load recipe
$(document).ready((e) => {
    callPopularRecipePageApi();
    loadRecentRecipeLocalStorage();
    saveRecentRecipeLocalStorage();
});