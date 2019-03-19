var apikeyFilestack = 'AHs8S0A0zQ0SNWqyiHT2qz';
var clientFilestack = filestack.init(apikeyFilestack);
//var onProgress = (evt) => {
//    document.getElementById('progress').innerHTML = `${evt.totalPercent}%`;
//};

$("#comment-form").submit(function (e) {
    e.preventDefault();
    const token = {};
    var file = $('#fileUploadedPreview').attr('src');
    var authorization = localStorage.getItem("authorization");
    var tokenAuthorize = (JSON.parse(authorization))["token"];
    clientFilestack.upload(file, {}, {}, token)
        .then(res => {
            $('#fileUploadedLink').val(res.url);
            $('#fileUploadedPreview').attr('src', res.url);
            var formData = $('#comment-form').serializeArray();
            var data = {};
            $.map(formData, function (n, i) {
                data[n['name']] = n['value'];
            });
            fetch(`${BASE_API_URL}/api/collection/create`, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAuthorize}`
                }
            }).then(res => {
                if (res.status == "stored") {
                    swal("", "Bạn đã chia sẻ công thức thành công", "success");
                    console.log('success: ', response)
                }
            }).catch(error => console.error('Error:', error));
           
        })
        .catch(err => {
            console.log(err)
        });
});

$('#upload-image').on("change", function (e) {
    const files = event.target.files;
    const file = files.item(0);
    if (files && file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#fileUploadedPreview').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }
});

const createCollectionItem = (collection) => `<div class="col-md-3 col-xs-6 col-xxs-12"  >
                                                        <div class="member--item online  collection-item">
                                                        <div onclick="window.location='/account/collection-detail/${collection.id}'">
                                                        <div class="img-recipe-avatar">
                                                            <a class="btn-link">
                                                                <img src="${collection.coverImage}" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';">
                                                            </a>
                                                        </div>

                                                        <div class="name">
                                                            <h3 class="h6 fs--12">
                                                                <a href="member-activity-personal.html" class="btn-link">${collection.collectionName}</a>
                                                            </h3>
                                                        </div>
                                                        <div class="actions">
                                                            <ul class="nav">
                                                                <li>
                                                                    <a href="#" class="btn-link">
                                                                        <i class="fa fa-book"></i> ${collection.recipeCount} công thức
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#" class="btn-link">
                                                                        <i class="fa fa-bookmark"></i> ${collection.saveCount} lượt lưu
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>`;
const callReadCollectionApi = async (userName) => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/read-by-userName?userName=${userName}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    var elements = $(`.collection-item`);

    if (elements[0]) {

        elements.remove();

    }
    var data = await res.json();
    for (var item of data) {
        var content = createCollectionItem(item);
        $(".main-contain-collection").append(content);
    }
};

//function deactivateMemberCollection(collectionId) {
//    var data = {
//        Id: collectionId
//    };
//    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}`, {
//        method: "DELETE",
//        body: JSON.stringify(data),
//        headers: {
//            'Content-Type': 'application/json',
//            'Authorization': `Bearer ${token}`
//        }
//    });
//    if (res.status == 200) {
//        //deactivate thành công
//        alert("xóa thành công");

//    }
//}