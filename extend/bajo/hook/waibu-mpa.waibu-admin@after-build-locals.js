async function afterBuildLocals (locals, req, opts) {
  if (opts.partial) return
  const { callHandler, runHook } = this.app.bajo
  const { getPluginPrefix } = this.app.waibu
  const { routePath, findRoute } = this.app.waibu
  const { getPluginTitle } = this.app.waibuMpa
  const { get, isString, last, camelCase, cloneDeep, isFunction } = this.app.lib._
  const items = []
  items.push({ icon: 'speedometer', href: routePath('waibuAdmin:/dashboard') })
  // scan subroutes
  const route = {}
  for (const r of this.app.waibu.routes) {
    const methods = isString(r.method) ? [r.method] : r.method
    if (!(methods.includes('GET') && get(r, 'config.webApp') === 'waibuMpa' && get(r, 'config.ns') === this.ns)) continue
    let url = r.url
    const parts = url.split('/')
    if (last(parts) === ':action') {
      parts.pop()
      parts.push('list')
      url = parts.join('/')
    }
    if (!r.config.subRoute) continue
    const [,, prefix, item] = url.split('/')
    const title = req.t(get(r, 'config.title', req.t(camelCase(item))))
    const menuHandler = get(this, `app.${r.config.subRoute}.config.waibuAdmin.menuHandler`)
    if (menuHandler === false) continue
    if (!route[r.config.subRoute]) {
      if (menuHandler) {
        const cprefix = getPluginPrefix(r.config.subRoute)
        let menu
        if (isString(menuHandler)) menu = await callHandler(menuHandler, locals, req)
        else if (isFunction(menuHandler)) menu = await menuHandler.call(this.app[r.config.subRoute], locals, req)
        else menu = cloneDeep(menuHandler)
        await runHook(`${r.config.subRoute}:afterAdminMenu`, menu, locals, req)
        const all = []
        for (const m of menu) {
          if (m.children) {
            m.children = m.children.filter(c => {
              const route = findRoute(c.href)
              if (!route) return false
              c.href = c.href.replace('{prefix}', cprefix) // TODO: need observation
              if (get(route, 'config.xSite')) return req.user.isXSiteAdmin
              return req.user.isAdmin
            })
            if (m.children.length === 0) continue
            const item = this.buildAccordionMenu(m, locals, req)
            if (all.length > 0) all.push('<c:dropdown-item divider />')
            all.push(item)
          } else {
            const route = findRoute(m.href)
            if (!route) continue
            if (get(route, 'config.xSite') && !req.user.isXSiteAdmin) continue
            if (!req.user.isAdmin) continue
            if (m.title === '-') all.push('<c:dropdown-item divider />')
            else {
              const href = routePath(m.href, { params: m.params })
              all.push(`<c:dropdown-item href="${href}" t:content="${m.title}"/>`)
            }
          }
        }
        if (all.length > 0) {
          route[r.config.subRoute] = {
            icon: get(this, `app.${r.config.subRoute}.config.waibuMpa.icon`, 'grid'),
            dropdown: true,
            ns: r.config.subRoute,
            ohref: routePath(`${this.ns}:/${prefix}`),
            html: [
              `<c:dropdown-item header t:content="${getPluginTitle(r.config.subRoute, req)}" />`,
              '<c:dropdown-item divider />'
            ]
          }
          route[r.config.subRoute]['dropdown-auto-close'] = 'outside'
          route[r.config.subRoute].html.push(...all)
        }
      }
    }
    if (!menuHandler && route[r.config.subRoute]) {
      const active = req.url.startsWith(url)
      route[r.config.subRoute].html.push(`<c:dropdown-item href="${url}" t:content="${title}" ${active ? 'active' : ''}/>`)
    }
  }
  for (const r in route) {
    const item = route[r]
    if (item.ns) item.title = getPluginTitle(item.ns, req)
    item.html = item.html.join('\n')
    items.push(item)
  }
  // bottom
  items.push({ component: 'navDropdownSetting', bottom: true, 'icon-style': 'font-size: 1.5rem;' })
  locals.sidebar = items
}

export default afterBuildLocals
