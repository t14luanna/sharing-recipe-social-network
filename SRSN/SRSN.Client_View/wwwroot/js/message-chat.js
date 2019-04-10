// Initialize Firebase
// TODO: Replace with your project's customized code snippet
let config = {
    apiKey: "AIzaSyCDGlhTCqi5fJMRnR3h-EXyTL_n1LEc6ws",
    authDomain: "srsn-b8ff2.firebaseapp.com",
    databaseURL: "https://srsn-b8ff2.firebaseio.com/",
    projectId: "srsn-b8ff2",
    storageBucket: "srsn-b8ff2.appspot.com",
    messagingSenderId: "AIzaSyDIdwkwxOp4FJ3sOiYYZonBgoxJ74nY1FI",
};
firebase.initializeApp(config);

//Variable
let user_id = (JSON.parse(localStorage.getItem("userId")));
let user_chat_list = [];
let user_list = [];
let db = firebase.firestore();
let current_chat;
let current_user;
let chatData = [];
let topUser;
let token;

//View
let message_list = $('.topic--replies.chat-list > .nav')[0];
let search_list = $('.topic--replies.search-list > .nav')[0];
let message_content = $('.msg-list')[0];
let message_user_title = $('.name-header-mesgs')[0];
let send_btn = $('.msg_send_btn')[0];
let search_bar = $('.search-bar')[0];
let message_input = $('.write_msg')[0];

$(send_btn).on('click', () => {
    sendMessage($(message_input).val());
    $(message_text).val('');
});

//Sign-in with Anonymous account
let user = firebase.auth().signInAnonymously();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        let isAnonymous = user.isAnonymous;
        //user_id = user.uid;
      } else {
        // User is signed out.
      }
    });

//-----------------------------User Chat Action-----------------------------------------
let sendMessage = (messageText) => {
    // Add a new message entry to the Firebase database.
    db.collection('chats').doc(current_chat.id).update({
        last_message: messageText,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    updateChatList(current_chat.id, {
        createdAt: (new Date()).getTime(),
        content: messageText
    });

    return db.collection('chats').doc(current_chat.id).collection('messages').add(
        {
            userSent: user_id,
            content: messageText,
            isOppositeSeen: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function (docRef) {
            appendMessage({
                createdAt: (new Date()).getTime(),
                content: messageText,
                userSent: user_id
            }, {});
        })
        .catch(function (error) {
        });
};

let checkExistChat = (user_id) => {
    return new Promise(async (resolve, reject) => {
        await $(chatData).each(async (i, item) => {
            let chat = item.data;
            await $(chat.users).each((i, user) => {
                if (user.user_id === user_id) {
                    return resolve(item.id);
                }
            });
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
                            user_id: user_id,
                            user_image: current_user.avatarImageUrl,
                            user_name: current_user.firstName + ' ' + current_user.lastName,
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
                        user_id,
                        oppositeUser.id
                    ],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    last_message: ''
                }).then(function (docRef) {
                    docRef.get().then(doc => {
                        let data = doc.data()
                        let id = doc.id
                        if (current_chat) {
                            $('#' + current_chat.id).removeClass('active');
                        }

                        chatData.unshift({
                            id: id,
                            data: data
                        });

                        showUserChat(chatData)
                    })
                })
                .catch(function (error) {
                });
        } else {
            $('#' + current_chat.id).removeClass('active');
            $('#' + res).addClass('active');
            let title = $('#' + res + ' .name-user').text()
            $(message_user_title).text(title)
            showMessageContent(res);
        }
    })    
}

//-----------------------------End User Chat Action-------------------------------------

//Convert Timestamp to Date
function convertTimestampToDate(unixtimestamp) {

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

//-----------------------------User Chat List-----------------------------------------
//Load user chat list
let readUserChatList = () => {
    return new Promise((resolve, reject) => {
        user_chat_list = [];
        db.collection("chats").where('users_id', 'array-contains', user_id).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                user_chat_list.push({ id: doc.id, data: doc.data() });
            });
            return resolve(user_chat_list);
        }).catch((e) => {
            return reject(e);
        });
    });
}

