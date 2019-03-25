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
                                                        </div>
</div>
</div>`;

const callFavoriteRecipeByUserId = async (username) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/api/userreactionrecipe/get-favorite-recipes?username=${username}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    var data = await res.json();
    for (var item of data) {
        if (item.referencedRecipeId == null) {
            var element = createRecipeByUserId(item);
            $("#my-recipe-box").append(element);
            $("#my-recipe-box").css('height', 'auto');
        }
    }
};
