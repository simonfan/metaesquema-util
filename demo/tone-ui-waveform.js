const Tone = require('tone')
const Meta = require('../')

let noteContainer = document.querySelector('#notes')
let noteButtons = Array.from(document.querySelectorAll('[data-note]'))

let synth = new Tone.Synth()

let waveformUI = Meta.Tone.ui.waveform({
	canvas: document.querySelector('#waveform-canvas'),
	canvasWidth: window.innerWidth,
	canvasHeight: window.innerHeight,
})
synth.fan(Tone.Master, waveformUI.audioNode)

noteButtons.forEach(element => {
	let note = element.getAttribute('data-note')

	element.addEventListener('mousedown', synth.triggerAttack.bind(synth, note))
})

document.documentElement.addEventListener('mouseup', e => {
	synth.triggerRelease()
})
