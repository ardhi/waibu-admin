const model = {
  method: ['GET', 'POST'],
  handler: async function (req, reply) {
    return reply.redirectTo(`waibuAdmin:/model/${req.params.model}/list`)
  }
}

export default model
