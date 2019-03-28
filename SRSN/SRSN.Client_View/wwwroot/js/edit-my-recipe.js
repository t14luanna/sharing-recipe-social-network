

const createRecipeImageCoverInfo = (info) =>
    `<div class="text-center"><img src=${info.imageCover} class="img-responsive img-rounded"/></div>`;

const createRecipeInfo = (info) => {
    $('#title').val(`${info.recipeName}`);
    $('#recipe-content').val(`${info.contentRecipe}`);
    $('#recipe-active').val(`${info.active}`);
    $("input[name='serving']").val(`${info.serving}`);
    $("input[name='cooktime']").val(`${info.cookTime}`);
    $("select[name='level']>option").each(function (e) {
        if ($(this).val() === `${info.levelRecipe}`) {
            $(this).attr('selected', 'selected');
        }
    });
    $('input[name="videoCode"]').val(info.videoCode);
};


    

const recipeDetailsByRecipeId = async (recipeId) => {
    var username = localStorage.getItem("username");
    var currentUrl = window.location.href;
    var recipeId = currentUrl.substr(currentUrl.indexOf('account/my-recipe/' + username + '/')).replace('account/my-recipe/' + username + '/', '');
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-recipeid?recipeId=${recipeId}`);
    var data = await res.json();
    var recipeImageCover = createRecipeImageCoverInfo(data[0]);
    $(".img-picker").empty();
    $(".img-picker").append(recipeImageCover);
    $(".img-picker").css("display", "block");
    createRecipeInfo(data[0]);
    var resIngredient = await fetch(`https://localhost:44361/api/recipeingredient/get-recipe-ingredients?recipeId=${recipeId}`);
    var ingredients = await resIngredient.json();
    var ingredientContainer = "";
    for (let ingredient of ingredients) {
        ingredientContainer += '<li>'+
                                    '<div class="add-fields" id = "ingredients-container" >' +
                                        '<span class="ingredient-handler-list handler-list">' +
                                            '<i class="fa fa-arrows"></i>' +
            '</span>' +
            '<input class="ingredient-weight" id="' + ingredient.id + '" type="text" value="' + ingredient.quantitative + '" name="ingredientsWeight" placeholder="1g, 1kg, 1 thìa ..." />' +
                                        '<input class="ingredient-detail" type="text" value="' + ingredient.ingredientName + '" name="ingredients" id="ingredients" placeholder="Muối, Đường, thịt gà ..." />' +
                                        '<span class="del-list"><i class="fa fa-trash"></i></span></div>' +
                                '</li> ';
    }
    $('.ingredients-list').append(ingredientContainer);
    readSteps(recipeId);
}

const readSteps = async (recipeId) => {
    var res = await fetch(`https://localhost:44361/api/stepsofrecipe/read-steps?recipeId=${recipeId}`);
    var data = await res.json();
    var content = '<li>';
    for (let step of data) {
        let images = String(step.imageUrl).split(';');
        content += `<li>
                        <div class="add-fields">
                            <span class="handler-list">
                                <i class="fa fa-arrows"></i>
                            </span><textarea class="short-text" name="stepsDes" id="${step.id}" cols="30" rows="10">${step.description}</textarea>
                            <span class="del-list">
                                <i class="fa fa-trash"></i>
                            </span>
                        </div>`;
        for (let img of images) {
            content += `<img src="${img}">`;
        }
        content += `<div class="image-fields">
                        <input type="file" name="stepsImage" required multiple />
                    </div></li>`;
    }
    $('.list-sortable.steps').append(content);
};

async function loadCategory() {
    var username = localStorage.getItem("username");
    var currentUrl = window.location.href;
    var recipeId = currentUrl.substr(currentUrl.indexOf('account/my-recipe/' + username + '/')).replace('account/my-recipe/' + username + '/', '');
    var res = await fetch("https://localhost:44361/api/category/read");
    var mains = await res.json();
    var recipeCategoriesRes = await fetch("https://localhost:44361/api/category/read-categories-by-recipe?recipeId=" + recipeId);
    var data = await recipeCategoriesRes.json();
    
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
            div.append(itemDiv);
        });
        $('input[name="categoryItem"]').each(function () {
            for (let dataItem of data) {
                if (+dataItem.categoryItemId === +$(this).val()) {
                    $(this).attr('checked', 'checked');
                    $(this).attr('id', dataItem.id);
                }
            }
        });
        $('#phanloai').append(div);
    });
    $('#phanloai')[0].innerHTML += '<div class="text-center">' +
        '<button type = "submit" id = "submitBtn" class="recipe-submit-btn"> Cập nhật công thức</button >' +
        '</div >';
};

$("#nextBtn").on('click', function (e) {
    $("#phanloaiBtn").click();
    window.scrollTo(0, 400);
});

var $tabsNav = $('.list-nav'),
    $tabsNavLis = $tabsNav.children('li');

$tabsNav.each(function () {
    var $this = $(this);
    $this.next().children('.tab-content').stop(true, true).hide()
        .first().show();
    $this.children('li').first().addClass('active').stop(true, true).show();
});

