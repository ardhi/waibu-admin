const del = {
  method: 'POST',
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/delete-handler.js')
    return await handler.call(this, { req, reply })
  }
}

export default del
