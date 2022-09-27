const axios = require("axios")
const audioURL = "https://upload.wikimedia.org/wikipedia/commons/4/46/03_ALBERT_EINSTEIN.ogg"
const APIKey = "908c0XXXXXXXXXXXX"//API KEY
const refreshInterval = 5000

// Setting up 
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: APIKey,
    "content-type": "application/json",
  },
})

const getTranscript = async () => {
  // Sends the audio file to AssemblyAI for transcription
  const response = await assembly.post("/transcript", {
    audio_url: audioURL,
  })

  // Interval for checking transcript completion
  const checkCompletionInterval = setInterval(async () => {
    const transcript = await assembly.get(`/transcript/${response.data.id}`)
    const transcriptStatus = transcript.data.status

    if (transcriptStatus !== "completed") {
      console.log(`Transcript Status: ${transcriptStatus}`)
    } else if (transcriptStatus === "completed") {
      console.log("\nTranscription completed!\n")
      let transcriptText = transcript.data.text
      console.log(`Your transcribed text:\n\n${transcriptText}`)
      clearInterval(checkCompletionInterval)
    }
  }, refreshInterval)
}

getTranscript()
