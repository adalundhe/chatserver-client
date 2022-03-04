import { useEffect, useState } from "react";
import axios from "axios";
import getConfig from 'next/config';
import { Room } from "../types/room";
import { useRouter } from 'next/router';
import { InferGetServerSidePropsType } from 'next';

const  { publicRuntimeConfig } = getConfig();

export async function getServerSideProps() {

    const response = await axios.get(`${publicRuntimeConfig.CHAT_API_GATEWAY}/rooms/list`);
    
    return {
        props: {
            rooms: response.data as Room[]
        }
    }
}

const Login = ({ rooms }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const router = useRouter();

    const [selectedRoom, setSelectedRoom] = useState<number>(0);

    const [user, setUserData] = useState<{
        name: string,
        currentRoom: string | undefined,
        tokens: string[]
    }>({
        name: "",
        currentRoom: rooms[0].name,
        tokens: [rooms[0].token]
    });

    useEffect(() => {
        if (rooms.length > 0){
            setUserData({
                name: user.name.length > 0 ? user.name : "",
                currentRoom: rooms[selectedRoom].name,
                tokens: [rooms[selectedRoom].token]
            })
        }
    }, [selectedRoom])


    const submitUser = async () => {

        if (user.name.length > 0){
            await axios.put(
                `${publicRuntimeConfig.CHAT_API_GATEWAY}/users/put`,
                user
            )

            router.push(`/rooms/${user.currentRoom}/${user.name}`)
        }
    }
    
    return (
        <div>
            <input value={user.name} onChange={(event) => setUserData({
                ...user,
                name: event.target.value
            })} />
            {
                rooms.length > 0 ?
                <select

                    onChange={(event) => {
                        const roomIdx = parseInt(event.target.value);
                       setSelectedRoom(roomIdx)
                    }}
                >
                    {
                        rooms.map((room: Room, idx: number) =>
                            <option key={`chat-room-${room.name}-${idx}`} value={idx}>{room.name}</option>
                        )
                    }
                </select> : "loading..."
            }
            <button onClick={submitUser}>Submit</button>
        </div>
    )
}


export default Login;