import preHandler from '../../../../lib/pre-handler.js'
import { buildParams } from './list.js'

const edit = {
  method: ['GET', 'POST'],
  preHandler,
  handler: async function (req, reply) {
    const { importModule } = this.app.bajo
    const handler = await importModule('waibuDb:/lib/crud/edit-handler.js')
    const params = buildParams.call(this, { req, reply, action: 'Edit' })
    return await handler.call(this, { req, reply, params, template: 'waibuAdmin.template:/model/edit.html' })
  }
}

export default edit
