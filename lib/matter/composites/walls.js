const Matter = require('matter-js')

/**
 * Creates a wall composite
 * @param  {Object}   options
 * @param  {Number}   - x          Walls center X
 * @param  {Number}   - y          Walls center Y
 * @param  {Number}   - width      Walled area width
 * @param  {Number}   - height     Walled area height
 * @param  {Number}   - wallThickness  Each wall's thickness
 * @param  {Function} callback     Function that creates a body
 * @return {Matter.Composite}
 */
function createWallsComposite(options, callback) {
	if (typeof options.x !== 'number') {
		throw new TypeError('invalid options.x')
	}
	if (typeof options.y !== 'number') {
		throw new TypeError('invalid options.y')
	}
	if (typeof options.width !== 'number') {
		throw new TypeError('invalid options.width')
	}
	if (typeof options.height !== 'number') {
		throw new TypeError('invalid options.height')
	}
	if (typeof options.wallThickness !== 'number') {
		throw new TypeError('invalid options.wallThickness')
	}

	let wallsComposite = Matter.Composite.create({ label: 'Walls' })

	let wallsSpecs = [
		{
			position: 'top',
			x: options.x,
			y: options.y - (options.height / 2) - (options.wallThickness / 2),
			width: options.width,
			height: options.wallThickness,
		},
		{
			position: 'bottom',
			x: options.x,
			y: options.y + (options.height / 2) + (options.wallThickness / 2),
			width: options.width,
			height: options.wallThickness,
		},
		{
			position: 'left',
			x: options.x - (options.width / 2) - (options.wallThickness / 2),
			y: options.y,
			width: options.wallThickness,
			height: options.height
		},
		{
			position: 'right',
			x: options.x + (options.width / 2) + (options.wallThickness / 2),
			y: options.y,
			width: options.wallThickness,
			height: options.height
		}
	]

	wallsSpecs.forEach(spec => {
		let body = callback(spec)

		if (body) {
			Matter.Composite.addBody(wallsComposite, body)
		}
	})

	return wallsComposite
}

module.exports = createWallsComposite
