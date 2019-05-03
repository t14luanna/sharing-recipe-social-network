//----------------------------------Initialization----------------------------------
let db = firebase.firestore();
var user
let chats = []
let userPopular = []
let users = []
let current_messages = []

//----------------------------------------------------------------------------------


//------------------------------------CALL API--------------------------------------
//API
let callAPI = (url, options) => {
    return new Promise((resolve, reject) => {
        fetch(url, options).then((res) => {
            return resolve(res.json());
        })
    })
}

//Get Top User for new chat
let getPopular = () => {
    return new Promise((resolve, reject) => {
        callAPI(`${BASE_API_URL}/${ACCOUNT_API_URL}/get-top-ten`)
            .then((data) => {
                return resolve(data)
            }).catch((err) => {
                return reject(err)
            })
    })
}

//Get User by LocalStorage
let getUserInfo = () => {
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

//Search User
let findUser = (username) => {
    return new Promise((resolve, reject) => {
        callAPI(`${BASE_API_URL}/${ACCOUNT_API_URL}/find-user?name=${username}`)
            .then((data) => {
                return resolve(data)
            })
    })
}

let getUserList = (list) => {
    console.log(list)
    return new Promise((resolve, reject) => {
        callAPI(`${BASE_API_URL}/${ACCOUNT_API_URL}/read-user-list`, {
            method: 'POST',
            body: JSON.stringify(list),
            headers: {
                'content-type': 'application/json',
            }
        })
        .then((data) => {
            return resolve(data)
        })
    })
}
//----------------------------------------------------------------------------------

//------------------------------------CALL FIREBASE API-----------------------------
let listener = (id) => {
    db.collection("chats").where('usersId', 'array-contains', id).onSnapshot({ includeMetadataChanges: true },
        (snapshot) => {
            snapshot.docChanges().forEach(function (change) {
                let data = change.doc.data();

                if (change.type === "modified" && !change.doc.metadata.hasPendingWrites) {
                    getUserMessage(change.doc.id).then(async messages => {
                        let chat = findChatById(change.doc.id)
                        if (chat) {
                            let oppositeUser = findUserById(getOppositeUser(chat.data.usersId, user.id)[0])
                            if (chat.updatedAt !== data.updatedAt) {
                                updateChatUI({
                                    id: change.doc.id,
                                    data: data
                                })
                                chat.data.updatedAt = data.updatedAt
                                chat.data.users = data.users
                            }
                        
                            if (current_chat_id === change.doc.id && current_messages.length < messages.length) {
                                if ($('#' + chat.id).length) {
                                    for (i = current_messages.length; i < messages.length; i++) {
                                        appendMessage(messages[i], oppositeUser)
                                    }
                                    current_messages = messages                                    
                                } else {
                                    if (messages.length > 0) {
                                        $(chat_list).prepend(createChatUI(chat, false))
                                    }
                                }
                            }

                            //if (data.users[chat.oppositeUser].isTyping !== oppositeUser.isTyping) {
                            //    chat.data = data;
                            //    console.log(data.users[chat.oppositeUser].isTyping)
                            //    if (data.users[chat.oppositeUser].isTyping) {
                            //        $(message_typing).css('display', 'block');
                            //    } else {
                            //        $(message_typing).css('display', 'none');
                            //    }
                            //}
                        } else {
                                let chat = {
                                    id: change.doc.id,
                                    data: change.doc.data()
                                }
                                chat.data.oppositeUser = await getOppositeUser(chat.data.usersId, user.id)
                                chats.push(chat)
                                getUserList(chat.data.oppositeUser).then(res => {
                                    users = users.concat(res)
                                    if (messages.length > 0) {
                                        $(chat_list).prepend(createChatUI(chat, false))
                                    }
                                })
                            }
                        })
                }

                var source = change.doc.metadata.hasPendingWrites ? "local cache" : "server";
                console.log("Data came from " + source);
                console.log(change.type);
            });
        });
}

let getUserMessage = (id) => {
    return new Promise((resolve, reject) => {
        let messages = [];
        db.collection("chats").doc(id).collection('messages').orderBy('createdAt').get().then(async (querySnapshot) => {
            await querySnapshot.forEach(function (doc) {
                messages.push(doc.data());
            });
            return resolve(messages);
        }).catch((e) => {
            return reject(e);
        });
    });
}

let getUserChatList = (id) => {
    return new Promise((resolve, reject) => {
        db.collection("chats").where('usersId', 'array-contains', id).orderBy('updatedAt','desc').get().then(async (querySnapshot) => {
            await querySnapshot.forEach(async (doc) => {
                let chat = {
                    id: doc.id,
                    data: doc.data()
                }

                let list = getOppositeUser(chat.data.usersId, id)
                chat.data.oppositeUser = list
                chats.push(chat)

                await $(list).each((i, user_id) => {
                    let res = users.find(item => { return item === id })
                    if (res === undefined) {
                        users.push(user_id)
                    }
                })
            });
            return resolve(users)
        });
    })
}

let sendMessage = async (messageText) => {
    // Add a new message entry to the Firebase database.
    let chat = findChatById(current_chat_id)
    let users = chat.data.users

    await $(chat.data.oppositeUser).each((i, item) => {
        findUserElement(users, item).isSeen = false
    })

    findUserElement(users, user.id).isSeen = true

    db.collection('chats').doc(current_chat_id).update({
        users: users,
        lastMessage: messageText,
        lastUserSentMessage: user.id,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    return db.collection('chats').doc(current_chat_id).collection('messages').add(
        {
            userSent: user.id,
            content: messageText,
            isSeen: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function (docRef) {
        })
        .catch(function (error) {
        })
}   

let checkExistChat = (user_id) => {
    return new Promise(async (resolve, reject) => {
        db.collection("chats").where('usersId', 'array-contains', user.id).get().then(async (querySnapshot) => {
            await querySnapshot.forEach(async (doc) => {
                let list = getOppositeUser(doc.data().usersId, user.id)

                let chat = {
                    id: doc.id,
                    data: doc.data(),
                    messages: [],
                }

                chat.data.oppositeUser = list

                if (list.indexOf(user_id) > -1) {
                    return resolve(chat);
                }
            })
            return resolve(null)
        });
    });
}

let createChat = (oppositeUserId) => {
    checkExistChat(oppositeUserId).then(res => {
        if (res === null) {
            // Add a new message entry to the Firebase database.
            db.collection('chats').add(
                {
                    usersId: [
                        user.id,
                        oppositeUserId
                    ],
                    users: [
                        {
                            id: user.id,
                            isTyping: false,
                            isSeen: true
                        },
                        {
                            id: oppositeUserId,
                            isTyping: false,
                            isSeen: true
                        }
                    ],
                    lastMessage: '',
                    lastUserSentMessage: null,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function (docRef) {
                    docRef.get().then(doc => {
                        let chat = {
                            id: doc.id,
                            data: doc.data()
                        };
                        if (current_chat_id) {
                            $('#' + current_chat_id).removeClass('active');
                        }

                        let list = getOppositeUser(chat.data.usersId, user.id)
                        chat.data.oppositeUser = list
                        chat.messages = []
                        chats.unshift(chat)
                        $(chat_list).prepend(createChatUI(chat))
                        activeAction(chat.id)
                    })
                })
                .catch(function (error) {
                });
        } else {
            if (findChatById(res.id) === undefined) {
                chats.push(res)
            }
            if ($('#' + res.id).length) {
                activeAction(res.id)
            } else {
                $(chat_list).prepend(createChatUI(res, true))
                activeAction(res.id)
            }
        }
    })
}
//----------------------------------------------------------------------------------

//---------------------------------------CHAT ACTION--------------------------------
let findChatById = (id) => {
    return chats.find((chat) => { return chat.id === id })
}

let findUserById = (id) => {
    let res = users.find(item => { return item.id === id }) || userPopular.find(item => { return item.id === id })
    return res
}

let getOppositeUser = (users, id) => {
    let arr = users.slice(0);
    arr.splice(users.indexOf(id), 1)
    return arr
}

$(search_bar).focusin(() => {
    $(search_list).css('display', 'block');
    $(message_list).css('display', 'none');
});

$(search_bar).focusout(() => {
    $(search_list).css('display', 'none');
    $(message_list).css('display', 'block');
    $(search_bar).val('');
});

$(search_bar).keydown(() => {
    let search_val = $(search_bar).val();
    if (search_val.length > 1) {
        findUser(search_val).then(res => {
            createSearchListUI(search_list, res)
        }).catch(e => {

        })
    } else {
        createSearchListUI(search_list, userPopular)
    }
});

$(send_btn).on('click', () => {
    sendMessage($(message_input).val());
    $(message_input).val('');
});

$(message_input).keydown(async () => {
    let text = $(message_input).val();
    let chat = findChatById(current_chat_id)
    let current_user_pos = chat.oppositeUser === 0 ? 1 : 0
    let current_user = chat.data.users[current_user_pos]
    if (!current_user.isTyping && text.length > 3) {
        chat.data.users[current_user_pos].isTyping = true;
        db.collection('chats').doc(current_chat_id).update({
            users: chat.data.users
        })
    } else if (current_user.isTyping && text.length <= 3) {
        chat.data.users[current_user_pos].isTyping = false;        
        db.collection('chats').doc(current_chat_id).update({
            users: chat.data.users
        })
    }

    seenAction(chat)
})
//----------------------------------------------------------------------------------

//-----------------------------------------CHAT UI----------------------------------
let pushChatToTop = (id) => {
    
}

let createSearchListUI = (block, user_list) => {
    $(block).empty()
    $(user_list).each(async (i, user_search) => {
        if (user.id === user_search.id) return;
        await $(block).prepend(createSearchUI(user_search))
    })
}

let createSearchUI = (user) => {
    let user_chat_item = document.createElement('li')
    $(user_chat_item).attr('id', user.id)

    user_chat_item.innerHTML += '<div class="topic--reply"><div class="clearfix">' +
        '</div><div class="body clearfix"><div class="author mr--20 float--left text-center">' +
        '<div class="avatar" data-overlay="0.3" data-overlay-color="primary">' +
        '<a><img src="' + user.avatarImageUrl + '" alt=""></a></div></div>' +
        '<div class="content fs--14 ov--h"><div class="name text-darkest">' +
        '<p><a href="#" class="name-user">' + user.lastName + ' ' + user.firstName + '</a></p></div></div></div></div>';

    $(user_chat_item).on('mousedown', () => {
        createChat(user);
    });

    return user_chat_item;
}

let createChatUI = (chat, active) => {
    let user_chat_item = document.createElement('li')
    $(user_chat_item).attr('id', chat.id)

    let opposite_pos = chat.oppositeUser
    let opposite_user = chat.data.users[opposite_pos]
    let current_user_pos = chat.oppositeUser === 0 ? 1 : 0
    let current_user = chat.data.users[current_user_pos]

    if (active) {
        $(user_chat_item).addClass('active')
    }

    if (!current_user.isSeen) {
        $(user_chat_item).addClass('not-seen')
    }

    let messages = chat.messages
    let last_mess_content
    let last_mess_time

    if (messages.length > 0) {
        if (messages[messages.length - 1].userSent === user.id) {
            last_mess_content = 'Bạn : ' + messages[messages.length - 1].content
        } else {
            last_mess_content = messages[messages.length - 1].content
        }
        last_mess_time = convertTimestampToDate(messages[messages.length - 1].createdAt.seconds);
    }

    user_chat_item.innerHTML += '<div class="topic--reply"><div class="clearfix"><p class="date float--right">'
        + (last_mess_time ? last_mess_time : "") + '</p></div><div class="body clearfix"><div class="author mr--20 float--left text-center">' +
        '<div class="avatar" data-overlay="0.3" data-overlay-color="primary">' +
        '<a><img src="' + opposite_user.user_image + '" alt=""></a></div></div>' +
        '<div class="content fs--14 ov--h"><div class="name text-darkest">' +
        '<p><a href="#" class="name-user">' + opposite_user.user_name + '</a></p></div></div>' +
        '<div class="content fs--14 ov--h">' +
        '<p class="chat-message-wrap">' + (last_mess_content ? last_mess_content : "") + '</p>' +
        '</div></div></div>';

    $(user_chat_item).on('click', () => {
        $('#' + current_chat_id).removeClass('active');
        $(user_chat_item).addClass('active');
        current_chat_id = chat.id
        seenAction(chat)
        $(message_user_title).text(chat.data.users[chat.oppositeUser].user_name)
        $(message_typing).text(chat.data.users[chat.oppositeUser].user_name + ' is typing....')
        showMessageContent(chat.id);
    });

    return user_chat_item;
//>>>>>>> 9a01158e02cf3f8dc8c9f7aa7edb5a72c4ea992a
}

//----------------------------------------------------------------------------------

findUserElement = (list, id) => {
    return list.find(item => { return item.id === id })
}

$(document).ready((e) => {
    getUserInfo().then(data => {
        user = data
        console.log('User :', user)
        getUserChatList(user.id).then((data) => {
            listener(user.id)
            getUserList(data).then((list) => {
                users = list
                console.log('User List :', list)
                createChatListUI(chats)
            })
        })
        getPopular().then(data => {
            userPopular = data
            createSearchListUI(search_list, data, user.id)
            console.log('Popular: ', data)
        });
    });
})