async function buildAccordionMenu (menus, locals, req) {
  const { routePath } = this.app.waibu
  const dropdown = []
  dropdown.push('<div><c:accordion no-border text="nowrap" style="margin-top:-5px;margin-bottom:-5px;">')
  for (const menu of menus) {
    const items = []
    items.push('<c:list type="group" no-border hover>')
    let hasActive = false
    for (const child of menu.children) {
      const active = locals._meta.url === routePath(child.href)
      if (active) hasActive = true
      items.push(`<c:list-item href="${child.href}" t:content="${child.name}" ${active ? 'active' : ''} />`)
    }
    items.push('</c:list></c:accordion-item>')
    items.unshift(`<c:accordion-item t:header="${menu.name}&nbsp;&nbsp;" body-no-padding narrow-header ${hasActive ? 'show-on-start' : ''}>`)
    dropdown.push(...items)
  }
  dropdown.push('</c:accordion></div>')
  return dropdown
}

export default buildAccordionMenu
