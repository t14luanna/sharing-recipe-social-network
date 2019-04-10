let config = {
    apiKey: "AIzaSyCDGlhTCqi5fJMRnR3h-EXyTL_n1LEc6ws",
    authDomain: "srsn-b8ff2.firebaseapp.com",
    databaseURL: "https://srsn-b8ff2.firebaseio.com/",
    projectId: "srsn-b8ff2",
    storageBucket: "srsn-b8ff2.appspot.com",
    messagingSenderId: "AIzaSyDIdwkwxOp4FJ3sOiYYZonBgoxJ74nY1FI",
};
firebase.initializeApp(config);

//Sign-in with Anonymous account
let user = firebase.auth().signInAnonymously();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let isAnonymous = user.isAnonymous;
        //user_id = user.uid;
    } else {
        // User is signed out.
    }
});

let db = firebase.firestore();
let chats = []
let current_not_seen = 0

const message_noti = $('#number-of-message-notification')

let callAPI = (url, options) => {
    return new Promise((resolve, reject) => {
        fetch(url, options).then((res) => {
            return resolve(res.json());
        })
    })
}

let getUserInfo = () => {
    return new Promise((resolve, reject) => {
        let userNameLocalStorage = localStorage.getItem("username");
        let authorization = localStorage.getItem("authorization");
        let token = (JSON.parse(authorization))["token"];
        callAPI(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-userinfo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((data) => {
            return resolve(data);
        }).catch((err) => {
            return reject(err)
        })
    })
}

let getOppositeUserPos = (users, id) => {
    return new Promise((resolve, reject) => {
        $(users).each((i, user) => {
            if (user.user_id !== id) {
                return resolve(i)
            }
        });
    })
}


let getUserChatList = (id) => {
    db.collection("chats").where('users_id', 'array-contains', id).get().then(async (querySnapshot) => {
        let count = 0
        await querySnapshot.forEach((doc) => {
            let chat = {
                id: doc.id,
                data: doc.data()
            };
            getOppositeUserPos(chat.data.users, id).then(pos => {
                chat.oppositeUser = pos
                chats.push(chat)
                let current_user = chat.data.users[pos === 0 ? 1 : 0]
                if (!current_user.isSeen) {
                    count++
                }
            })
        });
        current_not_seen = count
        $(message_noti).text(current_not_seen)
    });
}

let findChatById = (id) => {
    return chats.find((chat) => { return chat.id === id })
}


let listener = (id) => {
    db.collection("chats").where('users_id', 'array-contains', id).onSnapshot({ includeMetadataChanges: true },
        (snapshot) => {
            snapshot.docChanges().forEach(function (change) {
                let data = change.doc.data();

                if (change.type === "modified" && !change.doc.metadata.hasPendingWrites) {
                    let chat = findChatById(change.doc.id)
                    chats.push(chat)
                    if (chat) {
                        let current_user = chat.data.users[chat.oppositeUser === 0 ? 1 : 0]
                        console.log(current_user.isSeen)
                        if (data.users[chat.oppositeUser === 0 ? 1 : 0].isSeen !== current_user.isSeen && !data.users[chat.oppositeUser === 0 ? 1 : 0].isSeen) {
                            current_not_seen++
                        }
                    } else {
                        current_not_seen++
                    }
                    chat.data.users = data.users
                    $(message_noti).text(current_not_seen)
                }

                var source = change.doc.metadata.hasPendingWrites ? "local cache" : "server";
                console.log("Data came from " + source);
                console.log(change.type);
            });
        });
}

$(document).ready(() => {
    getUserInfo().then(data => {
        user = data
        listener(user.id)
        getUserChatList(user.id)
        console.log('User :', user)
    });
})