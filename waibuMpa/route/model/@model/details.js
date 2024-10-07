import preHandler from '../../../../lib/pre-handler.js'
import { buildParams } from './list.js'

const list = {
  method: 'GET',
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/details-handler.js')
    const params = buildParams.call(this, req, reply)
    return await handler.call(this, { req, reply, params })
  }
}

export default list
