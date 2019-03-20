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

//Db
let user_id = 1;
let user_chat_list = [];
let user_list = [];
let db = firebase.firestore();
let current_chat;
let chatData = [];

//View
let message_list = $('.topic--replies > .nav')[0];
let message_content = $('.msg-list')[0];
let message_user_title = $('.name-header-mesgs')[0];
let send_btn = $('.msg_send_btn')[0];

$(send_btn).on('click', () => {
    let message_text = $('.write_msg')[0];
    sendMessage($(message_text).val());
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
    return db.collection('chats').doc(current_chat.id).collection('messages').add(
        {
            userSent: user_id,
            content: messageText,
            isOppositeSeen: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function (docRef) {
        })
        .catch(function (error) {
        });
};

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

//Show user chat list
let showUserChat = (data) => {
    $(data).each(async (i, item) => {
        let chat = item.data;
        let id = item.id;
        let opposite_user;
        let active = false;
        await $(chat.users).each((i, user) => {
            if (user.user_id !== user_id) {
                opposite_user = user;
                return;
            }
        });

        if (i === 0) {
            active = true;
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
            '<p><a href="member-activity-personal.html">' + opposite_user.user_name + '</a></p></div></div>' +
            '<div class="content fs--14 ov--h">' +
            '<p class="chat-message-wrap">' + last_mess_content + '</p>' +
            '</div></div></div></li>';

        if (active) {
            showMessageContent(id);
        }

        message_list.innerHTML += user_chat_item;
    });
    
};

let showMessageContent = (id) => {
    findChatById(id).then(async (res) => {
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

        //Set listener
        db.collection("chats").doc(current_chat.id).collection('messages')
            .onSnapshot(function (snapshot) {
                snapshot.docChanges().forEach(function (change) {
                    if (change.type === "modified") {
                        appendMessage(change.doc.data(), opposite_user);
                    }
                });
            });
        //End Set listener

        $(messages).each((i, mess) => {
            appendMessage(mess, opposite_user);
        });
    });
};

let appendMessage = (message, opposite_user) => {
    let date = convertTimestampToDate(message.createdAt.seconds);
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
//-----------------------------End User Chat List--------------------------------------

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
    readUserChatList().then(async (res) => {
        chatData = res;
        await showUserChat(chatData);
    }).catch((e) => {

    });
});