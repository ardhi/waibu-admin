async function handleNotFound (req) {
  const { getPluginByPrefix } = this.app.waibu
  const { find, isString, get } = this.app.bajo.lib._
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

export default handleNotFound
