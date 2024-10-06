import preHandler from '../../../../lib/pre-handler.js'

const list = {
  method: 'GET',
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/details-handler.js')
    return await handler.call(this, { req, reply })
  }
}

export default list
