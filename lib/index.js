exports.Matter = require('./matter')
exports.Tone = require('./tone')

function MetaArray(items, options) {

}

function Loop(items, startAt) {
	this.items = items
	this.lastIndex = items.length - 1
	this.nextIndex = startAt || 0
}

Loop.prototype.next = function () {
	let item = this.items[this.nextIndex]
	this.nextIndex = this.nextIndex >= this.lastIndex ? 0 : this.nextIndex + 1

	return item
}

exports.Array = {}
exports.Array.Loop = Loop