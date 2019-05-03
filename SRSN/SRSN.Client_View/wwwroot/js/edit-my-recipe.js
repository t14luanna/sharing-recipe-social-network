const apikey = 'AHs8S0A0zQ0SNWqyiHT2qz';
const client = filestack.init(apikey);
var listStepImages = {};
var listLocalStepImages = {};
var localStepsCount = 0;
var countIngredient = 0;
var countsteps = 0;
const createRecipeImageCoverInfo = (info) =>
    `<div class="text-center"><img src="${info.imageCover}" /></div>`;

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
    $('input[name="createTime"]').val(info.createTime);
};

const recipeDetailsByRecipeId = async (recipeId) => {
    //var username = localStorage.getItem("username");
    //var currentUrl = window.location.href;
    //var recipeId = currentUrl.substr(currentUrl.indexOf('account/my-recipe/' + username + '/')).replace('account/my-recipe/' + username + '/', '');
    var res = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-edit-recipeid?recipeId=${recipeId}`);
    var data = await res.json();
    var recipeImageCover = createRecipeImageCoverInfo(data[0]);
    //$(".img-picker").empty();
    //$(".img-picker").append(recipeImageCover);
    //$(".img-picker").css("display", "block");
    $('.img-picker').imagePicker({ name: 'images' });
    $("input[name='avatarUpload']").attr("data-temp-src", data[0].imageCover);
    $("input[name='avatarUpload']").trigger("change");
    $("input[name='recipeId']").val(data[0].id);
    createRecipeInfo(data[0]);
    var resIngredient = await fetch(`${BASE_API_URL}/api/recipeingredient/get-recipe-ingredients?recipeId=${recipeId}`);
    var ingredients = await resIngredient.json();
    var ingredientContainer = "";
    for (let ingredient of ingredients) {
        countIngredient++;
        ingredientContainer += '<li>' +
            '<div class="add-fields" id = "ingredients-container" >' +
            '<span class="ingredient-handler-list handler-list">' +
            '<i class="fa fa-arrows"></i>' +
            '</span>' +
            `<div class="autocomplete"><input class="ingredient-detail" autocomplete="off" type="text" name="ingredients" data-suggest-quantitivie="ingredientsWeight${countIngredient}" id="ingredients${countIngredient}" value="${ingredient.ingredientName}" placeholder="Muối, Đường, thịt gà ..." onclick="SuggestIngredient(this);"/></div>` +
            `<input class="ingredient-weight" type="text" name="ingredientsWeight" id="${ingredient.id}" placeholder="1g, 1kg, 1 thìa ..."  value="${ingredient.quantitative}" /><input type="hidden" name="ingredientId" value="${ingredient.id}" />` +
            '<span class="del-list"><i class="fa fa-trash"></i></span></div>' +
            '</li> ';
    }
    $('.ingredients-list').append(ingredientContainer);
    readSteps(recipeId);
    bindMajesticItem();
}

const readSteps = async (recipeId) => {
    var res = await fetch(`${BASE_API_URL}/api/stepsofrecipe/read-steps?recipeId=${recipeId}`);
    var data = await res.json();

    for (let step of data) {
        countsteps++;
        let images = String(step.imageUrl).split(';');
        var content = '<li>';
        content += `<div class="add-fields">
                            <span class="handler-list">
                                <i class="fa fa-arrows"></i>
                            </span><textarea class="short-text" name="stepsDes" id="${step.id}" cols="30" rows="10">${step.description}</textarea>
                            <input type="hidden" name="stepsId" value="${step.id}" />
                            <span class="del-list">
                                <i class="fa fa-trash"></i>
                            </span>
                        </div>
                        <div class="add-fields" style="margin-top: 20px">
                            <textarea class="short-text" name="stepsTips" id="${step.id}" cols="30" rows="10" placeholder="Mẹo nhỏ cho bước này (có thể bỏ qua)">${step.tips}</textarea>
                        </div>` +
            `<form action="/file-upload" class="dropzone drop-zone-form" id="myAwesomeDropzone${countsteps}"><div class="fallback"><input name="file" type="file" multiple /></div></form>`;

        content += `</li>`;
        $('.list-sortable.steps').append(content);
        try {
            displayImage(`myAwesomeDropzone${countsteps}`, images);
        } catch (e) {
        }
        bindMajesticItem()
    }

};
function GetImageRecipe() {
    $(".drop-zone-form").each((index, value) => {
        var id = value.getAttribute("id");
        listLocalStepImages[id] = [];
        var index = value.querySelectorAll(".dz-preview");
        var count = 0;
        for (var image of index) {
            count++;
            var imageUrl = image.firstElementChild.firstChild.getAttribute("src");
            if (imageUrl != null || imageUrl != "") {
                listLocalStepImages[id].push({
                    id: count,
                    fileStackUrl: imageUrl,
                });
            }
        }
    })
}
async function loadCategory(recipeId) {
    //var username = localStorage.getItem("username");
    //var currentUrl = window.location.href;
    //var recipeId = currentUrl.substr(currentUrl.indexOf('account/my-recipe/' + username + '/')).replace('account/my-recipe/' + username + '/', '');
    var res = await fetch(`${BASE_API_URL}/api/category/read`);
    var mains = await res.json();
    var recipeCategoriesRes = await fetch(`${BASE_API_URL}/api/category/read-categories-by-recipe?recipeId=` + recipeId);
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
        $('#phanloai').append(div);
    });
    $('#phanloai')[0].innerHTML += '<div class="text-center">' +
        '<button type = "submit" id = "submitBtn" class="recipe-submit-btn"> Cập nhật công thức</button >' +
        '</div >';
    LoadCheckedCategory(data);
};
function LoadCheckedCategory(data) {
    $('input[name="categoryItem"]').each(function () {
        for (let dataItem of data) {
            if (+dataItem.categoryItemId === +$(this).val()) {
                $(this).attr('checked', 'checked');
            }
        }
    });
}

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

function getData(recipeId, saveDraft) {
    //var username = localStorage.getItem("username");
    //var currentUrl = window.location.href;
    //var recipeId = currentUrl.substr(currentUrl.indexOf('account/my-recipe/' + username + '/')).replace('account/my-recipe/' + username + '/', '');
    var active = $('#recipe-active').val();

    var validation = true;
    var avatar = $("#coverAvatar img").first().attr("src")
    //var imgCover = $(".text-center")[0].files[0];
    var title = $("input[name='title']").val().trim();
    validation = validationField('title', title, saveDraft) && validation;
    var content = $("#recipe-content").val().trim();
    validation = validationField('content', content, saveDraft) && validation;
    var serving = $("input[name='serving']").val();
    var cooktime = $("input[name='cooktime']").val();
    var level = $("select[name='level']").val();
    var videoCode = $("input[name='videoCode']").val();
    var createTime = $('input[name="createTime"]').val();
    var ingredientsWeight = $("input[name='ingredientsWeight']");
    var ingredientsName = $("input[name='ingredients']");
    var ingredients = [];
    $(ingredientsName).each(i => {
        validation = validationField('ingredients', $(ingredientsName[i]).val().trim(), saveDraft) && validation;
        var ingredientId = Number.parseInt($(ingredientsWeight[i]).attr('id'));
        ingredients.push({
            Id: ingredientId ? ingredientId : 0,
            IngredientName: $(ingredientsName[i]).val().trim(),
            Quantitative: $(ingredientsWeight[i]).val()
        });
    });
    var stepTipsDescription = $("textarea[name='stepsTips']");
    var stepDescription = $("textarea[name='stepsDes']");
    var steps = [];
    GetImageRecipe();
    $(stepDescription).each((index, value) => {
        var dropZoneId = $(value).parent(".add-fields").siblings(".dropzone").first().attr("id");
        validation = validationField('stepsDes', $(value).val().trim(), saveDraft) && validation;
        var imageUrl = "";
        if (listLocalStepImages[dropZoneId] != null) {
            listLocalStepImages[dropZoneId].forEach(x => {
                if (x.fileStackUrl.match("http")) {
                    imageUrl += x.fileStackUrl + ";";
                }
            });
        }
        if (listStepImages[dropZoneId] != null) {
            listStepImages[dropZoneId].forEach(x => {
                imageUrl += x.fileStackUrl + ";";
            });
        }
        var stepsId = Number.parseInt($(stepDescription[index]).attr('id'));
        steps.push({
            Id: stepsId ? stepsId : 0,
            Description: value.value,
            Tips: $(stepTipsDescription)[index].value,
            ImageUrl: imageUrl,
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
            ImageCover: avatar,
            Id: recipeId,
            CreateTime: createTime,
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

function validationField(name, value, saveDraft) {
    if (!saveDraft) {
        if (value === '' || value === undefined) {
            $('span[name=' + name + ']').css('display', 'block');
            return false;
        } else {
            $('span[name=' + name + ']').css('display', 'none');
            return true;
        }
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
    countsteps++;
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields">' +
        ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
        '<textarea class="short-text" name="stepsDes" id="stepsDes" cols="30" rows="10">    </textarea><input type="hidden" name="stepsId" value="0" />' +
        ' <span class="del-list"><i class="fa fa-trash"></i></span>' +
        '</div>' +
        `<div class="add-fields" style="margin-top: 20px"><textarea class="short-text" name="stepsTips" id="stepsTips${countsteps}" cols="30" rows="10" placeholder="Mẹo nhỏ cho bước này (có thể bỏ qua)" ></textarea></div>` +
        `<form action="/file-upload" class="dropzone drop-zone-form" id="myAwesomeDropzone${countsteps}"><div class="fallback"><input name="file" type="file" multiple /></div></form>` +
        '</li>';
    $('.list-sortable.steps').append(newMajesticItem);
    $('.list-sortable.steps').children("li").slideDown();
    try {
        dropzoneForm(`myAwesomeDropzone${countsteps}`);
    } catch (e) {
    }
    bindMajesticItem();
});

$('.add-ingredient').on("click", function (event) {
    countIngredient++;
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields"><span class="ingredient-handler-list handler-list">' +
        '<i class="fa fa-arrows"></i></span >' +
        `<div class="autocomplete"><input class="ingredient-detail"autocomplete="off"  type="text" name="ingredients" data-suggest-quantitivie="ingredientsWeight${countIngredient}" id="ingredients${countIngredient}" placeholder="Muối, Đường, thịt gà ..." onclick="SuggestIngredient(this);"/></div>` +
        `<input class="ingredient-weight" type="text" name="ingredientsWeight" id="ingredientsWeight${countIngredient}" placeholder="1g, 1kg, 1 thìa ..."/><input type="hidden" name="ingredientId" value="0" />` +
        '<span class="del-list"><i class="fa fa-trash"></i></span></div >' +
        '</li>';
    $('.list-sortable.ingredients-list').append(newMajesticItem);
    $('.list-sortable.ingredients-list').children("li").slideDown();
    bindMajesticItem();

    event.preventDefault();
});
function displayImage(id, images) {
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(`#${id}`, {
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        maxFiles: 6,
        addRemoveLinks: true,
        accept: function (file, done) {
            var id = this.element.id;
            uploadFile(file)
                .then(x => {
                    if (!listStepImages[id]) listStepImages[id] = [];
                    listStepImages[id].push({
                        id: file.upload.uuid,
                        fileStackUrl: x.url,
                    });
                    done();
                }).catch(err => {
                    console.error(err);
                    done();
                });
        },
        removedfile: function (file) {
            var name = file.name;
            $.ajax({
                type: 'POST',
                url: 'delete.php',
                data: "id=" + name,
                dataType: 'html'
            });
            var _ref;
            // clean in listStepImages
            var stepImagesId = this.element.id;
            if (listStepImages[stepImagesId] != null) {
                listStepImages[stepImagesId] = listStepImages[stepImagesId].filter(function (value, index, arr) {
                    return value.id != file.upload.uuid;
                });
            }
            // remove dragzone image and return value
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
        init: function () {
            this.on('error', function (file, errorMessage) {
                if (file.accepted) {
                    var mypreview = document.getElementsByClassName('dz-error');
                    mypreview = mypreview[mypreview.length - 1];
                    mypreview.classList.toggle('dz-error');
                    mypreview.classList.toggle('dz-success');
                }
            });
        }
        //more dropzone options here
    });

    //Add existing files into dropzone
    var existingFiles = [];
    var countImage = 0;
    for (image of images) {
        if (image != "") {
            existingFiles.push({ id: countImage, name: image, size: 12345678 });
        }
        countImage++;
    }

    for (i = 0; i < existingFiles.length; i++) {
        myDropzone.emit("addedfile", existingFiles[i]);
        myDropzone.emit("thumbnail", existingFiles[i], existingFiles[i].name);
        myDropzone.emit("complete", existingFiles[i]);
    }
}
function dropzoneForm(id) {
    $(`#${id}`).dropzone({
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        maxFiles: 6,
        accept: function (file, done) {
            var id = this.element.id;
            uploadFile(file)
                .then(x => {
                    if (!listStepImages[id]) listStepImages[id] = [];
                    listStepImages[id].push({
                        id: file.upload.uuid,
                        fileStackUrl: x.url,
                    });
                    done();
                }).catch(err => {
                    console.error(err);
                    done();
                });
        },
        success: function (file, response) {
            obj = JSON.parse(response);
            console.log(obj.filename); // <---- here is your filename
        },
        addRemoveLinks: true,
        dictDefaultMessage: "Upload hình ảnh (tối đa 6 ảnh)",
        removedfile: function (file) {
            var name = file.name;
            $.ajax({
                type: 'POST',
                url: 'delete.php',
                data: "id=" + name,
                dataType: 'html'
            });
            var _ref;
            // clean in listStepImages
            var stepImagesId = this.element.id;

            if (listStepImages[stepImagesId] != null) {
                listStepImages[stepImagesId] = listStepImages[stepImagesId].filter(function (value, index, arr) {
                    return value.id != file.upload.uuid;
                });
            }
            // remove dragzone image and return value
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
        init: function () {
            this.on('error', function (file, errorMessage) {
                if (file.accepted) {
                    var mypreview = document.getElementsByClassName('dz-error');
                    mypreview = mypreview[mypreview.length - 1];
                    mypreview.classList.toggle('dz-error');
                    mypreview.classList.toggle('dz-success');
                }
            });
            this.on("success", function (file, responseText) {
                console.log(responseText);
            });
        }
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
        picker_btn_input.change(async function () {
            var eleJquery = $(this);
            if (eleJquery.prop('files')[0]) {
                // Use FileReader to get file
                var reader = new FileReader();
                // Create a preview once image has loaded
                reader.onload = async function (e) {
                    var preview = await create_preview(that, e.target.result, settings);
                    $(that).html(preview);
                    // update data temp src, later
                }
                // Load image
                reader.readAsDataURL(picker_btn_input.prop('files')[0]);
                $(that).css('display', 'block');
            }
            else if (eleJquery.attr("data-temp-src")) {
                var tempSrc = eleJquery.attr("data-temp-src");
                var preview = await create_preview(that, tempSrc, settings);
                $(that).html(preview);
                $(that).css('display', 'block');
            }
        });

        return picker_btn
    };

    // Private function for creating a preview element
    async function create_preview(that, src, settings) {
        var image;
        // upload
        if (src.indexOf("http") !== -1) {
            image = src;
        }
        else {
            var fileStackImage = await uploadFile(src);
            image = fileStackImage.url;
        }
        // The preview image
        var picker_preview_image = $('<img src="' + image + '" class="img-responsive img-rounded" />');
        // The preview element
        var picker_preview = $('<div class="text-center"></div>')
            .append(picker_preview_image)
        return picker_preview;
    };

}(jQuery));

