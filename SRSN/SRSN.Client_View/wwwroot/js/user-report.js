$("#report-recipe-form").on("submit", function (e) {
        e.preventDefault();
        var description = $('#reportDescription').val();
        if (!description) {
            alert('Xin vui lòng nhập vào lý do bạn muốn tố cáo công thức này');
            return false;
        }
        var currentUrl = window.location.href;
        var recipeId = currentUrl.substr(currentUrl.indexOf('recipe/')).replace('recipe/', '');

        var authorization = localStorage.getItem("authorization");
        var token = (JSON.parse(authorization))["token"];
        var data = JSON.stringify({
            'recipeReportedId': recipeId,
            'description': description
        });

    fetch(`${BASE_API_URL}/api/userreportrecipe/create-report-recipe`, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    alert("Chúng tôi sẽ xử lý yêu cầu của bạn");
                    //location.reload();
                }
            })
            .catch(error => {
                console.log('Error: ' + error);
            });
});

$("#report-user-form").on("submit", function (e) {
    e.preventDefault();
    var description = $('#reportUserDescription').val();
    if (!description) {
        alert('Xin vui lòng nhập vào lý do bạn muốn tố cáo người dùng này');
        return;
    }
    var currentUrl = window.location.href;
    var userName = currentUrl.substr(currentUrl.indexOf('account/information/')).replace('account/information/', '');
    fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-username?userName=` + userName)
        .then(res => res.json())
        .then(response => {
            var userReportedId = response.id;
            var authorization = localStorage.getItem("authorization");
            var token = (JSON.parse(authorization))["token"];
            var data = JSON.stringify({
                'reportedUserId': userReportedId,
                'description': description
            }); /* tim theo user name*/
            fetch(`${BASE_API_URL}/${USER_REPORT_USER}/create-report-user`, {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        alert("Chúng tôi sẽ xử lý yêu cầu của bạn");
                        //location.reload();
                    }
                })
                .catch(error => {
                    console.log('Error: ' + error);
                });
        });
});