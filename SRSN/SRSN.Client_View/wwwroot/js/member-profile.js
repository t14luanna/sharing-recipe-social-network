
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAD2Vqg-rHzg9WJee0Yh0VGH_i_5BQT61E",
    authDomain: "srsnproject.firebaseapp.com",
    databaseURL: "https://srsnproject.firebaseio.com",
    projectId: "srsnproject",
    storageBucket: "srsnproject.appspot.com",
    messagingSenderId: "237911674213"
};
firebase.initializeApp(config);
var username = window.localStorage.getItem("username");
var myDataRef = firebase.database().ref(username);
// Đừng xóa cái này nhé, nó dùng để push data lên firebase.
//myDataRef.push({
//    "1": "121",
//    "2": "28/2/2019"
//});
myDataRef.on('child_changed', function (snapshot) {
    var text = "";
    snapshot.forEach(function (childSnapshot) {
        //var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        text += childData + "<br/>";
    });
    displayNotifi(text);
});

myDataRef.on('child_added', function (snapshot) {
    var text = "";
    snapshot.forEach(function (childSnapshot) {
        //var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        text += childData + "<br/>";
    });
    displayNotifi(text);
});

const createSingleNotification = (name) =>
    `<li ><a href="#">${name}</a></li>`;
function displayNotifi(name) {
    let element = createSingleNotification(name);
    $("#list-notifi").prepend(element);
};




const createAvatarContainer = (user) =>
    `<div class="cover--avatar online" data-overlay="0.3" data-overlay-color="primary">
                                <img src="${user.avatarImageUrl}" alt="">
                            </div>

                            <div class="cover--user-name">
                                <h2 class="h3 fw--600">${user.lastName} ${user.firstName}</h2>
                            </div>
                            <div class="mem-statis-box">
                                <div>
                                    <span class="headline">Newbee</span>

                                    <div class="val">
                                        <span class="newbee" id="ranknewbee"></span>
                                        <span class="tastee" id="ranktastee"></span>
                                        <span class="cookee" id="rankcookee"></span>
                                        <span class="chefee" id="rankchefee"></span>
                                        <span class="mastee" id="rankmastee"></span>
                                    </div>
                                    <div class="text">
                                        <span class="user-lvl newbee"> newbee</span>
                                        <span class="user-lvl tastee"> tastee</span>
                                        <span class="user-lvl cookee"> cookee</span>
                                        <span class="user-lvl chefee"> chefee</span>
                                        <span class="user-lvl mastee"> mastee</span>

                                    </div>
                                </div>
                            </div>
                            <div class="cover--user-desc fw--400 fs--18 fstyle--i text-darkest">
                                <p>${user.description}</p>
                            </div>`;
const createPersonalInfoElement = (info) =>
    `<table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Tên</th>
                                                                <td><input type="text" value="${info.firstName}"></td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Họ</th>
                                                                <td>
                                                                    <input type="text" value="${info.lastName}">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Giới tính</th>
                                                                <td>
                                                                    <select id="myselect">
                                                                        <option value="1" data-value="1">Nam</option>
                                                                        <option value="2" data-value="2">Nữ</option>
                                                                        <option value="3" data-value="3">Khác</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Ngày sinh</th>
                                                                <td><input type="date" name="bday" value="${ new Date(info.createTime).getFullYear() + "-" +
                                                                                                                new Date(info.createTime).getMonth() + "/" + new Date(info.createTime).getDay()}"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>`;

const createDescription = (des) =>
    `<textarea name="Text1" cols="90" rows="5" > ${des}</textarea >`;
const createContactInfo = (user) =>
    `<table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">Điện thoại</th>
                                                                <td>
                                                                    <input type="text" value="${user.phone}" style="width: 200px;">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th class="fw--700 text-darkest">E-mail</th>
                                                                <td>
                                                                    <input type="text" value="${user.email}" style="width: 300px;">
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th class="fw--700 text-darkest">Địa chỉ</th>
                                                                <td>
                                                                    <input type="text" value="${user.address}" style="width: 500px;">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>`;
const callAccountInforApi = async () => {
    var authorization = localStorage.getItem("authorization");
    var token = (JSON.parse(authorization))["token"];
    var res = await fetch("https://localhost:44361/api/account/read-userinfo", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    });


    var data = await res.json();
    var element = createAvatarContainer(data);
    $("#avatar-container").append(element);

    var personalInfo = createPersonalInfoElement(data);
    $("#personal-info").append(personalInfo);

    var description = createDescription(data.description);
    $("#user-description").append(description);

    var contact = createContactInfo(data);
    $("#user-contact").append(contact);

    $("#myselect option[data-value='" + data.gender + "']").attr("selected", "selected");
    if (data.point >= 0 && data.point <= 99) {
        $("#ranknewbee").attr("class", "newbee active");
    } else if (data.point >= 100 && data.point <= 499) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
    } else if (data.point >= 500 && data.point <= 999) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
    } else if (data.point >= 1000 && data.point <= 4999) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $("#rankchefee").attr("class", "chefee active");
    } else if (data.point >= 5000) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $("#rankchefee").attr("class", "chefee active");
        $("#rankmastee").attr("class", "mastee active");
    }
};
