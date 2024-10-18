function buildModelMenu () {
  const { titleize } = this.app.bajo
  const { map, pick, groupBy, keys, kebabCase, filter } = this.app.bajo.lib._
  const schemas = filter(this.app.dobo.schemas, s => {
    return !this.config.model.excludes.includes(s.name) && !s.disabled.includes('find')
  })
  const omenu = groupBy(map(schemas, s => {
    const item = pick(s, ['name', 'ns'])
    item.nsTitle = this.app[s.ns].title
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
