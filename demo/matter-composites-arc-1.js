const Matter = require('matter-js')
const ME = require('../')

function setup(options) {
  const CANVAS_WIDTH = options.canvasWidth
  const CANVAS_HEIGHT = options.canvasHeight
  let canvas = options.canvas

  if (!canvas) {
    throw new Error('canvas is required')
  }
  
  if (!CANVAS_WIDTH) {
    throw new Error('CANVAS_WIDTH is required')
  }
  
  if (!CANVAS_HEIGHT) {
    throw new Error('CANVAS_HEIGHT is required')
  }

  let engine = Matter.Engine.create()

  let render = Matter.Render.create({
  	canvas: canvas,
  	engine: engine,
  	options: {
  		wireframes: false,
  		width: CANVAS_WIDTH,
  		height: CANVAS_HEIGHT,
  	}
  })

  /**
   * Run the engine
   */
  Matter.Runner.run(Matter.Runner.create(), engine)

  /**
   * Start rendering
   */
  Matter.Render.run(render)

  let START = 2 * Math.PI * 1/8
  let END = START + (2 * Math.PI) * 1/2

  let arc = ME.Matter.Composites.arc({
  	x: CANVAS_WIDTH / 2,
  	y: CANVAS_HEIGHT / 2,
  	radius: CANVAS_HEIGHT / 3,
  	startAngle: START,
  	endAngle: END,
  	sides: 100,
  }, (spec) => {

  	return Matter.Bodies.rectangle(
  		spec.x,
  		spec.y,
  		spec.arcPartLength * 2/3,
  		10,
  		{
  			angle: spec.angle,
  			isStatic: true,
  			render: {
  				fillStyle: 'red'
  			}
  		}
  	)

  })

  Matter.World.add(engine.world, arc)

  let body = Matter.Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 40, 40, {
  	render: {
  		fillStyle: 'red'
  	}
  })

  Matter.World.add(engine.world, body)

  // add mouse control
  let mouse = Matter.Mouse.create(render.canvas)
  let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      // allow bodies on mouse to rotate
      angularStiffness: 1,
      render: {
        visible: false
      }
    }
  })

  Matter.World.add(engine.world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;
}

setup({
	canvas: document.querySelector('canvas'),
	canvasWidth: window.innerWidth,
	canvasHeight: window.innerHeight,
})
