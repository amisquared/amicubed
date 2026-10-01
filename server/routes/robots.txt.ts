export default defineEventHandler((event) => {
  const { origin } = getRequestURL(event)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return `User-Agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
})