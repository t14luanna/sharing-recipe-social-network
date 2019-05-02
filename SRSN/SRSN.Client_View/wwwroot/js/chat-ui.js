//----------------------------------Initialization----------------------------------
const chat_list = $('.topic--replies.chat-list > .nav')[0];
const search_list = $('.topic--replies.search-list > .nav')[0];
const search_bar = $('.search-bar')[0];
const message_content = $('.msg-list')[0];
const message_user_title = $('.name-header-mesgs')[0];
const send_btn = $('.msg_send_btn')[0];
const message_input = $('.write_msg')[0];
const message_typing = $('.msg-typing')[0];

let current_chat_id
//----------------------------------------------------------------------------------

//------------------------------------CHAT LIST-------------------------------------
let createChatUI = (chat) => {
    let user_chat_item = document.createElement('li')
    $(user_chat_item).attr('id', chat.id)

    let opposite_user
    if (chat.data.oppositeUser.length === 1) {
        opposite_user = findUserById(chat.data.oppositeUser[0])
        console.log(opposite_user)
    }

    let current_user_element = findUserElement(chat.data.users, user.id)

    let last_mess_content = chat.data.lastMessage
    let last_mess_time = convertTimestampToDate(chat.data.updatedAt.seconds);

    if (!current_user_element.isSeen) {
        $(user_chat_item).addClass('not-seen')
    }

    if (chat.data.lastUserSentMessage) {
        if (chat.data.lastUserSentMessage === user.id) {
            last_mess_content = 'Bạn : ' + last_mess_content
        }
    }

    user_chat_item.innerHTML += '<div class="topic--reply"><div class="clearfix"><p class="date float--right">'
        + last_mess_time + '</p></div><div class="body clearfix"><div class="author mr--20 float--left text-center">' +
        '<div class="avatar" data-overlay="0.3" data-overlay-color="primary">' +
        '<a><img src="' + opposite_user.avatarImageUrl + '" alt=""></a></div></div>' +
        '<div class="content fs--14 ov--h"><div class="name text-darkest">' +
        '<p><a href="#" class="name-user">' + opposite_user.firstName + ' ' + opposite_user.lastName + '</a></p></div></div>' +
        '<div class="content fs--14 ov--h">' +
        '<p class="chat-message-wrap">' + last_mess_content + '</p>' +
        '</div></div></div>';

    $(user_chat_item).on('click', () => {
        activeAction(chat.id)
        seenAction(chat.id)
    });

    return user_chat_item;
}

let createChatListUI = (chats) => {
    if (chats.length > 0) {
        $(chats).each(async (i, chat) => {
            await $(chat_list).append(createChatUI(chat))
        })
        activeAction(chats[0].id)
    }
}

let activeAction = id => {
    if (current_chat_id) {
        $('#' + current_chat_id).removeClass('active');
    }
    current_chat_id = id
    $('#' + id).addClass('active')
    let title = $('#' + id + ' .name-user').text()
    $(message_user_title).text(title)
    $(message_typing).text(title + ' is typing....')
    showMessageContent(id)
}

let seenAction = (id) => {
    let chat = findChatById(id)
    let users = chat.data.users
    let current_user = findUserElement(users, user.id)
    if (!current_user.isSeen) {
        $('#' + chat.id).removeClass('not-seen')
        current_user.isSeen = true
        db.collection('chats').doc(chat.id).update({
            users: users,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }
}

let updateChatUI = (chat) => {
    let last_mess_content = chat.data.lastMessage
    let last_mess_time = convertTimestampToDate(chat.data.updatedAt.seconds);
    let current_user_element = findUserElement(chat.data.users, user.id)

    if (!current_user_element.isSeen) {
        $('#' + chat.id).addClass('not-seen')
    }

    if (chat.data.lastUserSentMessage) {
        if (chat.data.lastUserSentMessage === user.id) {
            last_mess_content = 'Bạn : ' + last_mess_content
        }
    }

    $('#' + chat.id + ' .date').text(last_mess_time)
    
    $('#' + chat.id + ' .chat-message-wrap').text(last_mess_content)
}
//----------------------------------------------------------------------------------

//-----------------------------------SEARCH LIST------------------------------------
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
        createChat(user.id);
    });

    return user_chat_item;
}

let createSearchListUI = (block, user_list) => {
    $(block).empty()
    $(user_list).each(async (i, user_search) => {
        if (user.id === user_search.id) return;
        $(block).append(createSearchUI(user_search))
    })
}
//----------------------------------------------------------------------------------

//---------------------------------------EVENT--------------------------------------
$(search_bar).focusin(() => {
    $(search_list).css('display', 'block');
    $(chat_list).css('display', 'none');
});

$(search_bar).focusout(() => {
    $(search_list).css('display', 'none');
    $(chat_list).css('display', 'block');
    $(search_bar).val('');
    createSearchListUI(search_list, userPopular)
});

$(search_bar).on('input', () => {
    let search_val = $(search_bar).val();
    if (search_val.length > 1) {
        findUser(search_val).then(res => {
            console.log(res)
            users = users.concat(res)
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

$(message_input).on('input', async (e) => {
    let text = $(message_input).val();
    let chat = findChatById(current_chat_id)
    let current_user = findUserElement(chat.data.users, user.id)    

    //if (text[text.length - 1] === "@") {

    //}
    //if (!current_user.isTyping && text.length > 3) {
    //    chat.data.users[current_user_pos].isTyping = true;
    //    db.collection('chats').doc(current_chat_id).update({
    //        users: chat.data.users
    //    })
    //} else if (current_user.isTyping && text.length <= 3) {
    //    chat.data.users[current_user_pos].isTyping = false;
    //    db.collection('chats').doc(current_chat_id).update({
    //        users: chat.data.users
    //    })
    //}

    //seenAction(chat)
})

$(message_input).focusin(() => {
    seenAction(current_chat_id)
})

$(message_input).keydown((event) => {
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        sendMessage($(message_input).val());
        $(message_input).val('');
    }
});

let findUserElement = (list, id) => {
    return list.find(item => { return item.id === id })
}

//----------------------------------------------------------------------------------

//-------------------------------------MESSAGE--------------------------------------
let showMessageContent = (id) => {
    let chat = findChatById(id)
    let opposite_user = findUserById(chat.data.oppositeUser[0])

    getUserMessage(id).then(messages => {
        current_messages = messages
        $(message_content).empty()
        $(message_user_title).text(opposite_user.user_name)
        $(message_typing).text(opposite_user.user_name + ' is typing')


        $(messages).each((i, mess) => {
            appendMessage(mess, opposite_user);
        })
    })
};

let appendMessage = (message, opposite_user) => {
    let date = '';
    let user_message_item = '<div class="incoming_msg"><div class="incoming_msg_img" >' +
        '<img class="receiver-avatar" src="' + opposite_user.avatarImageUrl + '" alt="sunil"></div>' +
        '<div class="received_msg"><div class="received_withd_msg"><p>' + message.content + '</p>' +
        '<span class="time_date">' + date + '</span></div></div></div >';

    if (message.userSent === user.id) {
        user_message_item = '<div class="outgoing_msg"><div class="sent_msg">' +
            '<p>' + message.content + '</p><span class="time_date">' + date + '</span></div></div>';
    }

    message_content.innerHTML += user_message_item;
    $(message_content).scrollTop($(message_content).height() + 10000)
};
//----------------------------------------------------------------------------------