
const createAvatarContainer = (user) =>
    `<div class="cover--avatar online" data-overlay="0.3" data-overlay-color="primary">
                                <img src="${user.avatarImageUrl}" alt=""/>
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


const loadAvatarContainer = async (username) => {
    $("#link-to-profile").attr("href", "/account/information/" + username);
    $("#link-to-following-user").attr("href", "/account/memberfriends/" + username);
    var userNameLocalStorage = localStorage.getItem("username");
    var res;
    var data;
    if (username == userNameLocalStorage) {
        var authorization = localStorage.getItem("authorization");
        var token = (JSON.parse(authorization))["token"];
        res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-userinfo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        data = await res.json();
    } else {
        res = await fetch(`https://localhost:44361/api/account/read-username?userName=${username}`); /* tim theo user name*/
        data = await res.json();//do 2 cach trả về giá trị khác nhau, data[0] là vị trí đầu tiên trong chuổi json
        data = data[0];
    }
 
    var element = createAvatarContainer(data);
    $("#avatar-container").append(element);

    
    if (data.point >= 0 && data.point <= 99) {
        $("#ranknewbee").attr("class", "newbee active");
    } else if (data.point >= 100 && data.point <= 499) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $(".headline").text("Tastee").css("color","#ffc107");
    } else if (data.point >= 500 && data.point <= 999) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $(".headline").text("Cookee").css("color","#ff4f4f");

    } else if (data.point >= 1000 && data.point <= 4999) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $("#rankchefee").attr("class", "chefee active");
        $(".headline").text("Chefee").css("color","#a930ca");

    } else if (data.point >= 5000) {
        $("#ranknewbee").attr("class", "newbee active");
        $("#ranktastee").attr("class", "tastee active");
        $("#rankcookee").attr("class", "cookee active");
        $("#rankchefee").attr("class", "chefee active");
        $("#rankmastee").attr("class", "mastee active");
        $(".headline").text("mastee").css("color","#ff0834");

    }

   
};
