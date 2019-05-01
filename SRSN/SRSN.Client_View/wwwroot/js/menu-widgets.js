function saveToLocalStorage(idRe, nameRe, imageRe, dateRe) {

    if (typeof (Storage) !== "undefined") {
        var recipe = {};
        recipe.id = idRe;
        recipe.name = nameRe;
        recipe.image = imageRe;
        recipe.date = dateRe;
        if (localStorage.getItem('recentRecipe') == null) {
            var arr = new Array(0);
            arr.push(recipe);
            var myJsonString = JSON.stringify(arr);
            localStorage.setItem('recentRecipe', myJsonString);
        } else {
            var flag = false;
            var array = JSON.parse(localStorage.getItem('recentRecipe'));
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == idRe) {//neu co trong array thi ko them vao
                    var recipeTmp = {};
                    recipeTmp.id = array[i].id;
                    recipeTmp.name = array[i].name;
                    recipeTmp.image = array[i].image;
                    recipeTmp.date = array[i].date;
                    array.splice(i, 1); // xóa 1 phần tử từ vị trí i
                    array.splice(0, 0, recipeTmp); // chèn recipeTmp vào vị trí 0

                    flag = true;
                    break;
                }
            }
            if (!flag) {
                array.splice(0, 0, recipe);// chèn recipe vào vị trí 0
            }
            if (array.length > 5) {
                var n = array.length - 5;
                array.splice(6, n); // xóa n phần tử từ vị trí 6
            }
            var myJsonString = JSON.stringify(array);
            localStorage.setItem('recentRecipe', myJsonString);
        }

    } else {
        // Sorry! No Web Storage support..
    }



};

const callPopularRecipeWidgetApi = async () => {
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-popular`);
    var list = await res.json();
    var count = 0;
    for (var item of list) {
        count++;
        if (count >= 10) {
            let element = createSingleRecipeWidgetElmnt(item);
            $("#list-popular-recipe-widget").append(element);
        }
    }
};
const callLatestRecipeWidgetApi = async () => {
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-latest`);
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        if (count >= 8) {
            let element = createSingleRecipeWidgetElmnt(item);
            $("#list-latest-recipe-widget").append(element);
        }
    }
};
const callListCategoryItem = async () => {
    var res = await fetch(`${BASE_API_URL}/api/category/read-categoryitem?categoryMainId=1`);
    var data = await res.json();
    for (var item of data) {
        for (var cateItem of item.listCategoryItem) {
            let element = createSingleCategoryItemElement(cateItem);
            $("#list-category-item").append(element);
        }
    }
};
const createSingleRecentRecipeElement = (recipe) =>
    ` <li onclick="saveToLocalStorage(${recipe.id},'${recipe.name}', '${recipe.image}',
                                                                                        '${recipe.date}')">
                                        <div class="thumb" >
                                            <a href="/recipe/${recipe.id}">
                                                <img  class="image-seen-recipe" src="${recipe.image}" alt="thumbnail" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
                                            </a>
                                        </div>
                                        <div class="detail">
                                            <h4><a href="/recipe/${recipe.id}" class="name-seen-recipe">${recipe.name}</a></h4>
                                            <h6><span class="post-date date-seen-recipe">${recipe.date}</span></h6>
                                        </div>
                                    </li>

                                   `;
const createSingleSmallRecentRecipeElement = (recipe) =>
    ` <li onclick="saveToLocalStorage(${recipe.id},'${recipe.name}', '${recipe.image}',
                                                                                        '${recipe.date}')">
                                            <div class="thumb">
                                                <a href="/recipe/${recipe.id}">
                                                    <img src="${recipe.image}" alt="thumbnail" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
                                                </a>
                                            </div>
                                            <div class="detail">
                                                <a href="/recipe/${recipe.id}">${recipe.name}</a>
                                                <span class="post-date">${recipe.date}</span>
                                            </div>
                                        </li>`;

const loadRecipeLocalStorage = async () => {
    if (localStorage.getItem('recentRecipe') == null) {
        $("#list-recent-recipe").html("Chưa có thông tin!");
        $("#recipe-seen-content").hide();
    } else {
        var array = JSON.parse(localStorage.getItem('recentRecipe'));
        for (var i = 0; i < array.length; i++) {
            var element = createSingleRecentRecipeElement(array[i]);
            $("#list-recent-recipe").append(element);
        }
    }
};
const loadRecipeSmallLocalStorage = async () => {
    if (localStorage.getItem('recentRecipe') == null) {
        $("#list-recent-recipe").html("Chưa có thông tin!");
        
    } else {
        var array = JSON.parse(localStorage.getItem('recentRecipe'));
        for (var i = 0; i < array.length; i++) {
            var element = createSingleSmallRecentRecipeElement(array[i]);
            $("#list-recent-recipe").append(element);
        }
    }
};
const createSingleCategoryItemElement = (item) =>
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
const createSingleRecipeWidgetElmnt = (recipe) =>
    `<li onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
                  '${new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}')">
                                            <div class="thumb">
                                                <a href="/recipe/${recipe.id}">
                                                    <img src="${recipe.imageCover}" alt="thumbnail" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
                                                </a>
                                            </div>
                                            <div class="detail">
                                                <a href="/recipe/${recipe.id}">${recipe.recipeName}</a>
                                                <span class="post-date">${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}</span>
                                            </div>
                                        </li>`;
const RedirectAPI = async () => {
    $(".text").on("click", function (e) {
        e.preventDefault();
        var categoryName = $(this).text();
        console.log(categoryName);
        fetch(`${BASE_API_URL}/api/recipe/read-recipe-by-category?categoryName=` + categoryName,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
            .then(res => res.json())
            .then(response => {

                window.location.replace('/RecipeByCategory?categoryName=' + categoryName);
                //if (win) {
                //    //Browser has allowed it to be opened
                //    win.focus();
                //} else {
                //    //Browser has blocked it
                //    alert('Please allow popups for this website');
                //}
                ////window.location.pathname = '/SearchRecipe';
                //console.log(response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
};

