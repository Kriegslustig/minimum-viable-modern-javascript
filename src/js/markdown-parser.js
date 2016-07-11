import showdown from 'showdown'

const converter = new showdown.Converter()

const convertMarkdown = el => {
  const html = converter.makeHtml(el.innerHTML)
  el.innerHTML = html
  return html
}

module.exports = parent =>
  Array.from(
    parent.querySelectorAll('section.markdown')
  ).map(convertMarkdown)

