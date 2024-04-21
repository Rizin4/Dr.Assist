import './ChatInt.css';
import { useEffect, useState, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import io from 'socket.io-client';
import axios from 'axios';
import { TiMicrophone } from "react-icons/ti";
import { TiMicrophoneOutline } from "react-icons/ti";

function Basic() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setbotTyping] = useState(false);
    const [socket, setSocket] = useState(null);
    const [name, setName] = useState('');

    const fetchRasaJWT = async () => {
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8000/api/chatbot-token/', {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch rasa_jwt');
            }

            const data = await response.json();  // Assuming JSON response
            localStorage.setItem('rasa_jwt', data.rasa_jwt);
            return data.rasa_jwt;
        } catch (error) {
            console.error('Error fetching rasa_jwt:', error);
            return null;
        }
    };



    const initializeSocket = (rasa_jwt) => {
        const newSocket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
            "auth": {
                "token": rasa_jwt
            }
        });

        newSocket.on('connect', () => {
            setSocket(newSocket);
            console.log("connect socket1: ", newSocket);

        });
        newSocket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        newSocket.on('bot_uttered', (response) => {
            console.log("response: ", response);
            const response_temp = { sender: "bot", recipient_id: name, msg: response.text };

            setbotTyping(false);
            setChat(chat => [...chat, response_temp]);
        });

        newSocket.on('connect_error', (error) => {
            console.log('Connection failed:', error);
        });
    }


    const manageName = () => {
        if (!localStorage.getItem('name')) {
            localStorage.setItem('name', "default user");
            setName(name);
        }
        setName(localStorage.getItem('name'));
    };


    useEffect(() => {
        console.log("called");
        const objDiv = document.getElementById('messageArea');
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [chat])

    useEffect(() => {
        console.log("useEffect called");

        const storedJWT = localStorage.getItem('rasa_jwt');
        if (storedJWT) {
            initializeSocket(storedJWT);
        } else {
            fetchRasaJWT()
                .then(fetchedJWT => {
                    if (fetchedJWT) {
                        initializeSocket(fetchedJWT);
                    }
                });
        }
        manageName();

        return () => {
            if (socket != null) {
                console.error("socket is null");
                socket.off('connect');
                socket.off('disconnect');
                socket.off('bot_uttered');
                socket.off('connect_error');
                socket.close()
            }
        };
    }, []);



    const handleSubmit = (evt) => {
        evt.preventDefault();
        console.log(chat);
        if (socket == null) {
            console.error("socket is null");
            return;
        }
        console.log("socket2: ", socket);
        const request_temp = { sender: "user", sender_id: name, msg: inputMessage };

        if (inputMessage !== "") {

            setChat(chat => [...chat, request_temp]);
            setbotTyping(true);
            setInputMessage('');
            setTranscriberTest('');
            console.log("inputMessage: ", inputMessage);
            socket.emit('user_uttered', { message: inputMessage, sender: name }, () => {
                console.log("user_uttered invoked");
            });
        }
        else {
            window.alert("Please enter valid message");
        }
    }

    const [isMicOn, setIsMicOn] = useState(false); // Initial state: mic off

    const toggleMic = () => {
        setIsMicOn(!isMicOn); // Toggle the mic state
    };



    const [TranscriberTest, setTranscriberTest] = useState('')
    const [finalTranscriberTest, setFinalTranscriberTest] = useState(false)
    const socketRef = useRef(null)

    const handleChange = (e) => {
        setInputMessage(e.target.value)
        setTranscriberTest(e.target.value)
    }

    const activateMicrophone = () => {

        console.log("Submit")
        //microphone access
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

            const socket = new WebSocket('ws://localhost:3003')
            socket.onopen = () => {
                console.log({ event: 'onopen' })
                mediaRecorder.addEventListener('dataavailable', async (event) => {
                    if (event.data.size > 0 && socket.readyState === 1) {
                        socket.send(event.data)
                    }
                })
                mediaRecorder.start(1000)
            }

            socket.onmessage = (message) => {

                const transcript = message.data
                if (transcript) {
                    console.log(transcript)
                    setInputMessage(transcript)
                }
            }

            socket.onclose = () => {
                console.log({ event: 'onclose' })
            }

            socket.onerror = (error) => {
                console.log({ event: 'onerror', error })
            }

            socketRef.current = socket
        })
    }
    //end of transcriber 


    const stylecard = {
        maxWidth: '35rem',
        border: '1px solid black',
        paddingLeft: '0px',
        paddingRight: '0px',
        borderRadius: '30px',
        boxShadow: '0 16px 20px 0 rgba(0,0,0,0.4)'

    }
    const styleHeader = {
        height: '4.5rem',
        borderBottom: '1px solid black',
        borderRadius: '30px 30px 0px 0px',
        backgroundColor: '#2B3035',

    }
    const styleFooter = {
        //maxWidth : '32rem',
        borderTop: '1px solid black',
        borderRadius: '0px 0px 30px 30px',
        backgroundColor: '#2B3035',


    }
    const styleBody = {
        paddingTop: '10px',
        height: '28rem',
        overflowY: 'a',
        overflowX: 'hidden',

    }

    return (
        <div>
            {/* <button onClick={()=>rasaAPI("shreyas","hi")}>Try this</button> */}


            <div className="container">
                <div className="row justify-content-center">

                    <div className="card" style={stylecard}>
                        <div className="cardHeader text-white" style={styleHeader}>
                            <h2 style={{ marginBottom: '0px', textAlign: 'center' }}>AI Assistant</h2>
                            {botTyping ? <h6>Dr.Assist is typing....</h6> : null}

                        </div>
                        <div className="cardBody" id="messageArea" style={styleBody}>

                            <div className="row msgarea">
                                {chat.map((user, key) => (
                                    <div key={key}>
                                        {user.sender === 'bot' ?
                                            (

                                                <div className='msgalignstart'>
                                                    <BiBot className="botIcon" /><h5 className="botmsg">{user.msg}</h5>
                                                </div>

                                            )

                                            : (
                                                <div className='msgalignend'>
                                                    <h5 className="usermsg">{user.msg}</h5><BiUser className="userIcon" />
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}

                            </div>

                        </div>
                        <div className="cardFooter text-white" style={styleFooter}>
                            <div className="row">
                                <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
                                    <div className="col-9" style={{ paddingRight: '0px' }}>
                                        <input onChange={handleChange} value={inputMessage} type="text" className="msginp"></input>
                                    </div>
                                    <div className="">
                                        {isMicOn ?
                                            <button type="button" className="circleBtn" onClick={toggleMic} ><TiMicrophone className="sendBtn" /></button>
                                            : <button type="button" className="circleBtn" onClick={() => { toggleMic(); activateMicrophone(); }}><TiMicrophoneOutline className="sendBtn" /></button>}

                                    </div>
                                    <div className="col-2 cola">
                                        <button type="submit" className="circleBtn" ><IoMdSend className="sendBtn" /></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Basic;