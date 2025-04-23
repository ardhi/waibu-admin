async function modelSkel (model, req, reply, tpl) {
  const { importModule } = this.app.bajo
  const handler = await importModule('waibuDb:/lib/crud/all-handler.js')
  const { action } = req.params
  const template = tpl ?? `waibuAdmin.template:/crud/${action}.html`
  const params = { page: { layout: `waibuAdmin.layout:/crud/${action === 'list' ? 'wide' : 'default'}.html` } }
  return handler.call(this, { model, req, reply, action, params, template })
}

export default modelSkel
