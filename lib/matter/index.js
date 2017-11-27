const Matter = require('matter-js')

/**
 * Create bodies for the walls
 */
exports.Bodies = {}
exports.Bodies.walls = function (options) {

	let WIDTH  = options.width
	let HEIGHT = options.height

	let wallDefaults = { isStatic: true }

	let top = Matter.Bodies.rectangle(
    WIDTH / 2, // align center to center
    -(60 / 2),         
    WIDTH, // width
    60,  // height
    Object.assign({}, wallDefaults, options.top)
  )

  let bottom = Matter.Bodies.rectangle(
    WIDTH / 2, // align center to center
    HEIGHT + (60 / 2),         
    WIDTH, // width
    60,  // height
    Object.assign({}, wallDefaults, options.bottom)
  )

  let left = Matter.Bodies.rectangle(
    -(60 / 2), // align center to center
    HEIGHT / 2,         
    60, // width
    HEIGHT,  // height
    Object.assign({}, wallDefaults, options.left)
  )

  let right = Matter.Bodies.rectangle(
    WIDTH + (60 / 2), // align center to center
    HEIGHT / 2,         
    60, // width
    HEIGHT,  // height
    Object.assign({}, wallDefaults, options.right)
  )

  return [top, bottom, left, right]
}

/**
 * Hacky way of running the engine even when the tab
 * is in the background
 */
exports.Runner = {}
exports.Runner.createMixedRunner = function () {
	let mixedRunner = {}

	mixedRunner.fallbackIntervalId = undefined
	mixedRunner.matterRunner = Matter.Runner.create()


	function run() {
		stop()

  	if (document.hasFocus()) {
    	Matter.Runner.run(mixedRunner.matterRunner, engine)
  	} else {

	    mixedRunner.fallbackIntervalId = setInterval(function() {
	      Engine.update(engine, 1000 / 60);
	    }, 1000 / 60);
  	}

	  window.addEventListener('blur', run)
	  window.addEventListener('focus', run)
	}

	function stop() {
  	if (mixedRunner.matterRunner.enabled) {
  		Matter.Runner.stop(mixedRunner.matterRunner)
  	}
  	
  	if (mixedRunner.fallbackIntervalId) {
  		clearInterval(mixedRunner.fallbackIntervalId)
  		mixedRunner.fallbackIntervalId = undefined
  	}

  	window.removeEventListener('blur', run)
  	window.removeEventListener('focus', run)
	}

  mixedRunner.run = run
  mixedRunner.stop = stop

  return mixedRunner
}
