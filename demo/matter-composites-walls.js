const Matter = require('matter-js')
const Meta = require('../')

function setup() {
  const CANVAS_WIDTH = window.innerWidth
  const CANVAS_HEIGHT =  window.innerHeight
  let canvas = document.querySelector('canvas')

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

  const WALL_COLORS = {
  	top: 'blue',
  	right: 'yellow',
  	bottom: 'red',
  	left: 'magenta',
  }

  let walls = Meta.Matter.Composites.walls(
  	{
  		x: CANVAS_WIDTH / 2,
  		y: CANVAS_HEIGHT / 2,
  		width: CANVAS_WIDTH - 200,
  		height: CANVAS_HEIGHT - 200,
  		wallThickness: 60,
  	},
  	(spec) => {
  		return Matter.Bodies.rectangle(spec.x, spec.y, spec.width, spec.height, {
  			isStatic: true,
  			render: {
  				fillStyle: WALL_COLORS[spec.position],
  			}
  		})
	  }
	)

  let body = Matter.Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 40, 40, {
  	render: {
  		fillStyle: 'green'
  	}
  })

  Matter.World.add(engine.world, walls)
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
}

setup()
