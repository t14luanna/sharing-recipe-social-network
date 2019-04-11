const username = localStorage.getItem("username");
const createRecipeByUserId = (recipe) =>
    `<div class="col-md-4 col-xs-6 col-xxs-12" id="${recipe.id}">
<div class="box--item text-center" >
<a href="/recipe/${recipe.id}" class="img" data-overlay="0.1">
                                                            <img src="${recipe.imageCover}" alt="" class="img-my-recipe"  onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                                        </a>
                                                        <div class="info">
                                                            <div class="title">
                                                                <h2 class="h6">
                                                                    <a href="/recipe/${recipe.id}">${recipe.recipeName}</a>
                                                                </h2>
                                                            </div>
                                                            <div class="meta">
                                                                <p>
                                                                    <i class="fa mr--8 fa-clock-o"></i>${ new Date(recipe.createTime).getDate()}/${new Date(recipe.createTime).getMonth() + 1}/${new Date(recipe.createTime).getFullYear()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <i class="fa fa-trash icon-delete" onclick="deleteRecipeInMyRecipe(${recipe.id})" style="margin-left: 85%;" ></i>
                                                                <a href="/account/my-recipe/${username}/${recipe.id}"<i class="fa fa-pencil-square-o icon-edit"></i></a>
                                                            </div>
                                                        </div>
</div>
</div>`;

const callRecipeByUserId = async (username) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var userRes = await fetch(`${BASE_API_URL}/api/account/read-username?username=${username}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
    });
    var userData = await userRes.json();
    var userId = userData.id;
    $("#pagination-container").pagination({
        dataSource: `${BASE_API_URL}/api/recipe/read-orderby-time?userId=${userId}`,
        locator: '',// array
        totalNumberLocator: function (response) {
            return response.length;
        },
        //totalNumber: 40,
        pageSize: 9,
        ajax: {
            beforeSend: function () {
                $('#my-recipe-box').html('Đang tải dữ liệu ...');
            }
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = template(data, pagination);
            $('#my-recipe-box').html(html);
            $("#my-recipe-box").css('height', 'auto');
        }
    });
    //var res = await fetch(`${BASE_API_URL}/api/recipe/read-orderby-time?userId=` + userId);
    //var data = await res.json();
    //var count = 0;
    //for (var item of data) {
    //    count++;
    //    if (item.referencedRecipeId == null) {
    //        var element = createRecipeByUserId(item);
    //        $("#my-recipe-box").append(element);
    //        $("#my-recipe-box").css('height', 'auto');
    //    }
    //}
};

var template = function (data, pagination) {
    var pageSize = pagination.pageSize;
    var currentPageNumber = pagination.pageNumber - 1;
    var s = "";

    var count = 0;
    while (count < pageSize) {
        var i = currentPageNumber * pageSize + count;
        if (i >= data.length) {
            break;
        }
        s += createRecipeByUserId(data[i]);
        count++;
    }
    return s;
};
async function deleteRecipeInMyRecipe(recipeId) {
    swal({
        title: "Bạn muốn xóa?",
        text: "Sau khi xóa, bạn sẽ không thấy Công Thức này!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deactivateRecipe(recipeId);
            } else {
                //do nothing
            }
        });
};
const deactivateRecipe = async (recipeId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var recipeRes = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/delete?recipeId=${recipeId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (recipeRes.status == 200) {
        swal("Bạn đã xóa thành công Bình Luận này!", {
            icon: "success",
        });
        $(`#${recipeId}`).remove();
    } else {
        alert("Bạn không thể xóa thành công Công Thức này, vui lòng thử lại!!!");
    }
};