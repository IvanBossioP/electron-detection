


const connectionCheck = () => {
    return navigator.connection.rtt === 0
}

const languageCheck = () => {
    return navigator.language.length === 2
}

const processCheck = () => {
    return 'process' in window
}

const permissionCheck = async () => {
    const result = await navigator.permissions.query({name: 'geolocation'})
    return result.state === 'granted'
} 

const speechSyntesisCheck = () => new Promise(r => {
    speechSynthesis.getVoices()
    setTimeout(() => {
        const voices = speechSynthesis.getVoices()

        console.log(voices)
        r(!voices.some(voice => voice.voiceURI.startsWith('Google')))
    }, 1000)
    
})


const tests = [
    {name: 'PermissionCheck', fn: permissionCheck, weight: 'mid'},
    {name: 'SpeechSyntesisCheck', fn: speechSyntesisCheck, weight: 'mid'},
    {name: 'ConnectionCheck', fn: connectionCheck, weight: 'low'},
    {name: 'ProcessCheck', fn: processCheck, weight: 'high'},
    {name: 'LanguageCheck', fn: languageCheck, weight: 'mid'},
]
Promise.all(tests.map(async ({name, fn, weight}) => {
    const detected = await fn();
    return {
        name, weight, detected 
    }
})).then(result => {
    document.querySelector('#res').value = JSON.stringify(result, null, 4)
})
