import showdown from 'showdown'

const converter = new showdown.Converter()

const convertMarkdown = el => {
  const html = converter.makeHtml(el.textContent)
  el.innerHTML = html
  return html
}

module.exports = parent => {
  const sections = Array.from(parent.querySelectorAll('main'))
  const notes = Array.from(parent.querySelectorAll('aside'))
  const elements = notes.concat(sections)
  return elements.map(convertMarkdown)
}

