function buildModelMenu () {
  const { titleize, pascalCase } = this.app.bajo
  const { getAppTitle } = this.app.waibuMpa
  const { map, pick, groupBy, keys, kebabCase, filter, get } = this.app.bajo.lib._
  const schemas = filter(this.app.dobo.schemas, s => {
    const byGlobalExcludes = !this.config.model.excludes.includes(s.name)
    const byModelFind = !s.disabled.includes('find')
    let modelDisabled = get(this, `app.${s.ns}.config.waibuAdmin.modelDisabled`)
    if (modelDisabled) {
      const allModels = map(filter(this.app.dobo.schemas, { ns: s.ns }), 'name')
      if (modelDisabled === 'all') modelDisabled = allModels
      else modelDisabled = map(modelDisabled, m => pascalCase(`${this.app[s.ns].alias} ${m}`))
    } else modelDisabled = []
    const byAdminDisabled = !modelDisabled.includes(s.name)
    return byGlobalExcludes && byModelFind && byAdminDisabled
  })
  const omenu = groupBy(map(schemas, s => {
    const item = pick(s, ['name', 'ns'])
    item.nsTitle = getAppTitle(s.ns)
    return item
  }), 'nsTitle')
  const menu = []
  for (const k of keys(omenu).sort()) {
    const items = omenu[k]
    const plugin = this.app[items[0].ns]
    menu.push({
      name: k,
      children: map(items, item => {
        return {
          name: titleize(item.name.slice(plugin.alias.length)),
          id: kebabCase(item.name)
        }
      })
    })
  }
  return menu
}

export default buildModelMenu
