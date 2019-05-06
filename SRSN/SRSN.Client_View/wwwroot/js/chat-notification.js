let db = firebase.firestore();
var user
let chats = []
let userPopular = []
let users = []
const message_noti = $('#number-of-message-notification')
let current_not_seen = 0
let chat_not_seen = []

//API
let callAPI = (url, options) => {
    return new Promise((resolve, reject) => {
        fetch(url, options).then((res) => {
            return resolve(res.json());
        })
    })
}

let getInfo = () => {
    return new Promise((resolve, reject) => {
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

let getChats = (id) => {
    return new Promise((resolve, reject) => {
        db.collection("chats").where('usersId', 'array-contains', id).orderBy('updatedAt', 'desc').get().then(async (querySnapshot) => {
            let count = 0
            await querySnapshot.forEach(async (doc) => {
                let chat = {
                    id: doc.id,
                    data: doc.data()
                }

                let list = getOppositeUser(chat.data.usersId, id)
                chat.data.oppositeUser = list
                chats.push(chat)

                if (!checkIsSeen(chat)) {
                    chat_not_seen.push(chat.id)
                    count++
                }
            });
            return resolve(count)
        });
    })
}

let listener = (id) => {
    db.collection("chats").where('usersId', 'array-contains', id).onSnapshot({ includeMetadataChanges: true },
        async (snapshot) => {
            await snapshot.docChanges().forEach(function (change) {
                let data = change.doc.data();

                if (change.type === "modified" && !change.doc.metadata.hasPendingWrites) {
                    let chat = {
                        id: change.doc.id,
                        data: change.doc.data()
                    }

                    let list = getOppositeUser(chat.data.usersId, id)
                    chat.data.oppositeUser = list

                    if (!checkIsSeen(chat) && chat_not_seen.id != chat.id) {
                        current_not_seen++
                        chat_not_seen.push(chat.id)
                        $(message_noti).text(current_not_seen)
                    } else if (chat_not_seen.indexOf(chat.id) > -1) {
                        current_not_seen--
                        if (current_not_seen > 0) {
                            $(message_noti).text(current_not_seen)
                        } else {
                            $(message_noti).text('')
                        }
                    }
                }
                var source = change.doc.metadata.hasPendingWrites ? "local cache" : "server";
                console.log("Data came from " + source);
                console.log(change.type);
            });
        });
}

let checkIsSeen = (chat) => {
    let u = chat.data.users.find((item) => {
        return item.id = user.id
    })
    console.log(chat)
    return u.isSeen
}

let getOppositeUser = (users, id) => {
    let arr = users.slice(0);
    arr.splice(users.indexOf(id), 1)
    return arr
}

$(document).ready((e) => {
    getInfo().then(data => {
        user = data
        console.log('User :', user)
        getChats(user.id).then((data) => {
            current_not_seen = data
            if (current_not_seen > 0) {
                $(message_noti).text(data)
            }
            listener(user.id)
            //listener(user.id)
            //getUserList(data).then((list) => {
            //    users = list
            //    console.log('User List :', list)
            //    createChatListUI(chats)
            //})
        })
    });
})