let createUserChatItem = async (item, active) => {
    let chat = item.data;
    let id = item.id;
    let opposite_user;
    await $(chat.users).each((i, user) => {
        if (user.user_id !== user_id) {
            opposite_user = user;
            return;
        }
    });

    if (active) {
        $(message_user_title).text(opposite_user.user_name);
    }

    let last_mess_content = chat.last_message;
    let last_mess_time = convertTimestampToDate(chat.updatedAt.seconds);

    let user_chat_item = '<li id="' + id + '" class="' + (active ? 'active' : '') + '">' +
        '<div class="topic--reply"><div class="clearfix"><p class="date float--right">' + last_mess_time +
        '</p></div><div class="body clearfix"><div class="author mr--20 float--left text-center">' +
        '<div class="avatar" data-overlay="0.3" data-overlay-color="primary">' +
        '<a><img src="' + opposite_user.user_image + '" alt=""></a></div></div>' +
        '<div class="content fs--14 ov--h"><div class="name text-darkest">' +
        '<p><a href="#" class="name-user">' + opposite_user.user_name + '</a></p></div></div>' +
        '<div class="content fs--14 ov--h">' +
        '<p class="chat-message-wrap">' + last_mess_content + '</p>' +
        '</div></div></div></li>';

    if (active) {
        showMessageContent(id);
    }
    
    return user_chat_item;
}

//Show user chat list
let showUserChat = async (data) => {
    await $(data).each(async (i, item) => {
        message_list.innerHTML = ''
        let active = false;
        if (i === 0) {
            active = true;
        }
        await createUserChatItem(item, active).then((res) => {
            message_list.innerHTML += res;            
        })

        $('#' + item.id).on('click', () => {
            $('#' + current_chat.id).removeClass('active');
            $('#' + chatData[i].id).addClass('active');
            let title = $('#' + chatData[i].id + ' .name-user').text()
            $(message_user_title).text(title)
            showMessageContent(chatData[i].id);
        });
    });
};

let showMessageContent = (id) => {
    findChatById(id).then(async (res) => {
        message_content.innerHTML = '';
        current_chat = res;        
        let messages = await loadMessages(id);
        let opposite_user;
        await $(res.data.users).each((i, user) => {
            if (user.user_id !== user_id) {
                opposite_user = user;
                current_chat['opposite_user'] = opposite_user;
                return;
            }
        });
        
        await $(messages).each((i, mess) => {
            appendMessage(mess, opposite_user);
        });
        $(message_content).scrollTop($(message_content).height() + 10000)
    });
};

let appendMessage = (message, opposite_user) => {
    let date = '';
    let user_message_item = '<div class="incoming_msg"><div class="incoming_msg_img" >' +
        '<img class="receiver-avatar" src="' + opposite_user.user_image + '" alt="sunil"></div>' +
        '<div class="received_msg"><div class="received_withd_msg"><p>' + message.content + '</p>' +
        '<span class="time_date">' + date + '</span></div></div></div >';

    if (message.userSent === user_id) {
        user_message_item = '<div class="outgoing_msg"><div class="sent_msg">' +
            '<p>' + message.content + '</p><span class="time_date">' + date + '</span></div></div>';
    }

    message_content.innerHTML += user_message_item;
};

let findChatById = (id) => {
    return new Promise((resolve, reject) => {
        $(chatData).each((i, item) => {
            if (item.id === id) return resolve(item);
        });
    })
}

let updateChatList = (id, message) => {
    //let date = message.createdAt.seconds != undefined ? convertTimestampToDate(message.createdAt) : convertTimestampToDate(message.createdAt.seconds);
    //$('#' + id + ' .date ').text(date);
    $('#' + id + ' .chat-message-wrap').text(message.content);
}

let pushToTop = (id) => {
    //let $(message_list).children('#' + id)
}

$(message_input).keydown(async () => {
    let text = $(message_input).val();
    let usersArr = current_chat.data.users;
    if (text.length > 3) {
        await $(usersArr).each((i, user) => {
            if (user.user_id === user_id) {
                usersArr[i].isTyping = true;
            }
        });
        db.collection('chats').doc(current_chat.id).update({
            users: usersArr
        })
    } else {
        await $(usersArr).each((i, user) => {
            if (user.user_id === user_id) {
                usersArr[i].isTyping = false;
            }
        });
        console.log(usersArr)
        db.collection('chats').doc(current_chat.id).update({
            users: usersArr
        })
    }
})
//-----------------------------End User Chat List--------------------------------------

