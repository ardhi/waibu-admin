async function crudSkel (model, req, reply, { tpl, layoutTpl, title, options } = {}) {
  const { importModule } = this.app.bajo
  const handler = await importModule('waibuDb:/lib/crud/all-handler.js')
  const { action } = req.params
  const template = tpl ?? `waibuAdmin.template:/crud/${action}.html`
  const layout = layoutTpl ?? `waibuAdmin.layout:/crud/${action === 'list' ? 'wide' : 'default'}.html`
  const params = { page: { layout, title } }
  return handler.call(this.app.waibuDb, { model, req, reply, action, params, template, options })
}

export default crudSkel
