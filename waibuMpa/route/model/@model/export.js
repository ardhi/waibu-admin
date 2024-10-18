import preHandler from '../../../../lib/pre-handler.js'

const dataExport = {
  method: 'POST',
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/export-handler.js')
    return await handler.call(this, { req, reply })
  }
}

export default dataExport
