const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
])

const DROPPED_ELEMENTS = new Set(['script', 'style', 'template'])

const ATTRIBUTE_NAMES: Record<string, string> = {
  className: 'class',
  htmlFor: 'for',
  tabIndex: 'tabindex'
}

function kebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function attributeName(name: string) {
  if (name.startsWith('__')) return undefined

  const mapped = ATTRIBUTE_NAMES[name]

  if (mapped) return mapped

  if (name.startsWith('aria')) return `aria-${name.slice(4).toLowerCase()}`

  if (name.startsWith('data')) return `data-${kebabCase(name.slice(4))}`

  return name
}

function attributeValue(value: unknown) {
  if (value === null || value === undefined || value === false) return undefined
  if (value === true) return ''

  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string').join(' ') || undefined
  }

  return String(value)
}

function classTokens(value: unknown) {
  if (typeof value === 'string') return value.split(/\s+/)
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  return []
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function escapeText(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderAttributes(props: unknown) {
  if (!props || typeof props !== 'object' || Array.isArray(props)) return ''

  let attributes = ''

  for (const [key, raw] of Object.entries(props as Record<string, unknown>)) {
    if (key === 'code') continue

    const name = attributeName(key)
    if (!name) continue

    const value = attributeValue(raw)
    if (value === undefined) continue

    attributes += value === '' ? ` ${name}` : ` ${name}="${escapeAttribute(value)}"`
  }

  return attributes
}

function renderPre(props: unknown, children: unknown[]) {
  const source = (props as { code?: unknown } | null | undefined)?.code

  const language = classTokens(
    (props as { className?: unknown } | null | undefined)?.className
  ).find(token => token.startsWith('language-'))

  if (typeof source === 'string') {
    const attributes = language ? ` class="${escapeAttribute(language)}"` : ''

    return `<pre><code${attributes}>${escapeText(source)}</code></pre>`
  }

  return `<pre>${children.map(renderNode).join('')}</pre>`
}

function renderNode(node: unknown): string {
  if (typeof node === 'string') return escapeText(node)
  if (!Array.isArray(node)) return ''

  const [tag, props, ...children] = node as [
    unknown,
    Record<string, unknown>?,
    ...unknown[]
  ]

  if (typeof tag !== 'string') return children.map(renderNode).join('')
  if (DROPPED_ELEMENTS.has(tag)) return ''
  if (tag === 'pre') return renderPre(props, children)

  const attributes = renderAttributes(props)
  const inner = children.map(renderNode).join('')

  if (VOID_ELEMENTS.has(tag)) return `<${tag}${attributes} />`

  return `<${tag}${attributes}>${inner}</${tag}>`
}

function textNode(node: unknown): string {
  if (typeof node === 'string') return node
  if (!Array.isArray(node)) return ''

  return node.slice(2).map(textNode).join(' ')
}

export function renderMinimarkHtml(nodes: unknown) {
  if (Array.isArray(nodes)) return nodes.map(renderNode).join('')

  return renderNode(nodes)
}

export function minimarkText(nodes: unknown) {
  if (Array.isArray(nodes)) return nodes.map(textNode).join(' ')

  return textNode(nodes)
}

export function minimarkSummary(nodes: unknown, limit = 300) {
  const text = minimarkText(nodes).replace(/\s+/g, ' ').trim()

  if (text.length <= limit) return text

  const truncated = text.slice(0, limit)

  return `${truncated.slice(0, Math.max(truncated.lastIndexOf(' '), 0))}…`
}
