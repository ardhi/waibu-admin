const home = {
  method: 'GET',
  handler: async function (req, reply) {
    return reply.view('waibuAdmin.template:/dashboard.html')
  }
}

export default home
