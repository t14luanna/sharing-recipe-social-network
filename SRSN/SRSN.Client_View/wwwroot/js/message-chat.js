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

//View
let message_list = $('.topic--replies > .nav')[0];
let message_content = $('.msg-list')[0];
let message_user_title = $('.name-header-mesgs')[0];

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

let saveMessage = (messageText) => {
    // Add a new message entry to the Firebase database.
    return db.collection('chat').add({
        user_id: user_id,
        message: message,
        isSeenByOther: {
            status: false,
            time: ""
        },
        createAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error);
    });
};

let loadMessages = () => {
    // Create the query to load the last 12 messages and listen for new ones.
    var query = db.collection('chat')
        .orderBy('timestamp', 'desc')
        .limit(12);

    // Start listening to the query.
    query.onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === 'removed') {
                deleteMessage(change.doc.id);
            } else {
                var message = change.doc.data();
                displayMessage(change.doc.id, message.timestamp, message.name,
                    message.text, message.profilePicUrl, message.imageUrl);
            }
        });
    });
};

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
                user_chat_list.push(doc.data());
            });
            return resolve(user_chat_list);
        }).catch((e) => {
            return reject(e);
        });
    });
}

//Show user chat list
let showUserChat = (data) => {
    $(data).each(async (i, chat) => {
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

        let last_mess_content = '';
        let last_mess_time = '';
        if (chat.messages.length > 0) {
            last_mess = chat.messages[chat.messages.length - 1];
            last_mess_content = last_mess.content;
            last_mess_time = convertTimestampToDate(last_mess.createdAt.seconds);
        }

        let user_chat_item = '<li class="' + (active ? 'active' : '') + '">' +
            '<div class="topic--reply"><div class="clearfix"><p class="date float--right">' + last_mess_time +
            '</p></div><div class="body clearfix"><div class="author mr--20 float--left text-center">' +
            '<div class="avatar" data-overlay="0.3" data-overlay-color="primary">' +
            '<a href="member-activity-personal.html"><img src="' + opposite_user.user_image + '" alt=""></a></div></div>' +
            '<div class="content fs--14 ov--h"><div class="name text-darkest">' +
            '<p><a href="member-activity-personal.html">' + opposite_user.user_name + '</a></p></div></div>' +
            '<div class="content fs--14 ov--h">' +
            '<p class="chat-message-wrap">' + last_mess_content + '</p>' +
            '</div></div></div></li>';

        if (active) {
            $(chat.messages).each((i, mess) => {
                let date = convertTimestampToDate(mess.createdAt.seconds);
                let user_message_item = '<div class="incoming_msg"><div class="incoming_msg_img" >' +
                '<img class="receiver-avatar" src="' + opposite_user.user_image + '" alt="sunil"></div>' +
                '<div class="received_msg"><div class="received_withd_msg"><p>' + mess.content + '</p>' +
                    '<span class="time_date">' + date + '</span></div></div></div >';

                if (mess.userSent === user_id) {
                    user_message_item = '<div class="outgoing_msg"><div class="sent_msg">' +
                        '<p>' + mess.content + '</p><span class="time_date">' + date + '</span></div></div>';
                }

                message_content.innerHTML += user_message_item;
            })
        }

        message_list.innerHTML += user_chat_item;
    });
    
};
//-----------------------------End User Chat List--------------------------------------

$(document).ready((e) => {
    readUserChatList().then((res) => {
        showUserChat(res);
    }).catch((e) => {

    });
});