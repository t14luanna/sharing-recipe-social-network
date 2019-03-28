const apikey = 'AVDP56XFjTE6IJhKzXLK0z';
var countsteps = 1;
const client = filestack.init(apikey);
$('.add-recipe-steps').on("click", function (event) {
    event.preventDefault();
    countsteps++;
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields">' +
        ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
        '<textarea class="short-text" name="stepsDes" id="stepsDes" cols="30" rows="10">    </textarea>' +
        ' <span class="del-list"><i class="fa fa-trash"></i></span>' +
        '</div>' +
        '<div class="add-fields" style="margin-top: 20px"><textarea class="short-text" name="stepsTips" id="stepsTips" cols="30" rows="10" placeholder="Mẹo nhỏ cho bước này (có thể bỏ qua)" ></textarea></div>'+
        `<form action="/file-upload" class="dropzone drop-zone-form" id="myAwesomeDropzone${countsteps}"><div class="fallback"><input name="file" type="file" multiple /></div></form>`+
        '</li>';
    
    $('.list-sortable.steps').append(newMajesticItem);
    $('.list-sortable.steps').children("li").slideDown();
    dropzoneForm(`myAwesomeDropzone${countsteps}`);
    bindMajesticItem();
});
$('.add-ingredient').on("click", function (event) {

    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields"><span class="ingredient-handler-list handler-list">' +
        '<i class="fa fa-arrows"></i></span >' +
        '<input class="ingredient-detail" type="text" name="ingredients" id="ingredients" placeholder="Muối, Đường, thịt gà ..." />' +
        '<input class="ingredient-weight" type="text" name="ingredientsWeight" placeholder="1g, 1kg, 1 thìa ..."/>' +
        '<span class="del-list"><i class="fa fa-trash"></i></span></div >' +
        '</li>';
    $('.list-sortable.ingredients-list').append(newMajesticItem);
    $('.list-sortable.ingredients-list').children("li").slideDown();
    bindMajesticItem();

    event.preventDefault();
});
function bindMajesticItem() {

    /* Bind click event to remove detail icon button */

    $('.del-list').on("click", function (event) {
        event.preventDefault();
        var $this = $(this);
        $this.closest('li').slideUp(function () { $(this).remove(); });
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

async function loadCategory() {
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
    $('#phanloai')[0].innerHTML += '<div class="text-center">' +
        '<button type = "submit" id = "submitBtn" class="recipe-submit-btn" > Đăng công thức</button >' +
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
    var level = $("select[name='level']").val();
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
    var stepTipsDescription = $("textarea[name='stepsTips']");
    var stepsImages = $("input[name='stepsImage']");
    var steps = [];

    $(stepDescription).each(i => {
        var dropZoneId = $(stepDescription[i]).parent(".add-fields").siblings(".dropzone").first().attr("id");
        validation = validationField('stepsDes', $(stepDescription[i]).val().trim()) && validation;

        // prepare imageUrl
        var imageUrl = "";
        if (listStepImages[dropZoneId]!= null) {
            listStepImages[dropZoneId].forEach(x => {
                imageUrl += x.fileStackUrl + ";";
            })
        }

        //let files = stepsImages[i].files;
        steps.push({
            Description: $(stepDescription[i]).val().trim(),
            Tips: $(stepTipsDescription)[i].value,
            ImageUrl: imageUrl,
            //files: files
        }); 
    });
    console.log(steps);
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
        listCategory: categoriesItem,
        listSORVM: steps,
        listIngredient: ingredients
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
        //for (let sorvm of data.listSORVM) {
            //for (let image of sorvm.files) {
            //    await uploadFile(image).then(res => {
            //        sorvm.ImageUrl += res.url + ";";
            //    })
            //}
            /* await uploadFile(sorvm.ImageUrl).then((res) => {
                sorvm.ImageUrl = res.url;
            }); */
        //}
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