$('.add-button.add-steps').on("click", function (event) {
    event.preventDefault();
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields">' +
        ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
        '<textarea class="short-text" name="stepsDes" id="stepsDes" cols="30" rows="10">    </textarea>' +
        ' <span class="del-list"><i class="fa fa-trash"></i></span>' +
        '</div><div class="image-fields">' +
        '<input type = "file" name = "stepsImage" />' +
        '</div >' +
        '</li>';


    $('.list-sortable.steps').append(newMajesticItem);
    $('.list-sortable.steps').children("li").slideDown();
    bindMajesticItem();
});

$('.add-button.add-ing').on("click", function (event) {

    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields"><span class="ingredient-handler-list handler-list">' +
        '<i class="fa fa-arrows"></i></span >' +
        '<input class="ingredient-quantity" type="number" step="1"' +
        'name="ingredientsQuantity" id="ingredientsQuantity" />' +
        '<select class="ingredient-weight" name="ingredientsWeight">' +
        '<option value="1" selected>g</option><option value="1000">kg</option></select>' +
        '<input class="ingredient-detail" type="text" name="ingredients" id="ingredients" />' +
        '<span class="del-list"><i class="fa fa-trash"></i></span></div >' +
        '</li>';
    $('.list-sortable.ingredients-list').append(newMajesticItem);
    $('.list-sortable.ingredients-list').children("li").slideDown();
    bindMajesticItem();

    event.preventDefault();
});

$('#submitBtn').on("click", async function (event) {
    var avatar = $("input[name='avatarUpload']").val();
    var title = $("input[name='title']").val();
    var content = $("#recipe-content").val();
    var serving = $("input[name='serving']").val();
    var cooktime = $("input[name='cooktime']").val();
    var level = $("input[name='level']").val();
    var videoCode = $("input[name='videoCode']").val();

    var ingredientsQuantity = $("input[name='ingredientsQuantity']");
    var ingredientsWeight = $("select[name='ingredientsWeight']");
    var ingredientsName = $("input[name='ingredients']");
    var ingredients = [];
    $(ingredientsQuantity).each(i => {
        ingredients.push({
            IngredientName: $(ingredientsName[i]).val(),
            Quantitative: $(ingredientsQuantity[i]).val() * $(ingredientsWeight[i]).children("option:selected").val()
        });
    });

    var stepDescription = $("textarea[name='stepsDes']");
    var stepsImage = $("input[name='stepsImage']");
    var steps = [];
    $(stepDescription).each(i => {
        steps.push({
            Description: $(stepDescription[i]).val(),
            ImageUrl: $(stepsImage[i]).val()
        });
    });

    var categoriesItemList = $("input[name='categoryItem']:checked");
    var categoriesItem = [];
    $(categoriesItemList).each((i, item) => {
        var categoryRecipeE = {
            'categoryItemId': Number.parseInt($(item).val())
        }
        categoriesItem.push(categoryRecipeE);
    });


    var data = {
        RecipeVM: {
            ImageCover: avatar,
            ContentRecipe: content,
            RecipeName: title,
            Serving: serving,
            Cooktime: cooktime,
            LevelRecipe: level,
            VideoLink: videoCode
        },
        ListCategory: categoriesItem,
        ListSORVM: steps,
        ListIngredient: ingredients
    };

    console.log(data);
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/recipe/submit-recipe`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token}`
        }
    });
    if (res.status == 200) {
        //đăng công thức thành công.
        //them data vao firebase
        var usernameLocal = window.localStorage.getItem("username");// người submit công thức

        var resUserfollowing = await fetch(`https://localhost:44361/api/userfollowing/read-following-user?userName=${usernameLocal}`);
        var listUserFollowingMe = await resUserfollowing.json();
        for (var user of listUserFollowingMe) {
            var myDataRef = firebase.database().ref(user.username);
            myDataRef.push({
                "username": usernameLocal, //người tạo ra notification
                "content": "vừa đăng công thức mới: " + data[0].title,
                "date": new Date().toLocaleString(),
                "link": "/recipe/" + data.recipeId,
                "isRead": "False"
            });
        }
       

    }
    var mains = await res.json();
    console.log(mains);
});
function openTab(tab) {
    var i;
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tab).style.display = "block";
}

const loadcategory = async () => {
    var res = await fetch(`${BASE_API_URL}/api/category/read`);
    var mains = await res.json();
    $(mains).each((i, main) => {
        var div = document.createElement("div");
        div.setAttribute("class", "category-main row");
        var h3 = document.createElement("h3");
        h3.setAttribute("class", "category-main-name");
        h3.innerHTML = main.categoryName;
        div.append(h3);
        $(main.categoryItem).each((j, item) => {
            var itemElement = '<label class="switch">' +
                '<input type="checkbox" name="categoryItem" value="' + item.id + '"/>' +
                '<span class="slider round"></span>' +
                '</label >' +
                '<h4 class="category-item-name">' + item.categoryItemName + '</h4>';
            var itemDiv = document.createElement("div");
            itemDiv.setAttribute("class", "category-item col-md-4");
            itemDiv.innerHTML = itemElement;
            //$(itemDiv).on("click", (event) => { console.log(itemDiv); });
            div.append(itemDiv);
        });
        $('#phanloai').append(div);
    });
}

const createSingleRecipeWidgetSubmitPage = (recipe) =>
    ` <li onclick="saveToLocalStorage(${recipe.id},'${recipe.recipeName}', '${recipe.imageCover}',
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
                                    </li>

                                   `;
const createSingleCategoryItemSubmitPage = (item) =>
    ` <li >
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

const callLatestRecipeWidgetSubmitPageApi = async () => {
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-latest`);
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        if (count >= 8) {
            let element = createSingleRecipeWidgetSubmitPage(item);
            $("#list-latest-recipe-widget-submitpage").append(element);
        }
    }
};
const callListCategoryItemSubmitPageApi = async () => {
    var res = await fetch(`${BASE_API_URL}/api/category/read-categoryitem?categoryMainId=1`);
    var data = await res.json();
    for (var item of data) {
        for (var cateItem of item.listCategoryItem) {
            let element = createSingleCategoryItemSubmitPage(cateItem);
            $("#list-category-item-submitpage").append(element);
        }
    }
};
const callPopularSubmitPageApi = async () => {
    var res = await fetch(`${BASE_API_URL}/api/recipe/read-popular`);
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        let element = createSingleRecipeWidgetSubmitPage(item);
        $("#list-popular-recipe-widget-submitpage").append(element);
        if (count >= 5) {
            break;
        }
    }
};
