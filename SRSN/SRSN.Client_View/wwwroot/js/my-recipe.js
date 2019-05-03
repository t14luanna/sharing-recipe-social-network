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
                                                                <a href="/account/my-recipe/${username}/${recipe.id}/edit"<i class="fa fa-pencil-square-o icon-edit"></i></a>
                                                            </div>
                                                        </div>
</div>
</div>`;

const callRecipeByUserId = async (username, limit = 9, page = 0) => {
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
    var recipeRes = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/read-orderby-time?userId=${userId}&limit=${limit}&page=${page}`);
    var recipeData = await recipeRes.json();
    if (recipeData.length < limit) {
        $(".recipe-more").css("display", "none");
    }
    for (var item of recipeData) {
        var element = createRecipeByUserId(item);
        $('#my-recipe-box').append(element);
        $("#my-recipe-box").css('height', 'auto');
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
            'Authorization': `Bearer ${token} `
        },
    });
    if (recipeRes.status == 200) {
        swal("Bạn đã xóa thành công Công Thức này!", {
            icon: "success",
        });
        $(`#${recipeId}`).remove();
        //count my recipe
       
        var countRecipeRes = await fetch(`${BASE_API_URL}/${RECIPE_API_URL}/get-count-my-recipe?username=${username}`);
        var countRecipes = await countRecipeRes.json();
        $("#count-recipes").text(countRecipes.count);
    } else {
        alert("Bạn không thể xóa thành công Công Thức này, vui lòng thử lại!!!");
    }
};