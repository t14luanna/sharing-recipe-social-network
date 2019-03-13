const apikey = 'AJQOnJX4sQs2oOshsbuO2z';

const client = filestack.init(apikey);
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

function openTab(tab) {
    var i;
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tab).style.display = "block";
}

async function loadCategory() {
    var res = await fetch("https://localhost:44361/api/category/read");
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
    $('#phanloai')[0].innerHTML += '<div class="text-center">' +
        '<button type = "submit" id = "submitBtn" class="recipe-submit-btn" > Submit Your Recipe</button >' +
    '</div >';
};

function getData() {
    var validation = true;

    // [Comment luu y ma so 01]
    // Neu la upload file thi dung nen gom chung vao 1 request object json
    // hay upload truoc roi dem duong link do gan vao muc nay
    // neu chua lam thi co the implement sau
    // nhung khong nen up file len
    // Truong hop demo, se lay name lam du lieu luu tru
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
    
    var ingredientsWeight = $("input[name='ingredientsWeight']");
    var ingredientsName = $("input[name='ingredients']");
    var ingredients = [];
    $(ingredientsName).each(i => {
        validation = validationField('ingredients', $(ingredientsName[i]).val().trim()) && validation;
        validation = validationField('ingredients', $(ingredientsWeight[i]).val().trim()) && validation;
        ingredients.push({
            IngredientName: $(ingredientsName[i]).val().trim(),
            Quantitative: $(ingredientsWeight[i]).val()
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
            'categoryItemId': Number.parseInt($(item).val())
        }
        categoriesItem.push(categoryRecipeE);
    });


    var data = {
        recipeVM: {
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
        await uploadFile(data.recipeVM.ImageCover).then((res) => {
            data.recipeVM.ImageCover = res.url;
        });

        $(data.ListSORVM).each(async (i, step) => {
            await uploadFile(step.ImageUrl).then((res) => {
                data.ListSORVM[i].ImageUrl = res.url;
            });
        });

        return resolve(data);
    });
}

function openTab(tab) {
    var i;
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tab).style.display = "block";
}

const loadcategory = async () => {
    var res = await fetch("https://localhost:44361/api/category/read");
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

//Image Picker
(function ($) {

    $.fn.imagePicker = function (options) {

        // Define plugin options
        var settings = $.extend({
            // Input name attribute
            name: "",
            // Classes for styling the input
            class: "form-control btn btn-default btn-block",
            // Icon which displays in center of input
            icon: "glyphicon glyphicon-plus"
        }, options);

        // Create an input inside each matched element
        return this.each(function () {
            $(this).html(create_btn(this, settings));
        });

    };

    // Private function for creating the input element
    function create_btn(that, settings) {
        // The input icon element
        var picker_btn_icon = $('<i class="' + settings.icon + '"></i>');

        // The actual element displayed
        var picker_btn = $('<div class="' + settings.class + ' img-upload-btn"></div>')
            .append(picker_btn_icon)
        var picker_btn_input = $("input[name='avatarUpload']")
        // File load listener
        picker_btn_input.change(function () {
            if ($(this).prop('files')[0]) {
                // Use FileReader to get file
                var reader = new FileReader();

                // Create a preview once image has loaded
                reader.onload = function (e) {
                    var preview = create_preview(that, e.target.result, settings);
                    $(that).html(preview);
                }

                // Load image
                reader.readAsDataURL(picker_btn_input.prop('files')[0]);
                $(that).css('display', 'block');
            }
        });

        return picker_btn
    };

    // Private function for creating a preview element
    function create_preview(that, src, settings) {

        // The preview image
        var picker_preview_image = $('<img src="' + src + '" class="img-responsive img-rounded" />');

        // The preview element
        var picker_preview = $('<div class="text-center"></div>')
            .append(picker_preview_image)

        return picker_preview;
    };

}(jQuery));

$(document).ready(function () {
    $('.img-picker').imagePicker({ name: 'images' });
})
//----