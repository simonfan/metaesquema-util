const EventEmitter = require('events')

class MetaesquemaPlayer extends EventEmitter {
	constructor () {
		this.isPlaying = false
		this.isMuted = false
		this.volume = 0
	}

	play () {

	}

	pause () {

	}

	mute () {

	}

	unmute () {
		this.isMuted = false
		this.emit('unmute')
	}

	setVolume (value) {
		this.volume = value

		this.emit('volume-changed')
	}
}

module.exports = MetaesquemaPlayer
