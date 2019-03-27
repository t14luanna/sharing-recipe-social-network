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
                                                                    <i class="fa mr--8 fa-clock-o"></i>${ new Date(recipe.createTime).getDay() + "/" + new Date(recipe.createTime).getMonth() + "/" + new Date(recipe.createTime).getFullYear()}
                                                                </p>
                                                            </div>
                                                            <i class="fa fa-trash icon-delete" onclick="deleteRecipeInMyRecipe(${recipe.id})" style="margin-left: 90%;" ></i>
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
    var res = await fetch(`${BASE_API_URL}/api/recipe/read?userId=` + userId);
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        count++;
        if (item.referencedRecipeId == null) {
            var element = createRecipeByUserId(item);
            $("#my-recipe-box").append(element);
            $("#my-recipe-box").css('height', 'auto');
        }
    }
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