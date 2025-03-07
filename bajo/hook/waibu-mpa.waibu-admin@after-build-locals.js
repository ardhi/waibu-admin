async function afterBuildLocals (locals, req) {
  const { callHandler } = this.app.bajo
  const { routePath, getPluginByPrefix } = this.app.waibu
  const { getAppTitle } = this.app.waibuMpa
  const { get, isString, last } = this.app.bajo.lib._
  const items = []
  if (!req.user) return
  items.push({ icon: 'speedometer', href: routePath('waibuAdmin:/dashboard') })
  // scan subroutes
  const route = {}
  for (const r of this.app.waibu.routes) {
    const methods = isString(r.method) ? [r.method] : r.method
    if (!(methods.includes('GET') && get(r, 'config.webApp') === 'waibuMpa' && get(r, 'config.ns') === this.name)) continue
    let url = r.url
    const parts = url.split('/')
    if (last(parts) === ':action') {
      parts.pop()
      parts.push('list')
      url = parts.join('/')
    }
    const [,, prefix, item] = url.split('/')
    const plugin = getPluginByPrefix(prefix)
    if (plugin) {
      const title = req.t(get(r, 'config.title', item))
      const menuHandler = get(this, `app.${plugin.name}.config.waibuAdmin.menuHandler`)
      if (menuHandler === false) continue
      if (!route[plugin.name]) {
        route[plugin.name] = {
          icon: get(this, `app.${plugin.name}.config.waibuMpa.icon`, 'grid'),
          dropdown: true,
          ohref: routePath(`${this.name}:/${prefix}`),
          html: [
            `<c:dropdown-item header t:content="${getAppTitle(plugin.name)}" />`,
            '<c:dropdown-item divider />'
          ]
        }
        if (menuHandler) {
          route[plugin.name]['dropdown-auto-close'] = 'outside'
          const menu = await callHandler(this, menuHandler, locals, req)
          route[plugin.name].html.push(...menu)
        }
      }
      if (!menuHandler) {
        const active = req.url.startsWith(url)
        route[plugin.name].html.push(`<c:dropdown-item href="${url}" t:content="${title}" ${active ? 'active' : ''}/>`)
      }
    }
  }
  for (const r in route) {
    const item = route[r]
    item.html = item.html.join('\n')
    items.push(item)
  }
  // settings
  items.push({ component: 'navDropdownSetting', bottom: true, 'icon-style': 'font-size: 1.5rem;' })

  for (const item of items) {
    if (locals._meta.url.startsWith(item.href ?? item.ohref)) item.active = true
  }
  locals.sidebar = items
}

export default afterBuildLocals
