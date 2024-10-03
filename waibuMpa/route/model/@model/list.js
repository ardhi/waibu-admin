import listHandler from '../../../../lib/crud/list-handler.js'
import preHandler from '../../../../lib/crud/pre-handler.js'

const list = {
  method: 'GET',
  preHandler,
  handler: async function (req, reply) {
    return await listHandler.call(this, { req, reply })
  }
}

export default list
