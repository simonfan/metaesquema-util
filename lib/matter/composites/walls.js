const Matter = require('matter-js')

/**
 * Creates a wall composite
 * @param  {Object}   options
 * @param  {Number}   - x          Walls center X
 * @param  {Number}   - y          Walls center Y
 * @param  {Number}   - areaWidth  Walled area width
 * @param  {Number}   - areaHeight Walled area height
 * @param  {Number}   - wallWidth  Each wall's width
 * @param  {Function} callback     Function that creates a body
 * @return {Matter.Composite}
 */
function createWallsComposite(options, callback) {
	let wallsComposite = Matter.Composite.create({ label: 'Walls' })

	let wallsSpecs = [
		{
			position: 'top',
			x: options.x,
			y: options.y - (options.areaHeight / 2) - (options.wallWidth / 2),
			width: options.areaWidth,
			height: options.wallWidth,
		},
		{
			position: 'bottom',
			x: options.x,
			y: options.y + (options.areaHeight / 2) + (options.wallWidth / 2),
			width: options.areaWidth,
			height: options.wallWidth,
		},
		{
			position: 'left',
			x: options.x - (options.areaWidth / 2) - (options.wallWidth / 2),
			y: options.y,
			width: options.wallWidth,
			height: options.areaHeight
		},
		{
			position: 'right',
			x: options.x + (options.areaWidth / 2) + (options.wallWidth / 2),
			y: options.y,
			width: options.wallWidth,
			height: options.areaHeight
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
