const apikey = 'A1p11nq0RoGb8BRod5sOgz';
var countsteps = 1;
var listStepImages = {};
var listLocalStepImages = {};
var localStepsCount = 0;
const client = filestack.init(apikey);
var countIngredient = 1;
Dropzone.autoDiscover = false;
$('.add-recipe-steps').on("click", function (event) {
    event.preventDefault();
    countsteps++;
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields">' +
        ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
        `<textarea class="short-text" name="stepsDes" id="stepsDes${countsteps}" cols="30" rows="10">    </textarea><input type="hidden" name="stepsId" value="0" />` +
        ' <span class="del-list"><i class="fa fa-trash"></i></span>' +
        '</div>' +
        `<div class="add-fields" style="margin-top: 20px"><textarea class="short-text" name="stepsTips" id="stepsTips${countsteps}" cols="30" rows="10" placeholder="Mẹo nhỏ cho bước này (có thể bỏ qua)" ></textarea></div>` +
        `<form action="/file-upload" class="dropzone drop-zone-form" id="myAwesomeDropzone${countsteps}"><div class="fallback"><input name="file" type="file" multiple /></div></form>` +
        '</li>';
    $('.list-sortable.steps').append(newMajesticItem);
    $('.list-sortable.steps').children("li").slideDown();
    if (countsteps > localStepsCount) {
        try {
            dropzoneForm(`myAwesomeDropzone${countsteps}`);
        } catch (e) {
        }
    }
    bindMajesticItem();
});

