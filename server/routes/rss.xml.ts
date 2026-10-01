import { SITE } from '~~/app/utils/site'
import { renderMinimarkHtml, minimarkSummary } from '../utils/minimark'
import { cdata, escapeXml } from '../utils/xml'

function toRfc822(value: unknown) {
  if (!value) return null

  const date = new Date(value as string)

  return Number.isNaN(date.getTime()) ? null : date.toUTCString()
}

export default defineEventHandler(async (event) => {
  const { origin } = getRequestURL(event)

  const posts = await queryCollection(event, 'blog')
    .select('path', 'title', 'description', 'date', 'tags', 'body', 'seo')
    .order('date', 'DESC')
    .all()

  const publishedDates = posts
    .map(post => toRfc822(post.date))
    .filter((date): date is string => date !== null)

  const lastBuildDate = publishedDates[0]

  const items = posts
    .map(post => {
      const url = `${origin}${post.path ?? ''}`
      const title = post.seo?.title ?? post.title ?? post.path ?? 'Untitled'
      const summary =
        post.seo?.description ??
        post.description ??
        minimarkSummary(post.body?.value)
      const pubDate = toRfc822(post.date)
      const categories = (post.tags ?? [])
        .map(tag => `      <category>${escapeXml(tag)}</category>`)
        .join('\n')

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>${pubDate ? `
      <pubDate>${pubDate}</pubDate>` : ''}
      <description>${escapeXml(summary)}</description>
      <dc:creator>${escapeXml(SITE.author)}</dc:creator>${categories ? `
${categories}` : ''}
      <content:encoded>${cdata(renderMinimarkHtml(post.body?.value))}</content:encoded>
    </item>`
    })
    .join('\n')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${escapeXml(`${origin}/`)}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en</language>${
      lastBuildDate ? `
    <lastBuildDate>${lastBuildDate}</lastBuildDate>` : ''
    }
    <atom:link href="${escapeXml(`${origin}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
})
