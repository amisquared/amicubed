import { escapeXml } from '../utils/xml'

export default defineEventHandler(async (event) => {
  const { origin } = getRequestURL(event)

  const posts = await queryCollection(event, 'blog')
    .select('path', 'date')
    .order('date', 'DESC')
    .all()

  const urls: Array<{ loc: string; lastmod?: string }> = [
    { loc: `${origin}/` },
    { loc: `${origin}/blog` },
    ...posts.map(post => {
      const lastmod = new Date(post.date)

      return {
        loc: `${origin}${post.path}`,
        lastmod: Number.isNaN(lastmod.getTime())
          ? undefined
          : lastmod.toISOString()
      }
    })
  ]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const body = urls
    .map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${escapeXml(loc)}</loc>${
          lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
        }\n  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})