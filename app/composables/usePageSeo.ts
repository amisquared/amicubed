import { SITE } from '~/utils/site'

interface PageSeoInput {
  title?: string | null
  description?: string | null
  image?: string | null
  type?: 'website' | 'article'
  path?: string
  publishedTime?: Date | string | null
  modifiedTime?: Date | string | null
  tags?: string[]
}

function toIso(value: Date | string | null | undefined) {
  if (!value) return undefined

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function usePageSeo(input: MaybeRefOrGetter<PageSeoInput> = {}) {
  const requestUrl = useRequestURL()

  const seo = computed(() => toValue(input))

  const pageTitle = computed(() => seo.value.title?.trim() || '')

  const title = computed(() =>
    pageTitle.value ? `${pageTitle.value} · ${SITE.name}` : SITE.name
  )

  const description = computed(
    () => seo.value.description?.trim() || SITE.description
  )

  const canonical = computed(() =>
    new URL(seo.value.path ?? requestUrl.pathname, requestUrl.origin).toString()
  )

  const hasCustomImage = computed(() => Boolean(seo.value.image))

  const image = computed(() =>
    new URL(
      seo.value.image || SITE.defaultOgImage.path,
      requestUrl.origin
    ).toString()
  )

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: () => seo.value.type ?? 'website',
    ogUrl: canonical,
    ogImage: image,
    ogImageAlt: title,
    ogImageWidth: () => (hasCustomImage.value ? undefined : SITE.defaultOgImage.width),
    ogImageHeight: () => (hasCustomImage.value ? undefined : SITE.defaultOgImage.height),
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    articlePublishedTime: () => toIso(seo.value.publishedTime),
    articleModifiedTime: () => toIso(seo.value.modifiedTime),
    articleTag: () => seo.value.tags
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }]
  })

  return { title, description, canonical, image }
}

export function useJsonLd(data: MaybeRefOrGetter<Record<string, unknown>>) {
  const json = computed(() =>
    JSON.stringify(toValue(data)).replace(/</g, '\\u003c')
  )

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: json
      }
    ]
  })
}