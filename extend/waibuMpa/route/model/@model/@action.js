const action = {
  method: ['GET', 'POST'],
  title: 'Model Database',
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/all-handler.js')
    const { model, action } = req.params
    const template = `waibuAdmin.template:/model/${action}.html`
    return handler.call(this, { model, req, reply, action, template })
  }
}

export default action
