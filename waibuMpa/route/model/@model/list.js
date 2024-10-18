import preHandler from '../../../../lib/pre-handler.js'

export function buildParams ({ req, reply, action }) {
  const { kebabCase, map, upperFirst } = this.app.bajo.lib._
  const modelTitle = map(kebabCase(req.params.model).split('-'), n => upperFirst(n)).join(' ')
  const page = {
    title: req.t('Model'),
    modelTitle
  }
  const breadcrumb = [
    { icon: 'house', href: 'waibuAdmin:/' },
    { content: 'Model', href: 'waibuAdmin:/model' },
    { content: modelTitle, href: `waibuAdmin:/model/${req.params.model}/list`, hrefRebuild: ['list', 'id', 'mode'] },
    { content: action }
  ]
  return { page, breadcrumb }
}

export async function addOnsHandler ({ req, reply, data, schema }) {
  const { base64JsonEncode } = this.app.waibuMpa
  const { statAggregate } = this.app.waibuDb
  const options = { field: '*', aggregate: 'count' }
  // return await statAggregate({ model: schema.name, req, reply, options })
  const option = base64JsonEncode({
    xAxis: {
      data: ['Satu', 'Dua', 'Tiga']
    },
    series: [{
      type: 'bar',
      data: [10, 20, 15]
    }]
  })
  return [{
    data: { option },
    resource: 'waibuDb.template:/partial/echarts-window.html'
  }, {
    data: { option },
    resource: 'waibuDb.template:/partial/echarts-window.html'
  }]
}

const list = {
  method: ['GET', 'POST'],
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/list-handler.js')
    const params = buildParams.call(this, { req, reply, action: 'List' })
    return await handler.call(this, { req, reply, params, template: 'waibuAdmin.template:/model/list.html', addOnsHandler })
  }
}

export default list
