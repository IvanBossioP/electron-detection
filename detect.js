const connectionCheck = () => {
    return navigator.connection.rtt === 0
}

const languageCheck = () => {
    return navigator.language.length === 2
}

const processCheck = () => {
    return 'process' in window
}

const userAgentCheck = () => {
    return /electron/i.test(navigator.userAgent)
}

const permissionCheck = async () => {
    const result = await navigator.permissions.query({name: 'geolocation'})
    return result.state === 'granted'
} 

//refers to https://github.com/electron/electron/issues/11585#issuecomment-356501745
const speechSyntesisCheck = () => new Promise(r => {
    speechSynthesis.getVoices()
    setTimeout(() => {
        const voices = speechSynthesis.getVoices()
        r(!voices.some(voice => voice.voiceURI.startsWith('Google')))
    }, 1000)
    
})

const webWorkerCheck = () => new Promise(r => {
    if(userAgentCheck()) {
        r(true)
        return;
    }
    const worker = new Worker('worker.js')
    worker.addEventListener('message', (event) => {
        r(event.data !== navigator.userAgent)
        worker.terminate();
    })
})

//refers to https://github.com/electron/electron/issues/2042#issuecomment-114667969
const chromeCheck = () => {
    return (!window.chrome) || (!chrome.app) || (typeof chrome.csi !== 'function') || (typeof chrome.loadTimes !== 'function')
}

//refers to https://github.com/electron/electron/issues/30201
const userDataCheck = () => {
    return (!navigator.userAgentData) || navigator.userAgentData.brands.length === 0 || (!navigator.platform)
}

//refers to https://github.com/electron/electron/blob/d44a187d0b226800fe0cb4f7a0d2b36c871b27cd/lib/renderer/window-setup.ts#L17
const promptCheck = () => {
    return Function.toString.call(window.prompt) === 'function () { [native code] }'
}

const tests = [
    {name: 'PermissionCheck', fn: permissionCheck, weight: 'mid'},
    {name: 'SpeechSyntesisCheck', fn: speechSyntesisCheck, weight: 'mid'},
    {name: 'ConnectionCheck', fn: connectionCheck, weight: 'low'},
    {name: 'ProcessCheck', fn: processCheck, weight: 'high'},
    {name: 'LanguageCheck', fn: languageCheck, weight: 'mid'},
    {name: 'UserAgentCheck', fn: userAgentCheck, weight: 'high'},
    {name: 'WebWorkerCheck', fn: webWorkerCheck, weight: 'high'},
    {name: 'ChromeCheck', fn: chromeCheck, weight: 'high'},
    {name: 'UserDataCheck', fn: userDataCheck, weight: 'mid'},
    {name: 'PromptCheck', fn: promptCheck, weight: 'high'},


]
Promise.all(tests.map(async ({name, fn, weight}) => {
    const detected = await fn();
    return {
        name, weight, detected 
    }
})).then(result => {
    document.querySelector('#res').value = JSON.stringify(result, null, 4)
})
