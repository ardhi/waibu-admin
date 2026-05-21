const dashboard = {
  method: 'GET',
  xSite: true,
  handler: async function (req, reply) {
    return await reply.view('waibuAdmin.template:/dashboard.html')
  }
}

export default dashboard
