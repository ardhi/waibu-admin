import preHandler from '../../../../lib/pre-handler.js'

const list = {
  method: ['GET', 'POST'],
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const listHandler = await importModule('waibuDb:/lib/crud/list-handler.js')
    return await listHandler.call(this, { req, reply })
  }
}

export default list
