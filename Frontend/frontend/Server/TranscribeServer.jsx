require('dotenv').config()

// Add Deepgram to get the transcription
const { createClient ,  LiveTranscriptionEvents } = require('@deepgram/sdk')
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Add WebSocket
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3003})

// Open WebSocket connection and initiate live transcription
wss.on('connection', (ws) => {
	const deepgramLive = deepgram.listen.live({
		interim_results: true,
		punctuate: true,
		endpointing: 500,		
	})

	deepgramLive.on(LiveTranscriptionEvents.Open, () => console.log('dg onopen'))
	deepgramLive.on(LiveTranscriptionEvents.Error, (error) => console.log({ error }))

	ws.onmessage = (event) => deepgramLive.send(event.data)
	ws.onclose = () => deepgramLive.finish()

	deepgramLive.on(LiveTranscriptionEvents.Transcript, (data) => ws.send(data.channel.alternatives[0].transcript))
})