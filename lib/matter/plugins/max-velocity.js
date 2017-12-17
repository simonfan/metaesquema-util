const Matter = require('matter-js')

module.exports = function matterMaxVelocity(options) {

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
