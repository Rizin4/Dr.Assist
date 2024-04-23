import './ChatInt.css';
import { useEffect, useState, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import io from 'socket.io-client';
import axios from 'axios';
import { TiMicrophone } from "react-icons/ti";
import { TiMicrophoneOutline } from "react-icons/ti";
import CircularProgress from '@mui/material/CircularProgress';

const Basic = () => {

    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setbotTyping] = useState(false);
    const [socket, setSocket] = useState(null);
    const [name, setName] = useState('');

    const [recorder, setRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioReady, setAudioReady] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false); // Initial state: mic off
    const [isTranscribing, setIsTranscribing] = useState(false)




    const fetchRasaJWT = async () => {
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await axios.get(`${process.env.REACT_APP_DJANGO_SERVER}/api/chatbot-token/`, {
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
            console.log("inputMessage: ", inputMessage);
            socket.emit('user_uttered', { message: inputMessage, sender: name }, () => {
                console.log("user_uttered invoked");
            });
        }
        else {
            window.alert("Please enter valid message");
        }
    }


    const handleChange = (e) => {
        setInputMessage(e.target.value)
    }


    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            const mediaRecorder = new MediaRecorder(stream);
            setRecorder(mediaRecorder);

            mediaRecorder.ondataavailable = (e) => {
                const audioData = new Blob([e.data], { type: 'audio/wav' });
                setAudioBlob(audioData);
            };

            mediaRecorder.onstop = () => {
                setAudioReady(true)

            };

            mediaRecorder.start();
        } catch (err) {
            console.error('Error obtaining audio stream:', err);
        }
    };


    const stopRecording = () => {// Define setRecordingComplete function

        if (recorder) {
            recorder.stop();
            setRecorder(null);
        };
    }

    useEffect(() => {
        if (audioReady) {
            if (!audioBlob || audioBlob.size === 0) {
                console.error('Audio blob is empty or not ready.');
                return;
            } // Make sure audioBlob is not null
            // const audioURL = URL.createObjectURL(audioBlob);
            // const audio = new Audio(audioURL);
            // audio.addEventListener('ended', () => {
            //     console.log('Audio playback ended.');
            //     URL.revokeObjectURL(audioURL); // Revoke when audio finishes playing
            // });
            // audio.addEventListener('loadeddata', () => {
            //     audio.play().catch((e) => {
            //         console.log("error in playing audio", e);
            //     });;
            // });
            // audio.load();
            setAudioReady(false)
            transcribeAudio();
        }
    }, [audioReady]);


    const transcribeAudio = async () => {

        if (!audioBlob || audioBlob.size === 0) {
            console.error('Audio blob is empty or not ready.');
            return;
        }
        setIsTranscribing(true)
        const formData = new FormData();
        formData.append('audioFile', audioBlob);
        console.log(formData)

        try {
            const access_token = localStorage.getItem('access_token');
            const response = await axios.post(`${process.env.REACT_APP_DJANGO_SERVER}/api/transcribe-audio/`, formData, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response)
            const { data } = response;
            console.log('Transcriber text:', data.text);
            setInputMessage(data.text)
            setIsTranscribing(false)

        } catch (error) {
            console.error('Error fetching transcriber text:', error);
            return null;
        }
    };


    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">

                    <div className="card stylecard" >
                        <div className="cardHeader text-white styleHeader" >
                            {/* <h2 style={{ marginBottom: '0px', textAlign: 'center' }}>AI Assistant</h2> */}
                            {botTyping ? <h6>Dr.Assist is typing....</h6> : null}

                        </div>
                        <div className="cardBody styleBody" id="messageArea" >

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
                        <div className="cardFooter text-white styleFooter" >
                            <div className="row">
                                <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
                                    <div className="col-9" style={{ paddingRight: '2px' }}>
                                        <input onChange={handleChange} value={inputMessage} type="text" className="msginp"></input>
                                    </div>
                                    <div className="">
                                        <button type="button"
                                            className="circleBtn"
                                            onClick={() => {
                                                if (!isMicOn) {
                                                    setIsMicOn(true);
                                                    setInputMessage('');
                                                    startRecording();
                                                } else {
                                                    setIsMicOn(false);
                                                    stopRecording();
                                                }
                                            }}
                                            disabled={isTranscribing}
                                        >
                                            {isTranscribing ?
                                                <CircularProgress /> :
                                                isMicOn ?
                                                    <TiMicrophone className="sendBtn pulse" /> :
                                                    <TiMicrophoneOutline className="sendBtn" />
                                            }
                                        </button>
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