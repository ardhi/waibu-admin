const home = {
  method: 'GET',
  handler: async function (req, reply) {
    return await reply.view('waibuAdmin.template:/dashboard.html')
  }
}

export default home
