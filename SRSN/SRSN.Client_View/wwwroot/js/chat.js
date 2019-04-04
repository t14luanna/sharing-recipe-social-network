//----------------------------------Initialization----------------------------------
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
firebase.auth().signInAnonymously();
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
var user
let chats = []
let userPopular = []
let current_chat_id

const message_list = $('.topic--replies.chat-list > .nav')[0];
const search_list = $('.topic--replies.search-list > .nav')[0];
const search_bar = $('.search-bar')[0];
const message_content = $('.msg-list')[0];
const message_user_title = $('.name-header-mesgs')[0];
const send_btn = $('.msg_send_btn')[0];
const message_input = $('.write_msg')[0];
const message_typing = $('.msg-typing')[0];

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

//Search User
let findUser = (username) => {
    return new Promise((resolve, reject) => {
        callAPI(`${BASE_API_URL}/${ACCOUNT_API_URL}/find-user?name=${username}`)
            .then((data) => {
                return resolve(data)
            })
    })
}
//----------------------------------------------------------------------------------

//------------------------------------CALL FIREBASE API-----------------------------
let listener = (id) => {
    db.collection("chats").where('users_id', 'array-contains', id).onSnapshot({ includeMetadataChanges: true },
        (snapshot) => {
            snapshot.docChanges().forEach(function (change) {
                let data = change.doc.data();

                if (change.type === "modified" && !change.doc.metadata.hasPendingWrites) {
                    let chat = findChatById(change.doc.id)
                    if (chat) {
                        let oppositeUser = chat.data.users[chat.oppositeUser]
                        getUserMessage(change.doc.id).then(messages => {
                            if (chat.messages.length < messages.length) {
                                if (current_chat_id === change.doc.id) {
                                    for (i = chat.messages.length; i < messages.length; i++) {
                                        appendMessage(messages[i], oppositeUser)
                                    }
                                }
                                $('#' + change.doc.id + ' .date').text(convertTimestampToDate(messages[messages.length - 1].createdAt.seconds))

                                let last_message
                                if (messages[messages.length - 1].userSent === user.id) {
                                    last_message = 'Bạn : ' + messages[messages.length - 1].content
                                } else {
                                    last_message = messages[messages.length - 1].content
                                }

                                $('#' + change.doc.id + ' .chat-message-wrap').text(last_message)
                                $('#' + change.doc.id).addClass('not-seen')
                                chat.messages = messages
                            }
                        })

                        if (data.users[chat.oppositeUser].isTyping !== oppositeUser.isTyping) {
                            chat.data = data;
                            console.log(data.users[chat.oppositeUser].isTyping)
                            if (data.users[chat.oppositeUser].isTyping) {
                                $(message_typing).css('display', 'block');
                            } else {
                                $(message_typing).css('display', 'none');
                            }
                        }
                    }
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
        db.collection("chats").doc(id).collection('messages').orderBy('createdAt').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                messages.push(doc.data());
            });
            return resolve(messages);
        }).catch((e) => {
            return reject(e);
        });
    });
}

let getUserChatList = (id) => {
    db.collection("chats").where('users_id', 'array-contains', id).get().then(async (querySnapshot) => {
        let count = 0
        await querySnapshot.forEach((doc) => {
            let chat = {
                id: doc.id,
                data: doc.data()
            };
            getUserMessage(chat.id).then(messages => {
                chat.messages = messages
                getOppositeUserPos(chat.data.users, id).then(pos => {
                    count++
                    chat.oppositeUser = pos
                    chats.push(chat)
                    if (chat.messages.length >= 0) {
                        let active = (count === querySnapshot.size ? true : false)
                        $(message_list).prepend(createChatUI(chat, active))
                        if (active) {
                            current_chat_id = chat.id
                            showMessageContent(chat.id)
                        }
                    }
                })
            })
        });
    });
}

