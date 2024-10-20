import preHandler from '../../../../lib/pre-handler.js'
import { addOnsHandler, buildParams } from './list.js'

const details = {
  method: 'GET',
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/details-handler.js')
    const params = buildParams.call(this, { req, reply, action: 'Details' })
    return await handler.call(this, { req, reply, params, template: 'waibuAdmin.template:/model/details.html', addOnsHandler })
  }
}

export default details
