const Tone = require('tone')

const DEFAULT_RENDER_OPTIONS = {
	fillStyle: false,
	strokeStyle: 'black',
	lineWidth: 2
}

module.exports = function createToneWaveformUI(options) {
	let CANVAS_WIDTH = options.canvasWidth
	let CANVAS_HEIGHT = options.canvasHeight
	let canvas = options.canvas

	options.render = Object.assign({}, DEFAULT_RENDER_OPTIONS, options.render)

	if (!CANVAS_WIDTH) {
		throw new Error('canvasWidth is required')
	}

	if (!CANVAS_HEIGHT) {
		throw new Error('canvasHeight is required')
	}

	if (!canvas) {
		throw new Error('canvas is required')
	}

	let context = canvas.getContext('2d')

	canvas.width = CANVAS_WIDTH
	canvas.height = CANVAS_HEIGHT

	let waveformUI = {
		canvas: canvas,
		audioNode: new Tone.Waveform(options.size || 1024),
	}

	function drawWaveform(values) {
		//draw the waveform
		context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
		context.beginPath()
		context.lineJoin = 'round'
		context.lineWidth = options.render.lineWidth
		context.strokeStyle = options.render.strokeStyle
		context.moveTo(0, ((values[0] + 1) / 2) * CANVAS_HEIGHT)
		for (var i = 1, len = values.length; i < len; i++){
			var val = (values[i] + 1) / 2
			var x = CANVAS_WIDTH * (i / len)
			var y = val * CANVAS_HEIGHT
			context.lineTo(x, y)
		}

		if (options.render.fillStyle) {
			context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT)
			context.lineTo(0, CANVAS_HEIGHT)
			context.closePath()
			context.fillStyle = options.render.fillStyle
			context.fill()
		}

		context.stroke()
	}

	function loop() {
		requestAnimationFrame(loop)
		//get the waveform valeus and draw it
		var waveformValues = waveformUI.audioNode.getValue()
		drawWaveform(waveformValues)
	}
	loop()

	return waveformUI
}
