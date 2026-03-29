async function afterBuildLocals (locals, req) {
  const { callHandler, runHook } = this.app.bajo
  const { getPluginPrefix } = this.app.waibu
  const { routePath } = this.app.waibu
  const { getPluginTitle } = this.app.waibuMpa
  const { get, isString, last, camelCase, cloneDeep, isFunction } = this.app.lib._
  const items = []
  items.push({ icon: 'speedometer', href: routePath('waibuAdmin:/dashboard') })
  // scan subroutes
  const route = {}
  const interSites = []
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
      if (menuHandler) {
        const cprefix = getPluginPrefix(r.config.subRoute)
        route[r.config.subRoute]['dropdown-auto-close'] = 'outside'
        let menu
        if (isString(menuHandler)) menu = await callHandler(menuHandler, locals, req)
        else if (isFunction(menuHandler)) menu = await menuHandler.call(this.app[r.config.subRoute], locals, req)
        else menu = cloneDeep(menuHandler)
        await runHook(`${r.config.subRoute}:afterAdminMenu`, menu, locals, req)
        for (const m of menu) {
          if (m.children) {
            for (const c of m.children) {
              if (c.href) c.href = c.href.replace('{prefix}', cprefix)
            }
          }
        }
        const all = []
        for (const m of menu) {
          if (m.interSite) {
            // m.ns = r.config.subRoute
            // m.ohref = routePath(`${this.ns}:/${prefix}`)
            interSites.push(m)
          } else {
            if (m.children) {
              const item = this.buildAccordionMenu(m, locals, req)
              if (all.length > 0) all.push('<c:dropdown-item divider />')
              all.push(item)
            } else {
              if (m.title === '-') all.push('<c:dropdown-item divider />')
              else {
                const url = routePath(m.href)
                all.push(`<c:dropdown-item href="${url}" t:content="${m.title}"/>`)
              }
            }
          }
        }
        route[r.config.subRoute].html.push(...all)
      }
    }
    if (!menuHandler) {
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
  // Inter sites routes
  if (req.user.interSiteAdmin) {
    const all = [
      '<c:dropdown-item header t:content="interSite" />',
      '<c:dropdown-item divider />'
    ]
    for (const m of interSites) {
      if (m.children) {
        const item = this.buildAccordionMenu(m, locals, req)
        if (all.length > 0) all.push('<c:dropdown-ioiltem divider />')
        all.push(item)
      } else {
        if (m.title === '-') all.push('<c:dropdown-item divider />')
        else {
          const url = routePath(m.href)
          all.push(`<c:dropdown-item href="${url}" t:content="${m.title}"/>`)
        }
      }
    }
    items.push({
      title: 'interSite',
      bottom: true,
      interSite: true,
      icon: 'share',
      'dropdown-auto-close': 'outside',
      dropdown: true,
      html: all.join('\n')
    })
  }
  items.push({ component: 'navDropdownSetting', bottom: true, 'icon-style': 'font-size: 1.5rem;' })

  for (const item of items) {
    const url = item.href ?? item.ohref
    if (!locals._meta.url.includes('/_is_/')) {
      if (locals._meta.url.startsWith(url)) item.active = true
    } else if (item.interSite) item.active = true
  }
  locals.sidebar = items
}

export default afterBuildLocals
