$('.add-button.add-steps').on("click", function (event) {
    event.preventDefault();
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields">' +
        ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
        '<textarea class="short-text" name="steps" id="steps" cols="30" rows="10">    </textarea>' +
        ' <span class="del-list"><i class="fa fa-trash"></i></span>' +
        '</div><div class="image-fields">' +
        '<input type = "file" name = "imageSteps" />' +
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
    var content = $("input[name='content']").val();
    var serving = $("input[name='serving']").val();
    var cooktime = $("input[name='cooktime']").val();
    var level = $("input[name='level']").val();
    var videoCode = $("input[name='videoCode']").val();

    var ingredientsQuantity = $("input[name='ingredientsQuantity']");
    var ingredientsWeight= $("select[name='ingredientsWeight']");
    var ingredientsName= $("input[name='ingredients']");
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
        categoriesItem.push($(item).val());
    });


    var data = {
        ImageCover: avatar,
        ContentRecipe: content,
        RecipeName: title,
        Serving: serving,
        Cooktime: cooktime,
        LevelRecipe: level,
        VideoLink: videoCode,
        listCategory: categoriesItem,
        ListSORVM: steps,
        listIngredient: ingredients
    };

    console.log(data);

    var res = await fetch("https://localhost:44361/api/recipe/submit-recipe", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
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

$(document).ready((e) => {
    loadCategory();
});