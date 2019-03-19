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
    $(".delete-button").append(addCollectionButton(collectionId));
    var data = await res.json();
    for (var item of data) {
        var element = createSinglerRecipes(item);
        $(".listing-grid").append(element);
    }
};
const deleteButton = (collectionID) =>
    `<a href="#/" class="default-btn mid-button theme-tag-color" onclick="deleteCollectionById(${collectionID})">Xóa bộ sưu tập</a>`;
const addCollectionButton = (collectionID) =>
    `<a href="#/" class="default-btn mid-button theme-color" onclick="callAddCollectionApi(${collectionID})">Lưu bộ sưu tập</a>`;
const createSinglerRecipes = (recipe) => `<div class="listing custom-listing" style="margin-left: 10px;" id="${recipe.collectionId}${recipe.recipePostId}">
    <div class="image">
        <a href="/recipe/${recipe.recipePostId}">
            <img src="${recipe.imageCover}" alt="image" class="custome-image-listing"/>
        </a>
    </div>
    <div class="detail custom-grid detail-collection-grid">
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
    swal({
        title: "Bạn muốn xóa?",
        text: "Sau khi xóa, bạn sẽ không thấy Bộ Sưu Tập này!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deactivateCollection(collectionId);
            } else {
                //do nothing
            }
        });
};
const deactivateCollection = async (collectionId) => {
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
        swal("Bạn đã xóa thành công Bình Luận này!", {
            icon: "success",
        });
        window.location.replace(`/account/collection/${window.localStorage.getItem("username")}`);
    } else {
        alert("Không thể xóa Bộ Sưu Tập. Vui lòng thử lại!!!");
    }
};
async function deleteRecipeInMyCollection(collectionId, recipePostId ) {
    swal({
        title: "Bạn muốn xóa?",
        text: "Sau khi xóa, bạn sẽ không thấy Công Thức này!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deactivateRecipe(collectionId, recipePostId);
            } else {
                //do nothing
            }
        });
};
const deactivateRecipe = async (collectionId, recipePostId) => {
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_POST_API_URL}/delete-recipepost?collectionId=${collectionId}&recipePostId=${recipePostId}`);

    if (res.status == 200) {//delete successfully
        swal("Bạn đã xóa thành công Bình Luận này!", {
            icon: "success",
        });
        $(`#${collectionId}${recipePostId}`).remove();
    } else {
        alert("Không thể xóa công thức này. Vui lòng thử lại!!!");
    }
};
const callAddCollectionApi = async (collectionId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var data = {
        collectionRefId: collectionId
    };
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status == 200) {
        Swal.fire({
            type: 'success',
            title: 'Thông báo',
            text: 'Lưu bộ sưu tập thành công!',
        })
    }
};