const Matter = require('matter-js')

exports.Composites = require('./composites')

/**
 * Create bodies for the walls
 */
exports.Bodies = {}
exports.Bodies.walls = (canvas) => {
  return {
    top: (options) => {
      return Matter.Bodies.rectangle(
        canvas.width / 2, // align center to center
        -(60 / 2),         
        canvas.width, // width
        60,  // height
        Object.assign({}, { isStatic: true }, options)
      )
    },

    bottom: (options) => {
      return Matter.Bodies.rectangle(
        canvas.width / 2, // align center to center
        canvas.height + (60 / 2),         
        canvas.width, // width
        60,  // height
        Object.assign({}, { isStatic: true }, options)
      )
    },

    left: (options) => {
      return Matter.Bodies.rectangle(
        -(60 / 2), // align center to center
        canvas.height / 2,         
        60, // width
        canvas.height,  // height
        Object.assign({}, { isStatic: true }, options)
      )
    },

    right: (options) => {
      return Matter.Bodies.rectangle(
        canvas.width + (60 / 2), // align center to center
        canvas.height / 2,         
        60, // width
        canvas.height,  // height
        Object.assign({}, { isStatic: true }, options)
      )
    }
  }
}

/**
 * Hacky way of running the engine even when the tab
 * is in the background
 */
exports.Runner = {}
exports.Runner.createMixedRunner = function (engine) {
  let mixedRunner = {}

  mixedRunner.fallbackIntervalId = undefined
  mixedRunner.matterRunner = Matter.Runner.create()


  function run() {
    stop()

    if (document.hasFocus()) {
      Matter.Runner.run(mixedRunner.matterRunner, engine)
    } else {

      mixedRunner.fallbackIntervalId = setInterval(function() {
        Matter.Engine.update(engine, 1000 / 60);
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

exports.Plugins = {}
exports.Plugins.maxVelocity = function (options) {

  let plugin = {
    name: 'matter-max-velocity',
    version: '0.0.0',
    for: 'matter-js@^0.12.0'
  }

  let maxVelocity = options.maxVelocity
  if (typeof maxVelocity === 'number') {
    maxVelocity = {
      x: maxVelocity,
      y: maxVelocity,
    }
  }

  let MAX_VELOCITY_X = maxVelocity.x
  let MAX_VELOCITY_Y = maxVelocity.y
  
  plugin.install = (Matter) => {

    Matter.after('Engine.create', function () {
      let engine = this

      /**
       * TODO: calculate collision impact
       * As suggested at
       * https://github.com/liabru/matter-js/issues/155
       */
      Matter.Events.on(engine, 'afterUpdate', e => {
        engine.world.bodies.forEach(function (body) {

          let changed = false

          let clampedVelocity = Object.assign({}, body.velocity)

          if (Math.abs(body.velocity.x) > MAX_VELOCITY_X) {
            changed = true
            clampedVelocity.x = body.velocity.x > 0 ? MAX_VELOCITY_X : -1 * MAX_VELOCITY_X
          }

          if (Math.abs(body.velocity.y) > MAX_VELOCITY_Y) {
            changed = true
            clampedVelocity.y = body.velocity.y > 0 ? MAX_VELOCITY_Y : -1 * MAX_VELOCITY_Y
          }

          if (changed) {
            Matter.Body.setVelocity(body, clampedVelocity)
          }
        })
      })
    })
  }

  return plugin
}
