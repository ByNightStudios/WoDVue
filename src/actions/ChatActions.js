import {
    MESSAGE_CHATS,
    MESSAGES,
    MESSAGES_CREATE,
    MESSAGE_CHATS_UNREAD,
    MESSAGE_CHATS_USERS
} from '../common/backendConstants'


export const getChats = (page = 0) => (dispatch, getState, { api }) => {
    return api
        .get(`${MESSAGE_CHATS}?page=${page}`)
        .then(response => {
            return response.data
        })
        .catch(error => {
            throw error.response.data
        })
};

export const getMessages = (receiver) => (dispatch, getState, { api }) => {
    return api
        .get(`${MESSAGES}?type=admin&receiver=${receiver}`)
        .then(response => {
            return response.data
        })
        .catch(error => {
            throw error.response.data
        })
};

export const sendMessages = (message, receiver) => (dispatch, getState, { api }) => {
    return api
        .post(MESSAGES_CREATE, {
            message,
            type : "admin",
            receiver
        })
        .then(response => {
            return response.data
        })
        .catch(error => {
            throw error.response.data
        })
};

export const updateUnreadCount = (chat_id) => (dispatch, getState, { api }) => {

    let url= MESSAGE_CHATS_UNREAD.replace(':chat_id', chat_id)
    return api
        .put(url)
        .then(response => {
            return response.data
        })
        .catch(error => {
            throw error.response.data
        })
};

export const getChatsUsers = (search = '') => (dispatch, getState, { api }) => {

    return api
        .get(`${MESSAGE_CHATS_USERS}?search=${search}`)
        .then(response => {
            return response.data
        })
        .catch(error => {
            throw error.response.data
        })
};