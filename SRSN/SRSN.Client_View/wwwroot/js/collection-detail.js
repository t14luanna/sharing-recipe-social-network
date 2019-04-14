let collectionUserId, currentUserId;
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
                                <p>Người tạo:  <a class="cooky-user-link name" href="/account/timeline/${collection.username}">${collection.fullName}</a></p>
                            </div>`;
const callReadCollectionIdApi = async (collectionId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    currentUserId = localStorage.getItem("userId");
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/read-by-Id?collectionId=${collectionId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var data = await res.json();
    collectionUserId = data.userId;
    var issaved = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/is-saved-collection?userId=${currentUserId}&collectionId=${collectionId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    let element = createCollectionHeaderContainer(data);
    $("#avatar-container").append(element);
    if (collectionUserId == currentUserId) {
        $(".delete-button").append(deleteButton(collectionId));
    } else {
        if (issaved.status == 200) {
            $(".delete-button").append(unsaveCollectionButton(collectionId, currentUserId));
        } else {
            $(".delete-button").append(addCollectionButton(collectionId));
        }
    }
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
    
    var data = await res.json();
    for (var item of data) {
        var element = createSinglerRecipes(item);
        $(".listing-grid").append(element);
        if (collectionUserId == currentUserId) {
            $(`#recipe-${item.recipePostId}`).append(deleteRecipeButton(item));
        }
    }
};
const deleteButton = (collectionID) =>
    `<a href="#/" class="default-btn mid-button theme-tag-color" onclick="deleteCollectionById(${collectionID})">Xóa bộ sưu tập</a>`;
const deleteRecipeButton = (recipe) =>
    `<i class="fa fa-trash icon-delete" onclick="deleteRecipeInMyCollection(${recipe.collectionId},${recipe.recipePostId})"></i>`;
const addCollectionButton = (collectionID) =>
    `<a href="#/" class="default-btn mid-button theme-color" onclick="callAddCollectionApi(${collectionID})">Lưu bộ sưu tập</a>`;
const unsaveCollectionButton = (collectionID, currentUserId) =>
    `<a href="#/" class="default-btn mid-button theme-tag-color" onclick="callUnSaveCollectionApi(${collectionID}, ${currentUserId})">Bỏ lưu bộ sưu tập</a>`;
const createSinglerRecipes = (recipe) => `<div class="listing custom-listing" style="margin-left: 10px;" id="${recipe.collectionId}${recipe.recipePostId}">
    <div class="image">
        <a href="/recipe/${recipe.recipePostId}">
            <img src="${recipe.imageCover}" alt="image" class="custome-image-listing"/>
        </a>
    </div>
    <div class="detail custom-grid detail-collection-grid">
        <h4><a href="#">${recipe.recipeName}</a></h4>
        
        <div class="meta-listing" id="recipe-${recipe.recipePostId}">
            <ul class="post-meta">
                <li class="author"><a href="#">${recipe.authorName}</a></li>
            </ul>
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
    swal.fire({
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
        swal.fire({
            type: 'success',
            title: 'Thông báo',
            text: 'Xóa công thức khỏi bộ sưu tập thành công!',
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
        swal.fire({
            type: 'success',
            title: 'Thông báo',
            text: 'Lưu bộ sưu tập thành công!',
        });
        setTimeout(async function () {
            window.location.replace(`/account/collection/${window.localStorage.getItem("username")}`);
        }, 1500);
    }
};
const callUnSaveCollectionApi = async (collectionId, currentUserId) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/un-saved-collection?userId=${currentUserId}&collectionId=${collectionId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status == 200) {
        swal.fire({
            title: "",
            text: "Bạn đã bỏ lưu bộ sưu tập thành công",
            type: "success",
            closeOnConfirm: true
        });
        setTimeout(async function () {
            window.location.replace(`/account/collection/${window.localStorage.getItem("username")}`);
        }, 1500);
    }
};