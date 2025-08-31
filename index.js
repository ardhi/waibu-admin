async function factory (pkgName) {
  const me = this

  class WaibuAdmin extends this.app.pluginClass.base {
    static alias = 'wa'
    static dependencies = ['waibu-db', 'waibu-mpa', 'waibu-extra']

    constructor () {
      super(pkgName, me.app)
      this.config = {
        waibu: {
          title: 'Admin',
          prefix: 'admin'
        },
        waibuMpa: {
          home: 'waibuAdmin:/dashboard',
          redirect: {
            '/': 'waibuAdmin:/dashboard',
            '/*': 'waibuAdmin:handleNotFound'
          }
        }
      }
    }

    buildAccordionMenu = async (menus, locals, req) => {
      const { routePath } = this.app.waibu
      const dropdown = []
      dropdown.push('<div><c:accordion no-border text="nowrap" style="margin-top:-5px;margin-bottom:-5px;">')
      for (const menu of menus) {
        const items = []
        items.push('<c:list type="group" no-border hover>')
        let hasActive = false
        for (const child of menu.children) {
          if (child.title === '-') continue
          const active = locals._meta.url === routePath(child.href)
          if (active) hasActive = true
          items.push(`<c:list-item href="${child.href}" t:content="${child.title}" ${active ? 'active' : ''} />`)
        }
        items.push('</c:list></c:accordion-item>')
        items.unshift(`<c:accordion-item header="${req.t(menu.title)}&nbsp;&nbsp;" body-no-padding narrow-header ${hasActive ? 'show-on-start' : ''}>`)
        dropdown.push(...items)
      }
      dropdown.push('</c:accordion></div>')
      return dropdown
    }

    handleNotFound = async (req) => {
      const { getPluginByPrefix } = this.app.waibu
      const { find, isString, get } = this.app.lib._
      const [, appPrefix, prefix] = req.url.split('/')
      const plugin = getPluginByPrefix(prefix)
      const appPlugin = getPluginByPrefix(appPrefix)
      let url
      if (plugin) {
        const route = find(this.app.waibu.routes, r => {
          const methods = isString(r.method) ? [r.method] : r.method
          return get(r, 'config.subRoute') === plugin.name && methods.includes('GET') &&
            get(r, 'config.webApp') === 'waibuMpa' &&
            get(r, 'config.ns') === appPlugin.name
        })
        if (route) url = route.url.replace('/:action', '/list').replace('/:model/', '/cdb-country/')
      }
      return url
    }
  }

  return WaibuAdmin
}

export default factory
