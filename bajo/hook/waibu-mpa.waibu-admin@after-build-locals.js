import buildModelMenu from '../../lib/build-model-menu.js'

async function afterBuildLocals (locals, req) {
  const { routePath } = this.app.waibu
  const items = []
  locals.menu = locals.menu ?? {}
  locals.menu.models = buildModelMenu.call(this)
  const ddModels = ['<c:dropdown-item t:content="Model Database" header /><c:dropdown-item divider />']
  ddModels.push('<div><c:accordion no-border text="nowrap" style="margin-top:-5px;margin-bottom:-5px;">')
  for (const item of locals.menu.models) {
    ddModels.push(`<c:accordion-item header="${req.t(item.name)}&nbsp;&nbsp;" no-padding narrow-header>`)
    ddModels.push('<c:list type="group" no-border hover>')
    for (const child of item.children) {
      ddModels.push(`<c:list-item href="waibuAdmin:/model/${child.id}/list" t:content="${child.name}" />`)
    }
    ddModels.push('</c:list></c:accordion-item>')
  }
  ddModels.push('</c:accordion></div>')
  if (req.user) {
    items.push({ icon: 'person', tooltip: 'Your Profile', href: routePath('sumba:/profile') })
    items.push({ component: 'navDropdownSetting', bottom: true, 'icon-style': 'font-size: 1.5rem;' })
    items.push({ icon: 'database', dropdown: true, 'dropdown-auto-close': 'outside', ohref: routePath('waibuAdmin:/model'), html: ddModels.join('\n') })
  }
  for (const item of items) {
    if (locals._meta.url.startsWith(item.href ?? item.ohref)) item.active = true
  }
  locals.sidebar = items
}

export default afterBuildLocals
