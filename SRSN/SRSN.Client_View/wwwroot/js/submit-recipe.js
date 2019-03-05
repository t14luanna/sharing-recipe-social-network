const apikey = 'AJQOnJX4sQs2oOshsbuO2z';

const client = filestack.init(apikey);

document.querySelector('input').addEventListener('change', (event) => {
    //const files = event.target.files;
    //const file = files.item(0);

    //client.upload(file)
    //    .then(res => {
    //        console.log('success: ', res);
    //    })
    //    .catch(err => {
    //        console.log(err);
    //    });
});

$('.add-recipe-steps').on("click", function (event) {
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

$('.add-ingredient').on("click", function (event) {

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
    var data = getData();

    data = await uploadImageSubmit(data);

    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch("https://localhost:44361/api/recipe/submit-recipe", {
        method: "POST",
        body: '{}',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        console.log(res);
    });
});

function openTab(tab) {
    var i;
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tab).style.display = "block";
}

const loadCategory = async () => {
    var res = await fetch("https://localhost:44361/api/category/read");
    var mains = await res.json();
    $(mains).each((i,main) => {
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

function getData() {
    var avatar = $("input[name='avatarUpload']")[0].files[0];
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
            ImageUrl: $(stepsImage[i])[0].files[0]
        });
    });

    var categoriesItemList = $("input[name='categoryItem']:checked");
    var categoriesItem = [];
    $(categoriesItemList).each((i, item) => {
        var categoryRecipeE = {
            categoryItemId: Number.parseInt($(item).val())
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
            VideoLink: videoCode,
            ListCategory: categoriesItem,
            ListSORVM: steps,
            ListIngredient: ingredients
        }
    };

    return data;
}

function uploadImageSubmit(data) {
    return new Promise(async (resolve, reject) => {
        await uploadFile(data.RecipeVM.ImageCover).then((res) => {
            data.RecipeVM.ImageCover = res.url;
        });

        $(data.ListSORVM).each(async (i, step) => {
            await uploadFile(step.ImageUrl).then((res) => {
                data.ListSORVM[i].ImageUrl = res.url;
            });
        });

        return resolve(data);
    });
}

function uploadFile(file) {
    return new Promise((resolve, reject) => {
        client.upload(file)
        .then(res => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
    })
}

$(document).ready((e) => {
    loadCategory();
});