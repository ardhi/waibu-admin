import buildModelMenu from '../../lib/build-model-menu.js'

async function afterBuildLocals (locals) {
  locals.menu = locals.menu ?? {}
  locals.menu.models = buildModelMenu.call(this)
}

export default afterBuildLocals
