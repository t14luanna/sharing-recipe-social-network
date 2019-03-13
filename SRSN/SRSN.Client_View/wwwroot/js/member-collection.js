var apikey = 'AHs8S0A0zQ0SNWqyiHT2qz';
var client = filestack.init(apikey);
var onProgress = (evt) => {
    document.getElementById('progress').innerHTML = `${evt.totalPercent}%`;
};
$("#comment-form").submit(function (e) {
    e.preventDefault();
    const token = {};
    var file = $('#fileUploadedPreview').attr('src');
    var authorization = localStorage.getItem("authorization");
    var tokenAuthorize = (JSON.parse(authorization))["token"];
    client.upload(file, { onProgress }, {}, token)
        .then(res => {
            $('#fileUploadedLink').val(res.url);
            $('#fileUploadedPreview').attr('src', res.url);
            var formData = $('#comment-form').serializeArray();
            var data = {};
            $.map(formData, function (n, i) {
                data[n['name']] = n['value'];
            });
            fetch("https://localhost:44361/api/collection/create", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAuthorize}`
                }
            }).then(res => res.json()).then(response => {
                    if (response.success) {
                        console.log('success: ', response)
                    }
                })
                .catch(error => console.error('Error:', error));
           
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

