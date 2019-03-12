const createRecipeByUserId = (recipe) =>
    `<div class="col-md-4 col-xs-6 col-xxs-12">
<div class="box--item text-center" >
<a href="group-home.html" class="img" data-overlay="0.1">
                                                            <img src="${recipe.imageCover}" alt="">
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

const callRecipeByUserId = async () => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var userRes = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
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
        var element = createRecipeByUserId(item);
        $("#my-recipe-box").append(element);
        $("#my-recipe-box").css('height', 'auto');
    }
};