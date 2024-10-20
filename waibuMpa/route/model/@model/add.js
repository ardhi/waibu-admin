import preHandler from '../../../../lib/pre-handler.js'
import { addOnsHandler, buildParams } from './list.js'

const add = {
  method: ['GET', 'POST'],
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/add-handler.js')
    const params = buildParams.call(this, { req, reply, action: 'Add' })
    return await handler.call(this, { req, reply, params, template: 'waibuAdmin.template:/model/add.html', addOnsHandler })
  }
}

export default add
