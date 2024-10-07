import preHandler from '../../../../lib/pre-handler.js'
export function buildParams (req, reply) {
  const page = {
    title: req.t('Model')
  }
  return { page }
}

const list = {
  method: ['GET', 'POST'],
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/list-handler.js')
    const params = buildParams.call(this, req, reply)
    return await handler.call(this, { req, reply, params })
  }
}

export default list
