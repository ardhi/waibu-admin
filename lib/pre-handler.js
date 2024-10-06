// import buildCollMenu from '../build-coll-menu.js'
// import buildPagesMenu from '../build-pages-menu.js'

async function preHandler (req, reply) {
  req.menu = req.menu ?? {}
  // req.menu.coll = await buildCollMenu.call(this)
  // req.menu.pages = buildPagesMenu.call(this)
}

export default preHandler
