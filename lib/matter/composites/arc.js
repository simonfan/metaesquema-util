const Matter = require('matter-js')

/**
 * Arc composite
 * @param  {Number}   x          Arc center X
 * @param  {Number}   y          Arc center Y
 * @param  {Number}   radius     Arc radius
 * @param  {Number}   startAngle Arc start angle
 * @param  {Number}   endAngle   Arc end angle
 * @param  {Number}   sides      Number of sides of the arc
 * @param  {Function} callback   Function that returns the body.
 *                               args: (bodyX, bodyY, arcPartLenght, angle)
 * @return {Composite}
 */
function createArcComposite(x, y, radius, startAngle, endAngle, sides, callback) {
	if (sides < 3) {
		throw new Error('sides must be higher than 2')
	}

	let arcComposite = Matter.Composite.create({ label: 'Arc' })

	let theta = (endAngle - startAngle) / sides

	let arcInnerPoints = []
	let arcLastInnerPoint = {
		x: Math.cos(endAngle) * radius,
		y: Math.sin(endAngle) * radius
	}

	for (let i = 0; i < sides; i += 1) {
		let angle = startAngle + (i * theta)
		let innerX = Math.cos(angle) * radius
		let innerY = Math.sin(angle) * radius

		arcInnerPoints.push({
			x: innerX,
			y: innerY
		})
	}

	// there certainly is a mathematically more intelligent manner of doing this...
	let arcPartLength = Matter.Vector.magnitude(Matter.Vector.sub(arcInnerPoints[1], arcInnerPoints[0]))

	arcInnerPoints.forEach((point, index) => {
		let nextPoint = arcInnerPoints[index + 1] || arcLastInnerPoint

		let center = Matter.Vector.div(Matter.Vector.add(point, nextPoint), 2)

		let diff = Matter.Vector.sub(nextPoint, point)

		let body = callback(
			x + center.x,
			y + center.y,
			arcPartLength,
			Math.atan(diff.y / diff.x)
		)

		if (body) {
			Matter.Composite.addBody(arcComposite, body)
		}
	})

	return arcComposite
}

module.exports = createArcComposite
