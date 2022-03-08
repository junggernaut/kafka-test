import Axios from "axios";

const api = Axios.create({
    baseURL: '/kafka/',
});

const chatAPI = {
    getMessages: (groupId) => {
        console.log('Calling get messages from API');
        return api.get(`messages/${groupId}`);
    },

    sendMessage: (username, text) => {
        let msg = {
            author: username,
            content: text
        }
        console.log(msg)
        return api.post(`publish`, msg);
    }
}


export default chatAPI;
