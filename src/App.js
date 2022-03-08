import React, { useState } from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import './App.css';
import Input from './components/Input/Input';
import LoginForm from './components/LoginForm';
import Messages from './components/Messages/Messages';
import chatAPI from './services/chatapi';
import { randomColor } from './utils/common';

var stompClient =null
const brokerprefix = "kafka"
const chatRoomId = "testtopic"

const App = () => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const SOCKET_URL = 'http://localhost:8080/my-chat/'
  const connect =()=>{
    const Sock = new SockJS(SOCKET_URL)
    stompClient = over(Sock)
    stompClient.connect({}, onConnected, onError);
  }
  const onConnected = () => {
    stompClient.subscribe('/room/test', onMessageReceived); 
  }
  const onError = (err) => {
    console.log(err);
  }
  const onMessageReceived = (payload) => {
    const msg = JSON.parse(payload.body)
    console.log('New Message Received!!', msg);
    setMessages((m) => [...m, msg]);
  }

  let onSendMessage = (msgText) => {
    const msg = {
      author: user.username,
      content: msgText
    }
    stompClient.send(`/${brokerprefix}/${user.username}/${chatRoomId}`, {}, JSON.stringify( msg))
    // chatAPI.sendMessage(user.username, msgText).then(res => {
    //   console.log('Sent', res);
    // }).catch(err => {
    //   console.log('Error Occured while sending message to api');
    // })
  }

  let handleLoginSubmit = (username) => {
    console.log(username, " Logged in..");
    setUser({username: username, color: randomColor()})
    connect()
  }

  return (
    <div className="App">
      {!!user ?
        (
          <>
          
            <Messages
              messages={messages}
              currentUser={user}
            />
            <Input onSendMessage={onSendMessage} />
          </>
        ) :
        <LoginForm onSubmit={handleLoginSubmit} />
      }
    </div>
  )
}

export default App;
