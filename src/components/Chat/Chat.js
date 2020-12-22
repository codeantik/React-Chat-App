import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css'

import InfoBar from '../InfoBar/InfoBar.js';
import Input from '../Input/Input.js';
import Messages from '../Messages/Messages.js';
import TextContainer from '../TextContainer/TextContainer.js';

let socket;

const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const[message, setMessage] = useState('');
    const[messages, setMessages] = useState([]);

    const[users, setUsers] = useState('');
    const ENDPOINT = 'https://my-chat-app-socket.herokuapp.com/';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {

        });

        return () => {
            socket.emit('disconnect');

            socket.off();
        }

    }, [ENDPOINT, location.search]);

    //useEffect for handling messages

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on('roomData', ({users}) => {
            setUsers(users);
        });

        return () => {
            socket.off();
        }
    }, [messages]);

    //function for handling messages
    const sendMessage = (e) => {
        e.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);

    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users}/>
        </div>
    );
};

export default Chat;