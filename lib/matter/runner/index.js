const Matter = require('matter-js')

/**
 * Hacky way of running the engine even when the tab
 * is in the background
 */
exports.createMixedRunner = function (engine) {
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