let sendMessage = (messageText) => {
    // Add a new message entry to the Firebase database.
    let chat = findChatById(current_chat_id)
    let users = chat.data.users
    users[chat.oppositeUser].isSeen = false
    db.collection('chats').doc(current_chat_id).update({
        users: users,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    return db.collection('chats').doc(current_chat_id).collection('messages').add(
        {
            userSent: user.id,
            content: messageText,
            isOppositeSeen: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function (docRef) {
        })
        .catch(function (error) {
        })
}

let checkExistChat = (user_id) => {
    return new Promise(async (resolve, reject) => {
        await $(chats).each(async (i, chat) => {
            if (chat.data.users[chat.oppositeUser].user_id === user_id) {
                resolve(chat.id)
            }
        });
        return resolve(null);
    });
}

let createChat = (oppositeUser) => {
    checkExistChat(oppositeUser.id).then(res => {
        if (res === null) {
            // Add a new message entry to the Firebase database.
            db.collection('chats').add(
                {
                    users: [
                        {
                            user_id: user.id,
                            user_image: user.avatarImageUrl,
                            user_name: user.firstName + ' ' + user.lastName,
                            isTyping: false,
                            isSeen: true
                        },
                        {
                            user_id: oppositeUser.id,
                            user_image: oppositeUser.avatarImageUrl,
                            user_name: oppositeUser.firstName + ' ' + oppositeUser.lastName,
                            isTyping: false,
                            isSeen: true
                        }
                    ],
                    users_id: [
                        user.id,
                        oppositeUser.id
                    ],
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

                        getOppositeUserPos(chat.data.users, user.id).then(pos => {
                            chat.oppositeUser = pos
                            chat.messages = []
                            chats.unshift(chat)
                            let active = true
                            $(message_list).prepend(createChatUI(chat, active))
                            if (active) {
                                current_chat_id = chat.id
                                showMessageContent(chat.id)
                            }
                        })
                    })
                })
                .catch(function (error) {
                });
        } else {
            $('#' + current_chat_id).removeClass('active');
            $('#' + res).addClass('active');
            let title = $('#' + res + ' .name-user').text()
            $(message_user_title).text(title)
            $(message_typing).text(title + ' is typing....')
            showMessageContent(res);
        }
    })
}

let seenAction = (chat) => {
    let users = chat.data.users
    let current_user_pos = chat.oppositeUser === 0 ? 1 : 0
    console.log(users[current_user_pos].isSeen)
    if (!users[current_user_pos].isSeen) {
        $('#' + chat.id).removeClass('not-seen')
        users[current_user_pos].isSeen = true
        db.collection('chats').doc(chat.id).update({
            users: users,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }
}
//----------------------------------------------------------------------------------

//---------------------------------------CHAT ACTION--------------------------------
let findChatById = (id) => {
    return chats.find((chat) => { return chat.id === id })
}

let getCurrentChatId = () => {

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
        '<p><a href="#" class="name-user">' + user.firstName + ' ' + user.lastName + '</a></p></div></div></div></div>';

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
}

let showMessageContent = (id) => {
    let chat = findChatById(id)
    let messages = chat.messages;
    let opposite_user = chat.data.users[chat.oppositeUser];

    $(message_content).empty()
    $(message_user_title).text(opposite_user.user_name)
    $(message_typing).text(opposite_user.user_name + ' is typing')


    $(messages).each((i, mess) => {
        appendMessage(mess, opposite_user);
    });
    $(message_content).scrollTop($(message_content).height() + 10000)
   
};

let appendMessage = (message, opposite_user) => {
    let date = '';
    let user_message_item = '<div class="incoming_msg"><div class="incoming_msg_img" >' +
        '<img class="receiver-avatar" src="' + opposite_user.user_image + '" alt="sunil"></div>' +
        '<div class="received_msg"><div class="received_withd_msg"><p>' + message.content + '</p>' +
        '<span class="time_date">' + date + '</span></div></div></div >';

    if (message.userSent === user.id) {
        user_message_item = '<div class="outgoing_msg"><div class="sent_msg">' +
            '<p>' + message.content + '</p><span class="time_date">' + date + '</span></div></div>';
    }

    message_content.innerHTML += user_message_item;
};
//----------------------------------------------------------------------------------

//Convert Timestamp to Date
convertTimestampToDate = (unixtimestamp) => {

    if (!unixtimestamp) return '';

    // Months array
    var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Convert timestamp to milliseconds
    var date = new Date(unixtimestamp * 1000);

    // Year
    var year = date.getFullYear();

    // Month
    var month = months_arr[date.getMonth()];

    // Day
    var day = date.getDate();

    // Hours
    var hours = date.getHours();

    // Minutes
    var minutes = "0" + date.getMinutes();

    // Seconds
    var seconds = "0" + date.getSeconds();

    // Display date time in MM-dd-yyyy h:m:s format
    var results = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return results;
}

$(document).ready((e) => {
    getUserInfo().then(data => {
        user = data
        listener(user.id)
        getUserChatList(user.id)
        console.log('User :', user)
        getPopular().then(data => {
            userPopular = data
            createSearchListUI(search_list, data, user.id)
            console.log('Popular: ', data)
        });
    });
})