$('.add-ingredient').on("click", function (event) {
    countIngredient++;
    var newMajesticItem = '<li style="display: none">' +
        '<div class="add-fields"><span class="ingredient-handler-list handler-list">' +
        '<i class="fa fa-arrows"></i></span >' +
        `<div class="autocomplete"><input class="ingredient-detail" type="text" name="ingredients" data-suggest-quantitivie="ingredientsWeight${countIngredient}" id="ingredients${countIngredient}" placeholder="Muối, Đường, thịt gà ..." onclick="SuggestIngredient(this);"/></div>` +
        `<input class="ingredient-weight" type="text" name="ingredientsWeight" id="ingredientsWeight${countIngredient}" placeholder="1g, 1kg, 1 thìa ..."/><input type="hidden" name="ingredientId" value="0" />` +
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
        debugger;
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
    LoadCheckedCategory();
};

function getData(currentRecipe,saveDraft) {
    var validation = true;
    // [Comment luu y ma so 01]
    // Neu la upload file thi dung nen gom chung vao 1 request object json
    // hay upload truoc roi dem duong link do gan vao muc nay
    // neu chua lam thi co the implement sau
    // nhung khong nen up file len
    // Truong hop demo, se lay name lam du lieu luu tru
    var avatar = $("#coverAvatar img").first().attr("src")
    //var avatar = $("input[name='avatarUpload']")[0].files[0];
    validation = validationField('avatarUpload', avatar, saveDraft) && validation;
    var title = $("input[name='title']").val().trim();
    validation = validationField('title', title, saveDraft) && validation;
    var content = $("#recipe-content").val().trim();
    validation = validationField('content', content, saveDraft) && validation;
    var serving = $("input[name='serving']").val();
    var cooktime = $("input[name='cooktime']").val();
    var level = $("select[name='level']").val();
    var videoCode = $("input[name='videoCode']").val();
    var recipeId = $("#recipeId").val();

    var ingredientsWeight = $("input[name='ingredientsWeight']");
    var ingredientId = $("input[name='ingredientId']");
    var ingredientsName = $("input[name='ingredients']");
    var ingredients = [];
    $(ingredientsName).each(i => {
        validation = validationField('ingredients', $(ingredientsName[i]).val().trim(), saveDraft) && validation;
        validation = validationField('ingredients', $(ingredientsWeight[i]).val().trim(), saveDraft) && validation;
        ingredients.push({
            Id: $(ingredientId[i]).val(),
            IngredientName: $(ingredientsName[i]).val().trim(),
            Quantitative: $(ingredientsWeight[i]).val()
        });
    });

    var stepDescription = $("textarea[name='stepsDes']");
    var stepTipsDescription = $("textarea[name='stepsTips']");
    var stepId = $("input[name='stepsId']");
    var steps = [];
    $(stepDescription).each((index, value) => {

        var dropZoneId = $(value).parent(".add-fields").siblings(".dropzone").first().attr("id");
        validation = validationField('stepsDes', $(value).val().trim(), saveDraft) && validation;

        var imageUrl = "";

        if (currentRecipe != null) {
            var stepIndex = currentRecipe.data.listSORVM[index];
            if (stepIndex != null) {
                GetImageDraftedRecipe(stepIndex, dropZoneId);
                if (listLocalStepImages[dropZoneId] != null) {
                    listLocalStepImages[dropZoneId].forEach(x => {
                        imageUrl += x.fileStackUrl + ";";
                    })
                }
            }
        }
        if (listStepImages[dropZoneId] != null) {
            listStepImages[dropZoneId].forEach(x => {
                imageUrl += x.fileStackUrl + ";";
            });
            listStepImages[dropZoneId] = [];
        }
        //var containerId = $(`#${dropZoneId}`);
        //var container = containerId[0].getElementsByClassName("dz-image-preview");
        //for (var i = 0; i < container.length; i++) {
        //    imageUrl += container[i].getElementsByClassName("dz-image")[0].firstElementChild.getAttribute("src") + ";";
        //}

        //let files = stepsImages[i].files;
        steps.push({
            Id: $(stepId)[index].value,
            Description: value.value,
            Tips: $(stepTipsDescription)[index].value,
            ImageUrl: imageUrl,
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
            VideoLink: videoCode,
            Id: recipeId
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

function uploadImageSubmit(data) {
    //return new Promise(async (resolve, reject) => {
    //    await uploadFile(data.recipeVM.ImageCover).then((res) => {
    //        data.recipeVM.ImageCover = res.url;
    //    });
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
    //    return resolve(data);
    //});
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
function GetImageDraftedRecipe(currentStep, dropZoneId) {
    let images = String(currentStep.ImageUrl);
    if (images != "") {
        images = images.split(';');
    }
    listLocalStepImages[dropZoneId] = [];
    if (images.length > 0) {
        try {
            for (image of images) {
                if (image != "") {
                    listLocalStepImages[dropZoneId].push({
                        id: dropZoneId,
                        fileStackUrl: image,
                    });
                }
            }
        } catch (e) {
        }
    }
}
// Module save draft
(function () {
    $('.img-picker').imagePicker({ name: 'images' });

    function DraftRecie(data) {
        window.localStorage.setItem("darftedRecipe", JSON.stringify(data));
    }
    function GetDraftedRecipe() {
        return JSON.parse(window.localStorage.getItem("darftedRecipe"));
    }

    function RecoveryRecipe(currentRecipe) {
        const subRecForm = $("#submit-recipe-form");
        // init basic property
        // - id
        subRecForm.find("#recipeId").val(currentRecipe.recipeVM.Id);
        // - RecipeName
        subRecForm.find("#title").val(currentRecipe.recipeVM.RecipeName);
        // - recipe description
        subRecForm.find("#recipe-content").val(currentRecipe.recipeVM.ContentRecipe);
        // - serving
        subRecForm.find("#serving").val(currentRecipe.recipeVM.Serving);
        // - cookTime
        subRecForm.find("#cooktime").val(currentRecipe.recipeVM.Cooktime);
        // - level (do kho)
        subRecForm.find("#level").val(currentRecipe.recipeVM.LevelRecipe);
        // - video link
        subRecForm.find("#video-code").val(currentRecipe.recipeVM.VideoLink);
        // - avatar url
        $("input[name='avatarUpload']").attr("data-temp-src", currentRecipe.recipeVM.ImageCover);
        $("input[name='avatarUpload']").trigger("change");
        // - ingredients
        const ingredientCount = currentRecipe.listIngredient.length;
        const stepCount = currentRecipe.listSORVM.length;
        // because the first is aldready created
        // so skip the first
        for (var i = 0; i < ingredientCount; ++i) {
            var currentIngredient = currentRecipe.listIngredient[i];
            if (i !== 0) {
                $(".add-ingredient").trigger("click");
            }
            $(`#ingredients${i + 1}`).val(currentIngredient.IngredientName);
            $(`#ingredientsWeight${i + 1}`).val(currentIngredient.Quantitative);
        }
        // - steps
        for (var i = 0; i < stepCount; ++i) {
            var currentStep = currentRecipe.listSORVM[i];
            let images = String(currentStep.ImageUrl);
            if (images != "") {
                images = images.split(';');
            }
            localStepsCount = i + 1;
            if (i !== 0) {
                $(".add-recipe-steps").trigger("click");
                countsteps = localStepsCount;
            }
            

            if (images.length > 0) {
                try {
                    displayImage(`myAwesomeDropzone${localStepsCount}`, images);
                } catch (e) {
                }
            } else {
                try {
                    dropzoneForm(`myAwesomeDropzone${localStepsCount}`);
                } catch (e) {
                }
            }
            $(`#stepsDes${localStepsCount}`).val(currentStep.Description);
            $(`#stepsTips${localStepsCount}`).val(currentStep.Tips);
        }
        
    }

    const draftedRecipe = GetDraftedRecipe();
    if (draftedRecipe) {
        RecoveryRecipe(draftedRecipe.data);
    }

    // first time load page if have drafted recipe at local
    // call to render
    var countToServerSaveDraft = 0;
    var saveDraftThread = setInterval(function () {
        if (countToServerSaveDraft == 5) {
            // do nothing
            countToServerSaveDraft = 0;
            saveDraft(true);
        }
        else {
            ++countToServerSaveDraft;
        }
        // local save draft
        var currentDraftedRecipe = GetDraftedRecipe();
        const currentRecipe = getData(currentDraftedRecipe, true);
        DraftRecie(currentRecipe);
    }, 2000);
})();

function LoadCheckedCategory() {
    var index = JSON.parse(window.localStorage.getItem("darftedRecipe"));
    if (index!= null) {
        var currentRecipe = index.data;
        if (currentRecipe != null) {
            $('input[name="categoryItem"]').each(function () {
                for (let dataItem of currentRecipe.listCategory) {
                    if (+dataItem.categoryItemId === +$(this).val()) {
                        $(this).attr('checked', 'checked');
                    }
                }
            });
        }
    }
}

function displayImage(id, images) {
    try {
        var myDropzone = new Dropzone(`#${id}`,{
            paramName: "file", // The name that will be used to transfer the file
            maxFiles: 6,
            addRemoveLinks: true,
            dictDefaultMessage: "Upload hình ảnh (tối đa 6 ảnh)",
            url: "/file/post",
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
                removeImageLocal();
                if (listLocalStepImages[stepImagesId] != null) {
                    listLocalStepImages[stepImagesId] = listLocalStepImages[stepImagesId].filter(function (value, index, arr) {
                        return index != file.id;
                    });
                    var imageUrl = "";
                    listLocalStepImages[stepImagesId].forEach(x => {
                        imageUrl += x.fileStackUrl + ";";
                    })
                    $(".drop-zone-form").each((index, value) => {
                        if (value.id == stepImagesId) {
                            var draftRep = JSON.parse(window.localStorage.getItem("darftedRecipe"));
                            draftRep.data.listSORVM[index].ImageUrl = imageUrl;
                            window.localStorage.setItem("darftedRecipe", JSON.stringify(draftRep));
                        }
                    })
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
    } catch (e) {
        console.err("Display image error: ", e);
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
function removeImageLocal() {
    var recipeLocal = JSON.parse(window.localStorage.getItem("darftedRecipe"));
    if (recipeLocal != null) {
        var stepDescription = $("textarea[name='stepsDes']");
        $(stepDescription).each((index, value) => {
            var dropZoneId = $(value).parent(".add-fields").siblings(".dropzone").first().attr("id");
            if (recipeLocal != null) {
                var stepIndex = recipeLocal.data.listSORVM[index];
                if (stepIndex != null) {
                    GetImageDraftedRecipe(stepIndex, dropZoneId);
                }
            }
        });
    }
}