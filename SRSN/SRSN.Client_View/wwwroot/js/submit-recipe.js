const apikey = 'AJQOnJX4sQs2oOshsbuO2z';

//const client = filestack.init(apikey);

$('.add-recipe-steps').on("click", function (event) {
    event.preventDefault();
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields">' +
        ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
        '<textarea class="short-text" name="stepsDes" id="stepsDes" cols="30" rows="10" required>    </textarea>' +
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
        'name="ingredientsQuantity" id="ingredientsQuantity" required/>' + 
        '<select class="ingredient-weight" name="ingredientsWeight">' +
        '<option value="1" selected>g</option><option value="1000">kg</option></select>' +
        '<input class="ingredient-detail" type="text" name="ingredients" id="ingredients" required />' +
        '<span class="del-list"><i class="fa fa-trash"></i></span></div >' +
        '</li>';
    $('.list-sortable.ingredients-list').append(newMajesticItem);
    $('.list-sortable.ingredients-list').children("li").slideDown();
    bindMajesticItem();

    event.preventDefault();
});

$('#submitBtn').on("click", async function (event) {
    var results = getData();
    console.log(results.validation)
    if (results.validation === false) {
        window.scrollTo(0, 400);
        Swal.fire({
            type: 'error',
            title: 'Thông báo',
            text: 'Các nội dung không được để trống!',
        });
        return;
    } else {
        var data = results.data;
        data = await uploadImageSubmit(data);
        
        var authorization = localStorage.getItem("authorization");
        var token = (JSON.parse(authorization))["token"];
        var res = await fetch("https://localhost:44361/api/recipe/submit-recipe", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            if (res.status) {
                Swal.fire(
                    'Thông báo',
                    'Công thức ' + data.RecipeVM.RecipeName + ' đã được tạo thành công',
                    'success'
                );
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Thông báo',
                    text: 'Công thức tạo thất bại!',
                });
            }
        });        
    }

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
    var validation = true;

    var avatar = $("input[name='avatarUpload']")[0].files[0];
    validation = validationField('avatarUpload', avatar) && validation;
    var title = $("input[name='title']").val().trim();
    validation = validationField('title', title) && validation;
    var content = $("#recipe-content").val().trim();
    validation = validationField('content', content) && validation;
    var serving = $("input[name='serving']").val();
    var cooktime = $("input[name='cooktime']").val();
    var level = $("input[name='level']").val();
    var videoCode = $("input[name='videoCode']").val();

    var ingredientsQuantity = $("input[name='ingredientsQuantity']");
    var ingredientsWeight = $("select[name='ingredientsWeight']");
    var ingredientsName = $("input[name='ingredients']");
    var ingredients = [];
    $(ingredientsQuantity).each(i => {
        validation = validationField('ingredients', $(ingredientsName[i]).val().trim()) && validation;
        ingredients.push({
            IngredientName: $(ingredientsName[i]).val().trim(),
            Quantitative: $(ingredientsQuantity[i]).val() * $(ingredientsWeight[i]).children("option:selected").val()
        });
    });

    var stepDescription = $("textarea[name='stepsDes']");
    var stepsImage = $("input[name='stepsImage']");
    var steps = [];
    $(stepDescription).each(i => {
        validation = validationField('stepsDes', $(stepDescription[i]).val().trim()) && validation;
        steps.push({
            Description: $(stepDescription[i]).val().trim(),
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

    return {
        data : data,
        validation : validation
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