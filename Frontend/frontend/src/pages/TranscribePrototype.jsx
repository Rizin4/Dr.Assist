import { useState , useRef } from 'react'


export default function TranscriberTest() {
    const [TranscriberTest, setTranscriberTest] = useState('')
	const [finalTranscriberTest, setFinalTranscriberTest] = useState(false)
    const socketRef = useRef(null)

	const handleChange = (e) => {
		setTranscriberTest(e.target.value)
	}

    const activateMicrophone = ( ) => {

        console.log("Submit")
        //microphone access
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream ,{mimeType: 'audio/webm'})
            
            const socket = new WebSocket('ws://localhost:3002')
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
		setTranscriberTest(transcript)
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

    const handleSubmit = (e) => {
		e.preventDefault()
        if (socketRef.current !== null) {
            socketRef.current.close()
        }
	
		setFinalTranscriberTest(true)
	}
return(
    <div className='App'>
<div>
<header className="header text">TranscriberTest</header>
</div>
<div className="card ">
     <div className='container'>
  
  
<div className='journal-body'>
{!finalTranscriberTest ? (
				<>
					<div className='description'>
						This is a temporary transcription prototype. You can type or use your voice to transcribe ,this is a temporary page and should be removed in the future
					</div>
					<form onSubmit={handleSubmit}>
						<textarea
							className='journal-input'
							value={TranscriberTest}
							onChange={handleChange}
						/>
						<br />
						<button
							type='submit'
							className='submit-button'
							disabled={TranscriberTest.length === 0}>
							Submit
						</button>
                        <button
	                        onClick={activateMicrophone}
	                        type='button'
	                        className='submit-button'>
	                        Voice 💬
                        </button>
					</form>
				</>
			) : (
				<>
					<h2>Today's Entry</h2>
					<div className='description'>{TranscriberTest}</div>
				</>
			)}
         </div> 
         </div>
         </div>
         </div>
)
}