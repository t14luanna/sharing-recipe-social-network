srsn = {} || srsn;
srsn.Utils = {} || srsn.Utils;

srsn.Utils = {
    GetCurrentLogin: function() {
        var localStorageUserLogin = localStorage.getItem("authorization");
        var result = JSON.parse(localStorageUserLogin);
        if (result == {}) {
            return null;
        }
        return result;
    },
    SetCurrentLogin: function (authorization, username="") {
        var result = JSON.stringify(authorization);
        localStorage.setItem("authorization", result);
        localStorage.setItem("username", username);
    },
    HandleResException: function (ex) {
        if (ex.status === 400) {
            localStorage.setItem("authorization", "");
            window.location.href = "/login";
        }
    }
};