//-----------------------------Search Bar----------------------------------------------
$(search_bar).focusin(() => {
    $(search_list).css('display', 'block');
    $(message_list).css('display', 'none');
    showSearchList(topUser);
});

$(search_bar).focusout(() => {

        $(search_list).css('display', 'none');
        $(message_list).css('display', 'block');
        $(search_bar).val('');

});

$(search_bar).keydown(() => {
    let search_val = $(search_bar).val();
    if (search_val.length > 1) {
        searchLikeUser(search_val).then(res => {
            showSearchList(res)
        }).catch(e => {

        })
    }
});

let showSearchList = async (list) => {
    search_list.innerHTML = '';
    await $(list).each((i, user) => {
        showSearchItem(user);
    });
    $(search_list).children('li').each((i, chat) => {
        $(chat).on('mousedown', () => {
            createChat(list[i]);
        });
    });
}

let showSearchItem = (user) => {
    let user_item = '<li id="' + user.id + '">' +
        '<div class="topic--reply">' +
        '<div class="body clearfix"><div class="author mr--20 float--left text-center">' +
        '<div class="avatar" data-overlay="0.3" data-overlay-color="primary">' +
        '<a><img src="' + user.avatarImageUrl + '" alt=""></a></div></div>' +
        '<div class="content fs--14 ov--h"><div class="name text-darkest">' +
        '<p><a href="member-activity-personal.html">' + user.firstName + ' ' + user.lastName + '</a></p></div></div>' +
        '</div></div></li>';
    search_list.innerHTML += user_item;
}
//-----------------------------End Search Bar------------------------------------------

//-----------------------------User List-----------------------------------------------
let getTopUser = async () => {
    let res = await fetch(`${BASE_API_URL}/api/account/get-top-ten`);
    let data = (await res.json());
    return data;
}

let searchLikeUser = async (name) => {
    let res = await fetch(`${BASE_API_URL}/api/account/find-user?name=${name}`);
    let data = await res.json();
    return data;
}

let loadUserData = async (userId) => {
    let res = await fetch(`${BASE_API_URL}/api/account/read?userId=${userId}`);
    let data = await res.json();
    return data;
}
//-----------------------------End User List-------------------------------------------

//-----------------------------User Chat Content---------------------------------------

let loadMessages = (id) => {
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

//-----------------------------End User Chat Content-----------------------------------

let setChatListItem = () => {
    
}

$(document).ready((e) => {
    loadUserData(user_id).then((data) => {
        current_user = data;
    });

    getTopUser().then(data => {
        topUser = data;
        showSearchList(data);
    });

    readUserChatList().then(async (res) => {
        chatData = res;
        await showUserChat(chatData);
    }).catch((e) => {

        });    

    db.collection("chats").where('users_id', 'array-contains', user_id).onSnapshot({ includeMetadataChanges: true },
        (snapshot) => {
        snapshot.docChanges().forEach(function (change) {
            let data = change.doc.data();
            if (change.type === "modified" && !change.doc.metadata.hasPendingWrites) {
                loadMessages(change.doc.id).then(async (mess) => {
                    let size = mess.length;
                    let last_mess = mess[size - 1];
                    if (data.last_message !== '' && !change.doc.metadata.hasPendingWrites && last_mess.userSent !== user_id) {
                        let opposite_user;
                        await $(data.users).each((i, user) => {
                            if (user.user_id !== user_id) {
                                opposite_user = user;
                                return;
                            }
                        });
                        updateChatList(change.doc.id, {
                            createdAt: data.updatedAt,
                            content: data.last_message
                        });
                        appendMessage(last_mess, opposite_user);
                        $(message_content).scrollTop($(message_content).height() + 10000)
                    }
                })                
            }

            var source = change.doc.metadata.hasPendingWrites ? "local cache" : "server";
            console.log("Data came from " + source);
            console.log(change.type);
        });
    });
});