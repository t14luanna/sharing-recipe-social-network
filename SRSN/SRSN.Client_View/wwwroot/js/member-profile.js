

const createPersonalInfoElement = (info) =>
    `<table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Tên</th>
                                                                <td><input type="text" value="${info.firstName}" class="read" id="firstName">
                                                                    <input type="hidden" value="${info.firstName}" class="read" id="hiddenFirstName">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Họ</th>
                                                                <td>
                                                                    <input type="text" value="${info.lastName}" class="read" id="lastName">
                                                                    <input type="hidden" value="${info.lastName}" class="read" id="hiddenLastName">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Giới tính</th>
                                                                <td>
                                                                    <select id="myselect" class="read">
                                                                        <option value="1" data-value="1">Nam</option>
                                                                        <option value="2" data-value="2">Nữ</option>
                                                                        <option value="3" data-value="3">Khác</option>
                                                                    </select>
                                                                    <input type="hidden" value="${info.gender}" class="read" id="hiddenGender">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Ngày sinh</th>
                                                                <td><input type="date" name="bday" value="${ new Date(info.createTime).getFullYear() + "-" +
                                                                        new Date(info.createTime).getMonth() + "/" + new Date(info.createTime).getDay()}" class="read" id="birthdate">
                                                                    <input type="date" value="${ new Date(info.createTime).getFullYear() + "-" +
                                                                        new Date(info.createTime).getMonth() + "/" + new Date(info.createTime).getDay()}}" class="read" id="hiddenBirthdate" style="display:none;">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>`;

const createDescription = (des) =>
    `<textarea name="Text1" cols="90" rows="5" class="read" id="description"> ${des}</textarea >
     <textarea name="Text1" cols="90" rows="5" class="read" id="hiddenDescription" style="display:none;"> ${des}</textarea >
    `;
const createContactInfo = (user) =>
    `<table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Điện thoại</th>
                                                                <td>
                                                                    <input type="text" value="${user.phone}" style="width: 200px;" class="read" id="phone">
                                                                    <input type="hidden" value="${user.phone}" style="width: 200px;" class="read" id="hiddenPhone">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">E-mail</th>
                                                                <td>
                                                                    <input type="text" value="${user.email}" style="width: 300px;" class="read" id="email">
                                                                    <input type="hidden" value="${user.email}" style="width: 300px;" class="read" id="hiddenEmail">
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th class="fw--700 text-darkest">Địa chỉ</th>
                                                                <td>
                                                                    <input type="text" value="${user.address}" style="width: 500px;" class="read" id="address">
                                                                    <input type="hidden" value="${user.address}" style="width: 500px;" class="read" id="hiddenAddress">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>`;
const callAccountInforApi = async (username) => {
    var userNameLocalStorage = localStorage.getItem("username");
    var res;
    var data;
    if (username == userNameLocalStorage) {
        var authorization = localStorage.getItem("authorization");
        var token = (JSON.parse(authorization))["token"];
         res = await fetch("https://localhost:44361/api/account/read-userinfo", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        data = await res.json();
    } else {
        res = await fetch(`https://localhost:44361/api/account/read-username?userName=${username}`); /* tim theo user name*/
        data = await res.json();
        data = data[0];
    }

    //Update profile user
    $("#btnUpdateInfo").on("click", function (e) {
        $(this).attr("disabled", "disabled");
        e.preventDefault();
        fetch("https://localhost:44361/api/account/update", {
            method: 'PUT',
            body: JSON.stringify({
                'firstName': $('#firstName').val(),
                'lastName': $('#lastName').val(),
                'gender': $('#myselect>option:selected').val(),
                'birthdate': $('#birthdate').val(),
                'description': $('#hiddenDescription').val(),
                'phone': $('#hiddenPhone').val(),
                'email': $('#hiddenEmail').val(),
                'address': $('#hiddenAddress').val()
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.message) {
                    var username = localStorage.getItem("username");
                    alert("Bạn đã update thành công Info của account " + username);
                    window.location.href = '/';
                }
            })
            .catch(error => {
                $("#btnUpdateInfo").removeAttr("disabled");
                console.error('Error: ', error);
            });
    });

    $("#btnUpdateHistory").on("click", function (e) {
        $(this).attr("disabled", "disabled");
        e.preventDefault();
        fetch("https://localhost:44361/api/account/update", {
            method: 'PUT',
            body: JSON.stringify({
                'firstName': $('#hiddenFirstName').val(),
                'lastName': $('#hiddenLastName').val(),
                'gender': $('#hiddenGender').val(),
                'birthdate': $('#hiddenBirthdate').val(),
                'description': $('#description').val(),
                'phone': $('#hiddenPhone').val(),
                'email': $('#hiddenEmail').val(),
                'address': $('#hiddenAddress').val()
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.message) {
                    var username = localStorage.getItem("username");
                    alert("Bạn đã update thành công History của account " + username);
                    window.location.href = '/';
                }
            })
            .catch(error => {
                $("#btnUpdateHistory").removeAttr("disabled");
                console.error('Error: ', error);
            });
    });

    $("#btnUpdateContact").on("click", function (e) {
        $(this).attr("disabled", "disabled");
        e.preventDefault();
        fetch("https://localhost:44361/api/account/update", {
            method: 'PUT',
            body: JSON.stringify({
                'firstName': $('#hiddenFirstName').val(),
                'lastName': $('#hiddenLastName').val(),
                'gender': $('#hiddenGender').val(),
                'birthdate': $('#hiddenBirthdate').val(),
                'description': $('#hiddenDescription').val(),
                'phone': $('#phone').val(),
                'email': $('#email').val(),
                'address': $('#address').val()
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.message) {
                    var username = localStorage.getItem("username");
                    alert("Bạn đã update thành công Contact của account " + username);
                    window.location.href = '/';
                }
            })
            .catch(error => {
                $("#btnUpdateContact").removeAttr("disabled");
                console.error('Error: ', error);
            });
    });

    
    
    var personalInfo = createPersonalInfoElement(data);
    $("#personal-info").append(personalInfo);

    var description = createDescription(data.description);
    $("#user-description").append(description);

    var contact = createContactInfo(data);
    $("#user-contact").append(contact);

    $("#myselect option[data-value='" + data.gender + "']").attr("selected", "selected");
    if (username == userNameLocalStorage) {//chinh chủ
        $(".edit-profile").css("display", "inline-table");
    } else {

        $(".edit-profile").css("display", "none");
        $(".read").attr("readonly", "readonly");
    }
};
