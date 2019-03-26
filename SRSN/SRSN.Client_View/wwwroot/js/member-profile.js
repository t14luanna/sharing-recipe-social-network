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
                    <select id="gender" class="read">
                        <option value="1" data-value="1">Nam</option>
                        <option value="2" data-value="2">Nữ</option>
                        <option value="3" data-value="3">Khác</option>
                    </select>
                    <input type="hidden" value="${info.gender}" class="read" id="hiddenGender">
                </td>
            </tr>
            <tr>
                <th class="fw--700 text-darkest">Ngày sinh</th>
                <td>
                    <input type="text" name="birthdateStr" id="birthdateStr" required />
                    <input type="hidden" name="birthdate" id="birthdate" />
                </td>
            </tr>
        </tbody>
    </table>`;
const createDescription = (des) =>
    `<textarea name="Text1" cols="90" rows="5" class="read" id="description"> ${des}</textarea >
     <textarea name="Text1" cols="90" rows="5" class="read" id="hiddenDescription" style="display:none;"> ${des}</textarea >`;
const createContactInfo = (user) =>
    `<table class="table">
        <tbody>
            <tr>
                <th class="fw--700 text-darkest">E-mail</th>
                <td>
                    <input type="text" value="${user.email}" class="read" id="email">
                    <input type="hidden" value="${user.email}" class="read" id="hiddenEmail">
                </td>
            </tr>
            <tr>
                <th class="fw--700 text-darkest">Địa chỉ</th>
                <td>
                    <input type="text" value="${user.address}"  class="read" id="txtAddress">
                    <input type="hidden" value="${user.address}"class="read" id="hiddenAddress">
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
        res = await fetch(`${BASE_API_URL}/api/account/read-userinfo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        data = await res.json();
    } else {
        res = await fetch(`${BASE_API_URL}/account/read-username?userName=${username}`); /* tim theo user name*/
        data = await res.json();
        data = data[0];
    }
    var friendsRes = await fetch(`${BASE_API_URL}/api/userfollowing/read-following-user?userName=` + username);
    var friendData = await friendsRes.json();
    var countFriends = friendData.length;
    $("#count-friends").text(countFriends);
    //Update profile user
    $("#btnUpdateInfo").on("click", async function (e) {
        $(this).attr("disabled", "disabled");
        e.preventDefault();
        var res = await fetch(`${BASE_API_URL}/api/account/update`, {
            method: 'PUT',
            body: JSON.stringify({
                'firstName': $('#firstName').val(),
                'lastName': $('#lastName').val(),
                'gender': $('#gender>option:selected').val(),
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
        });
        if (res.status == 200) {
            Swal.fire({
                type: 'success',
                title: 'Thông báo',
                text: 'Cập nhật thông tin thành công!',
            })
            setTimeout(async function () {
                var username = localStorage.getItem("username");
                window.location.href = `/account/information/${username}`
            }, 1500);
        }
    });

    $("#btnUpdateHistory").on("click", async function (e) {
        $(this).attr("disabled", "disabled");
        e.preventDefault();
        var res =  await fetch(`${BASE_API_URL}/api/account/update`, {
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
        });
        var data = await res.json();
        if (res.status == 200) {
            Swal.fire({
                type: 'success',
                title: 'Thông báo',
                text: 'Cập nhật thông tin thành công!',
            })
            setTimeout(async function () {
                var username = localStorage.getItem("username");
                window.location.href = `/account/information/${username}`
            }, 1500);
        }
    });

    $("#btnUpdateContact").on("click", async function (e) {
        $(this).attr("disabled", "disabled");
        e.preventDefault();
        var res = await fetch(`${BASE_API_URL}/api/account/update`, {
            method: 'PUT',
            body: JSON.stringify({
                'firstName': $('#hiddenFirstName').val(),
                'lastName': $('#hiddenLastName').val(),
                'gender': $('#hiddenGender').val(),
                'birthdate': $('#hiddenBirthdate').val(),
                'description': $('#hiddenDescription').val(),
                'phone': $('#phone').val(),
                'email': $('#email').val(),
                'address': $('#txtAddress').val()
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        }); 
        if (res.status == 200) {
            Swal.fire({
                type: 'success',
                title: 'Thông báo',
                text: 'Cập nhật thông tin thành công!',
            })
            setTimeout(async function () {
                var username = localStorage.getItem("username");
                window.location.href = `/account/information/${username}`
            }, 1500);
        }
    });
    //var personalInfo = createPersonalInfoElement(data);
    //$("#personal-info").append(personalInfo);
    $("#firstName").val(data.firstName);
    $("#hiddenFirstName").val(data.firstName);
    $("#lastName").val(data.lastName);
    $("#hiddenLastName").val(data.lastName);
    //$("#gender").val(data.gender);
    $("#hiddenGender").val(data.gender);

    var birthDateValue = new Date(data.birthdate);
    $("#birthdateStr").val(birthDateValue.toLocaleDateString());
    $("#birthdate").val(birthDateValue.toLocaleDateString());

    $('#birthdateStr').daterangepicker(
        {
            singleDatePicker: true,
            showDropdowns: true,
            minYear: 1901,
            "locale": {
                "format": "MM/DD/YYYY",
                "separator": " - ",
                "applyLabel": "Xác nhận",
                "cancelLabel": "Hủy",
                "fromLabel": "Từ",
                "toLabel": "Đến",
                "customRangeLabel": "Tùy chọn",
                "daysOfWeek": [
                    "Chủ nhật",
                    "Thứ hai",
                    "Thứ ba",
                    "Thứ tư",
                    "Thứ năm",
                    "Thứ sáu",
                    "Thứ bảy"
                ],
                "monthNames": [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8",
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12"
                ],
                "firstDay": 1,
            }
        });
    var descriptionText = data.description == null ? "" : data.description;
    var description = createDescription(descriptionText);
    $("#user-description").append(description);

    $("#email").val(data.email);
    $("#hiddenEmail").val(data.email);
    $("#txtAddress").val(data.address);
    $("#hiddenAddress").val(data.address);

    $("#gender option[data-value=" + data.gender + "]").attr("selected", "selected");
    if (username == userNameLocalStorage) {//chinh chủ
        $(".edit-profile").css("display", "inline-table");
    } else {

        $(".edit-profile").css("display", "none");
        $(".read").attr("readonly", "readonly");
    }
};

function initMap() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('txtAddress');
    var searchBox = new google.maps.places.SearchBox(input);
};