const home = {
  method: 'GET',
  handler: async function (req, reply) {
    return reply.view('waibuAdmin.template:/home.html')
  }
}

export default home
