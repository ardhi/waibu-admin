import buildModelMenu from '../../lib/build-model-menu.js'

async function afterBuildLocals (locals, req) {
  const { routePath, getPluginByPrefix } = this.app.waibu
  const { getAppTitle } = this.app.waibuMpa
  const { set, get } = this.app.bajo.lib._
  const items = []
  if (!req.user) return
  items.push({ icon: 'speedometer', href: routePath('waibuAdmin:/dashboard') })
  // models
  set(locals, 'menu.models', buildModelMenu.call(this))
  const ddModels = ['<c:dropdown-item t:content="Model Database" header /><c:dropdown-item divider />']
  ddModels.push('<div><c:accordion no-border text="nowrap" style="margin-top:-5px;margin-bottom:-5px;">')
  for (const item of locals.menu.models) {
    ddModels.push(`<c:accordion-item t:header="${item.name}&nbsp;&nbsp;" no-padding narrow-header>`)
    ddModels.push('<c:list type="group" no-border hover>')
    for (const child of item.children) {
      ddModels.push(`<c:list-item href="waibuAdmin:/model/${child.id}/list" t:content="${child.name}" />`)
    }
    ddModels.push('</c:list></c:accordion-item>')
  }
  ddModels.push('</c:accordion></div>')
  items.push({ icon: 'database', dropdown: true, 'dropdown-auto-close': 'outside', ohref: routePath('waibuAdmin:/model'), html: ddModels.join('\n') })
  // scan subroutes
  const route = {}
  for (const r of this.app.waibu.routes) {
    if (r.method === 'GET' && get(r, 'config.webApp') === 'waibuMpa' && get(r, 'config.ns') === this.name) {
      const [,, prefix, item] = r.url.split('/')
      const plugin = getPluginByPrefix(prefix)
      if (plugin) {
        const title = get(r, 'config.title', item)
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
        }
        route[plugin.name].html.push(`<c:dropdown-item href="${r.url}" t:content="${title}" />`)
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
