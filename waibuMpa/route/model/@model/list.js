export function buildParams ({ req, reply, action }) {
  const { camelCase, kebabCase, map, upperFirst } = this.app.bajo.lib._
  const { getSchema } = this.app.dobo
  const [alias, ...names] = map(kebabCase(req.params.model).split('-'), n => upperFirst(n))
  const schema = getSchema(camelCase(req.params.model), false)
  const modelTitle = this.app[schema.ns].title + ': ' + names.join(' ')
  const modelTitleShort = alias + ' ' + names.join(' ')
  const page = {
    title: req.t('Model'),
    modelTitle
  }
  const breadcrumb = [
    { icon: 'house', href: '/' },
    { content: 'Admin', href: 'waibuAdmin:/' },
    { content: 'Model', href: 'waibuAdmin:/model' },
    { content: modelTitleShort, href: `waibuAdmin:/model/${req.params.model}/list`, hrefRebuild: ['list', 'id', 'mode'] },
    { content: action }
  ]
  return { page, breadcrumb }
}

export async function addOnsHandler ({ req, reply, data, schema }) {
  const { base64JsonEncode } = this.app.waibuMpa
  const { statAggregate } = this.app.waibuDb
  const { get, map, pick, pullAt } = this.app.bajo.lib._
  const opts = map(get(schema, 'view.stat.aggregate', []), item => {
    const dbOpts = pick(item, ['fields', 'group', 'aggregate'])
    const name = item.name ?? `field.${item.fields[0]}`
    return { name, dbOpts }
  })
  if (opts.length === 0) return []
  const dropped = []
  for (const idx in opts) {
    const o = opts[idx]
    try {
      const resp = await statAggregate({ model: schema.name, req, reply, options: o.dbOpts })
      const data = []
      for (const d of resp.data) {
        const key = o.dbOpts.fields[0]
        data.push({
          name: d[key],
          value: d[key + 'Count']
        })
      }
      opts[idx].chartOpts = base64JsonEncode({
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'pie',
          data
        }]
      })
    } catch (err) {
      dropped.push(idx)
    }
  }
  if (dropped.length > 0) pullAt(opts, dropped)
  return map(opts, o => {
    return {
      data: { option: o.chartOpts, name: o.name },
      resource: 'waibuDb.template:/partial/echarts-window.html'
    }
  })
}

const list = {
  method: ['GET', 'POST'],
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/list-handler.js')
    const params = buildParams.call(this, { req, reply, action: 'List' })
    return await handler.call(this, { req, reply, params, template: 'waibuAdmin.template:/model/list.html', addOnsHandler })
  }
}

export default list
