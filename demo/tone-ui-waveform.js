const Tone = require('tone')
const Meta = require('../')

let waveformUI = Meta.Tone.ui.waveform({
	canvas: document.querySelector('#waveform-canvas'),
	canvasWidth: window.innerWidth,
	canvasHeight: window.innerHeight,

	size: 512,

	render: {
		fillStyle: 'black',
		strokeStyle: 'black',
	},
})

let synth = new Tone.Synth()
synth.fan(Tone.Master, waveformUI.audioNode)

let microphone = new Tone.UserMedia();

/**
 * UI
 */
let noteContainer = document.querySelector('#notes')
let noteButtons = Array.from(document.querySelectorAll('[data-note]'))
let microphoneToggle = document.querySelector('#microphone-toggle')

noteButtons.forEach(element => {
	let note = element.getAttribute('data-note')

	element.addEventListener('mousedown', synth.triggerAttack.bind(synth, note))
})

document.documentElement.addEventListener('mouseup', e => {
	synth.triggerRelease()
})

microphoneToggle.addEventListener('change', (e) => {
	if (microphoneToggle.checked) {
		// opening the input asks the user to activate their mic
		microphone.open().then(function(){
			microphone.connect(waveformUI.audioNode)
		})
	} else {
		microphone.disconnect(waveformUI.audioNode)
	}
})