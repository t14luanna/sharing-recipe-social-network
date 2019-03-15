const callReadUserByTokerApi = async () => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-profile-token`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var data = await res.json();
    return data;
};
const createCollectionHeaderContainer = (collection) =>
    `<div class="cover--avatar online" data-overlay="0.3" data-overlay-color="primary">
                                <img src="${collection.coverImage}" alt="" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';"/>
                            </div>

                            <div class="cover--user-name">
                                <h2 class="h3 fw--600">${collection.collectionName}</h2>
                            </div>
                            <div class="cover--user-desc fw--400 fs--18 fstyle--i text-darkest">
                                <p>Người tạo: ${collection.fullName}</p>
                            </div>`;
const callReadCollectionIdApi = async (collectionId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/read-by-Id?collectionId=${collectionId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var data = await res.json();
    let element = createCollectionHeaderContainer(data);
    $("#avatar-container").append(element);
};

const callRecipeByCollectionIdApi = async (collectionId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_POST_API_URL}/get-recipes?collectionId=${collectionId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    $(".delete-button").append(deleteButton(collectionId));
    var data = await res.json();
    for (var item of data) {
        var element = createSinglerRecipes(item);
        $(".listing-grid").append(element);
    }
};
const deleteButton = (collectionID) =>
    `<button class="delete-collection-button" onclick="deleteCollectionById(${collectionID})"><i class="fa fa-close"></i> Xóa Bộ Sưu Tập</button>
                                            <div class="filter--options float--right">
                                            </div>`;
const createSinglerRecipes = (recipe) => `<div class="listing custom-listing" style="margin-left: 10px;" id="${recipe.collectionId}${recipe.recipePostId}">
    <div class="image">
        <a href="/recipe/${recipe.recipePostId}">
            <img src="${recipe.imageCover}" alt="image" class="custome-image-listing"/>
        </a>
    </div>
    <div class="detail custom-grid">
        <h4><a href="#">${recipe.recipeName}</a></h4>
        
        <div class="meta-listing">
            <ul class="post-meta">
                <li class="author"><a href="#">${recipe.authorName}</a></li>
            </ul>
            <i class="fa fa-trash icon-delete" onclick="deleteRecipeInMyCollection(${recipe.collectionId},${recipe.recipePostId})"></i>
        </div>
    </div>
    
</div>`;
async function deleteCollectionById(collectionId) {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var data = {
        Id: collectionId
    };
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/delete`, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (res.status == 200) {//delete successfully
        alert("Bạn đã xóa thành công Bộ sưu tập!!");
        window.location.replace(`/account/collection/${window.localStorage.getItem("username")}`);
    } else {
        alert("Không thể xóa Bộ Sưu Tập. Vui lòng thử lại!!!");
    }
};
async function deleteRecipeInMyCollection(collectionId, recipePostId ) {
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_POST_API_URL}/delete-recipepost?collectionId=${collectionId}&recipePostId=${recipePostId}`);

    if (res.status == 200) {//delete successfully
        alert("Bạn đã xóa thành công công thức này!");
        $(`#${collectionId}${recipePostId}`).remove();
        //window.location.reload();
    } else {
        alert("Không thể xóa công thức này. Vui lòng thử lại!!!");
    }
};