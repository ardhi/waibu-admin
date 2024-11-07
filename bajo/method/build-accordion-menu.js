async function buildAccordionMenu (menus) {
  const dropdown = []
  dropdown.push('<div><c:accordion no-border text="nowrap" style="margin-top:-5px;margin-bottom:-5px;">')
  for (const menu of menus) {
    dropdown.push(`<c:accordion-item t:header="${menu.name}&nbsp;&nbsp;" no-padding narrow-header>`)
    dropdown.push('<c:list type="group" no-border hover>')
    for (const child of menu.children) {
      dropdown.push(`<c:list-item href="${child.href}" t:content="${child.name}" />`)
    }
    dropdown.push('</c:list></c:accordion-item>')
  }
  dropdown.push('</c:accordion></div>')
  return dropdown
}

export default buildAccordionMenu
