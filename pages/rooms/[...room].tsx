import getConfig from 'next/config';
import styles from '../../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useRouter } from 'next/router'
import axios from "axios";

const Room = () => {
  const router = useRouter();
  const { room } = router.query;
  const roomName = room?.at(0);
  const userName = room?.at(1);

  const  { publicRuntimeConfig } = getConfig();

  const previousMessages = useRef<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();


  const initalizeChat = (tokens: string[]) => {

    socket.current?.connect();

    socket.current?.emit('register', {
      currentRoom: roomName,
      name: userName,
      tokens: tokens
    });

    socket.current?.on('register', (message) => {
      previousMessages.current = [
        ...previousMessages.current,
        message
      ]
      setMessages(previousMessages.current);
    })

    socket.current?.emit('join', {
      name: userName,
      currentRoom: roomName
    });

    socket.current?.on('join', (message) => {
      previousMessages.current = [
        ...previousMessages.current,
        message
      ]
      setMessages(previousMessages.current);
    })

    socket.current?.on('message', (message) => {
      previousMessages.current = [
        ...previousMessages.current,
        message
      ]
      setMessages(previousMessages.current);
    });

    socket.current?.on('leave', (message) => {
      previousMessages.current = [
        ...previousMessages.current,
        message
      ]
      setMessages(previousMessages.current);
    });
  }

  useEffect(() => {
    const getUser = async () => {
        if (userName !== undefined && userName.length > 0){
          const response = await axios.get(`${publicRuntimeConfig.CHAT_API_GATEWAY}/users/get?name=${userName}`);

          if (socket.current === undefined){

            socket.current = io(publicRuntimeConfig.CHATSERVER_API, {
              auth: {
                token: response.data.tokens.pop()
              },
              query: {
                room: roomName
              }
            });
            initalizeChat(response.data.tokens);
          }
        }
        else {

          router.push("/login")
        }
    }

    getUser();
  }, []);

  const [userInput, setUserInput] = useState("");


  return (
    <div className={styles.container}>
      {
        messages.map((message: string, idx: number)=>
          <p key={`message-${idx}`}>{message}</p>
        )
      }
      <input 
        onChange={(event) => {
          setUserInput(event.target.value);
        }} 
        onKeyPress={(event) => {
          if (event.charCode === 13){
            socket.current?.emit('message', {
              user: userName,
              message: userInput,
              room: roomName
            });
          }
        }}
        value={userInput}
      />
      <button
        onClick={() => {
          socket.current?.emit('leave', {
            name: userName,
            currentRoom: roomName
          });

          router.push('/login');
        }}
      >Leave</button>
    </div>
  )
}

export default Room
