

const createPersonalInfoElement = (info) =>
    `<table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Tên</th>
                                                                <td><input type="text" value="${info.firstName}" class="read"></td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Họ</th>
                                                                <td>
                                                                    <input type="text" value="${info.lastName}" class="read">
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
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Ngày sinh</th>
                                                                <td><input type="date" name="bday" value="${ new Date(info.createTime).getFullYear() + "-" +
                                                                        new Date(info.createTime).getMonth() + "/" + new Date(info.createTime).getDay()}" class="read" ></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>`;

const createDescription = (des) =>
    `<textarea name="Text1" cols="90" rows="5" class="read"> ${des}</textarea >`;
const createContactInfo = (user) =>
    `<table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Điện thoại</th>
                                                                <td>
                                                                    <input type="text" value="${user.phone}" style="width: 200px;" class="read">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">E-mail</th>
                                                                <td>
                                                                    <input type="text" value="${user.email}" style="width: 300px;" class="read">
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th class="fw--700 text-darkest">Địa chỉ</th>
                                                                <td>
                                                                    <input type="text" value="${user.address}" style="width: 500px;" class="read">
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
