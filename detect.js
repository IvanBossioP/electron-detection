


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

const speechSyntesisCheck = () => {
    const voices = speechSynthesis.getVoices()
    return !voices.some(voice => voice.startsWith('Google'))
}


const tests = [
    {name: 'PermissionCheck', fn: permissionCheck, weight: 'mid'},
    {name: 'SpeechSyntesisCheck', fn: speechSyntesisCheck, weight: 'mid'},
    {name: 'ConnectionCheck', fn: connectionCheck, weight: 'low'},
    {name: 'ProcessCheck', fn: processCheck, weight: 'high'},
    {name: 'LanguageCheck', fn: languageCheck, weight: 'mid'},
]
const result = tests.map(async ({name, fn, weight}) => {
    const detected = await fn();
    return {
        name, weight, detected 
    }
})

document.querySelector('#result').innerHTML = JSON.stringify(result, null, 4)