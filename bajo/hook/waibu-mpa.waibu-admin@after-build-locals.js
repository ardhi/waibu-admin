async function afterBuildLocals (locals, req) {
  const { callHandler } = this.app.bajo
  const { routePath } = this.app.waibu
  const { getAppTitle } = this.app.waibuMpa
  const { get, isString, last } = this.lib._
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
    if (!r.config.subRoute) continue
    const [,, prefix, item] = url.split('/')
    const title = req.t(get(r, 'config.title', item))
    const menuHandler = get(this, `app.${r.config.subRoute}.config.waibuAdmin.menuHandler`)
    if (menuHandler === false) continue
    if (!route[r.config.subRoute]) {
      route[r.config.subRoute] = {
        icon: get(this, `app.${r.config.subRoute}.config.waibuMpa.icon`, 'grid'),
        dropdown: true,
        ohref: routePath(`${this.name}:/${prefix}`),
        html: [
          `<c:dropdown-item header t:content="${getAppTitle(r.config.subRoute)}" />`,
          '<c:dropdown-item divider />'
        ]
      }
      if (menuHandler) {
        route[r.config.subRoute]['dropdown-auto-close'] = 'outside'
        const menu = await callHandler(menuHandler, locals, req)
        route[r.config.subRoute].html.push(...menu)
      }
    }
    if (!menuHandler) {
      const active = req.url.startsWith(url)
      route[r.config.subRoute].html.push(`<c:dropdown-item href="${url}" t:content="${title}" ${active ? 'active' : ''}/>`)
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