$tabsNavLis.on('click', function (e) {
    var $this = $(this);
    $this.siblings().removeClass('active').end()
        .addClass('active');
    var idx = $this.parent().children().index($this);
    $this.parent().next().children('.tab-content').stop(true, true).hide().eq(idx).fadeIn();
    e.preventDefault();
});

function getData() {
    var username = localStorage.getItem("username");
    var currentUrl = window.location.href;
    var recipeId = currentUrl.substr(currentUrl.indexOf('account/my-recipe/' + username + '/')).replace('account/my-recipe/' + username + '/', '');
    var active = $('#recipe-active').val();

    var validation = true;
    //var imgCover = $(".text-center")[0].files[0];
    var title = $("input[name='title']").val().trim();
    validation = validationField('title', title) && validation;
    var content = $("#recipe-content").val().trim();
    validation = validationField('content', content) && validation;
    var serving = $("input[name='serving']").val();
    var cooktime = $("input[name='cooktime']").val();
    var level = $("select[name='level']").val();
    var videoCode = $("input[name='videoCode']").val();

    var ingredientsWeight = $("input[name='ingredientsWeight']");
    var ingredientsName = $("input[name='ingredients']");
    var ingredients = [];
    $(ingredientsName).each(i => {
        validation = validationField('ingredients', $(ingredientsName[i]).val().trim()) && validation;
        validation = validationField('ingredients', $(ingredientsWeight[i]).val().trim()) && validation;
        ingredients.push({
            Id: Number.parseInt($(ingredientsWeight[i]).attr('id')),
            IngredientName: $(ingredientsName[i]).val().trim(),
            Quantitative: $(ingredientsWeight[i]).val()
        });
    });

    var stepDescription = $("textarea[name='stepsDes']");
    var stepsImages = $("input[name='stepsImage']");
    var steps = [];
    $(stepDescription).each(i => {
        validation = validationField('stepsDes', $(stepDescription[i]).val().trim()) && validation;
        let files = stepsImages[i].files;
        steps.push({
            Id: Number.parseInt($(stepDescription[i]).attr('id')),
            Description: $(stepDescription[i]).val().trim(),
            ImageUrl: "",
            files: files
        });
    });

    var categoriesItemList = $("input[name='categoryItem']:checked");
    var categoriesItem = [];
    $(categoriesItemList).each((i, item) => {
        var id = Number.parseInt($(item).attr('id'));
        id = isNaN(id) ? 0 : id;
        var categoryRecipeE = {
            'Id': id,
            'categoryItemId': Number.parseInt($(item).val()),
            'recipeId': recipeId
        }
        categoriesItem.push(categoryRecipeE);
    });

    var data = {
        recipeVM: {
            //ImageCover: avatar,
            Id: recipeId,
            Active: JSON.parse(active),
            ContentRecipe: content,
            RecipeName: title,
            Serving: serving,
            Cooktime: cooktime,
            LevelRecipe: level,
            VideoLink: videoCode
        },
        listCategory: categoriesItem,
        listSORVM: steps,
        listIngredient: ingredients
    };
    return {
        data: data,
        validation: validation
    };
}

function validationField(name, value) {
    if (value === '' || value === undefined) {
        $('span[name=' + name + ']').css('display', 'block');
        return false;
    } else {
        $('span[name=' + name + ']').css('display', 'none');
        return true;
    }
}

function bindMajesticItem() {

    /* Bind click event to remove detail icon button */

    $('.del-list').on("click", function (event) {
        event.preventDefault();
        var $this = $(this);
        $this.closest('li').slideUp(function () { $(this).remove(); });
    });
}

$('.add-recipe-steps').on("click", function (event) {
    event.preventDefault();
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields">' +
        ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
        '<textarea class="short-text" name="stepsDes" id="stepsDes" cols="30" rows="10">    </textarea>' +
        ' <span class="del-list"><i class="fa fa-trash"></i></span>' +
        '</div><div class="image-fields">' +
        '<input type = "file" name = "stepsImage" multiple/>' +
        '</div >' +
        '</li>';
    $('.list-sortable.steps').append(newMajesticItem);
    $('.list-sortable.steps').children("li").slideDown();
    bindMajesticItem();
});

$('.add-ingredient').on("click", function (event) {

    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields"><span class="ingredient-handler-list handler-list">' +
        '<i class="fa fa-arrows"></i></span >' +
        '<input class="ingredient-weight" type="text" name="ingredientsWeight" placeholder="1g, 1kg, 1 thìa ..."/>' +
        '<input class="ingredient-detail" type = "text" name = "ingredients" id = "ingredients" ' +
        'placeholder = "Muối, Đường, thịt gà ..." /> ' +
        '<span class="del-list"><i class="fa fa-trash"></i></span></div >' +
        '</li>';
    $('.list-sortable.ingredients-list').append(newMajesticItem);
    $('.list-sortable.ingredients-list').children("li").slideDown();
    bindMajesticItem();

    event.preventDefault();
});

