var getRecipeByCategory = (recipe) =>
    `<div class="listing" itemid="${recipe.id}" onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                                                                                        '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
                                <div class="image">
                                    <a href="/recipe/${recipe.id}">
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
                                            <li class="author"><a href="#">${recipe.fullName}</a></li>
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
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-recipe-by-category?categoryName=${categoryName}`);
    var dataRes = await res.json();
    var dataSrc = dataRes.result;
    $("#pagination-container").pagination({
        dataSource: dataSrc,
        locator: '',// array
        totalNumberLocator: function (response) {
            return response.length;
        },
        //totalNumber: 40,
        pageSize: 9,
        ajax: {
            beforeSend: function () {
                $('#list-recipe').html('Đang tải dữ liệu ...');
            }
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = template(data, pagination);
            $('#list-recipe').html(html);
        }
    });
    
};
var template = function (data, pagination) {
    var pageSize = pagination.pageSize;
    var currentPageNumber = pagination.pageNumber - 1;
    var s = "";

    var count = 0;
    while (count < pageSize) {
        var i = currentPageNumber * pageSize + count;
        if (i >= data.length) {
            break;
        }
        s += getRecipeByCategory(data[i]);
        count++;
    }
    return s;
};