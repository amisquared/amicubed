<script lang="ts" setup>
import BaseLayout from '~/layouts/BaseLayout.vue';
import type { BlogPost } from '~/types/blog';
import { SITE } from '~/utils/site';

const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
  queryCollection('blog').path(route.path).first()
)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found',
    fatal: true
  })
}

const content = computed(() => post.value!)

const parsedDate = computed(() => {
  if (!post.value?.date) return null

  const date = new Date(post.value.date)

  return Number.isNaN(date.getTime()) ? null : date
})

const isoDate = computed(() => parsedDate.value?.toISOString())

const formattedDate = computed(() =>
  parsedDate.value?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

function collectNodeText(node: unknown): string {
  if (typeof node === 'string') return node

  if (!Array.isArray(node)) return ''

  const children = node.slice(2)

  return children.map(collectNodeText).join(' ')
}

function collectText(nodes: unknown): string {
  if (!Array.isArray(nodes)) return ''

  return nodes.map(collectNodeText).join(' ')
}

const readingWords = computed(
  () =>
    collectText(post.value?.body?.value)
      .trim()
      .split(/\s+/)
      .filter(Boolean).length
)

const readingMinutes = computed(() => Math.max(1, Math.round(readingWords.value / 200)))

const readingTime = computed(() => `${readingMinutes.value} min read`)

const { data: posts } = await useAsyncData('blog-order', () =>
  queryCollection('blog')
    .select('path', 'title', 'date')
    .order('date', 'DESC')
    .all()
)

const newerPost = computed<BlogPost | null>(() => {
  const index = posts.value?.findIndex(item => item.path === post.value?.path) ?? -1

  return index > 0 ? (posts.value?.[index - 1] ?? null) : null
})

const olderPost = computed<BlogPost | null>(() => {
  const list = posts.value ?? []
  const index = list.findIndex(item => item.path === post.value?.path)

  return index >= 0 && index < list.length - 1 ? (list[index + 1] ?? null) : null
})

const imageSrc = computed(() => post.value?.image?.trim() || undefined)
const imageFailed = ref(false)

watch(imageSrc, () => {
  imageFailed.value = false
})

const showCover = computed(() => Boolean(imageSrc.value) && !imageFailed.value)

const visibleTags = computed(() => post.value?.tags?.slice(0, 4) ?? [])

const hiddenTagCount = computed(() =>
  Math.max((post.value?.tags?.length ?? 0) - visibleTags.value.length, 0)
)

const { canonical, image: seoImage } = usePageSeo(() => ({
  title: post.value?.seo?.title ?? post.value?.title,
  description: post.value?.seo?.description ?? post.value?.description,
  image: imageSrc.value,
  type: 'article',
  publishedTime: post.value?.date,
  tags: post.value?.tags
}))

useJsonLd(() => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.value?.title,
  description: post.value?.description,
  image: [seoImage.value],
  datePublished: isoDate.value,
  dateModified: isoDate.value,
  url: canonical.value,
  keywords: (post.value?.tags ?? []).join(', '),
  wordCount: readingWords.value || undefined,
  timeRequired: `PT${readingMinutes.value}M`,
  author: {
    '@type': 'Person',
    name: SITE.author
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': canonical.value
  }
}))
</script>

<template>
  <BaseLayout>
    <template #header-start>
      <div class="post-header" :class="{ 'has-cover': showCover }">
        <h1 class="post-title">
          {{ post?.title }}
        </h1>

        <div v-if="formattedDate" class="post-meta">
          <time :datetime="isoDate">{{ formattedDate }}</time>
          <span class="post-meta-separator">·</span>
          <span>{{ readingTime }}</span>
        </div>

        <ul v-if="visibleTags.length" class="post-tags">
          <li v-for="tag in visibleTags" :key="tag" class="post-tag">
            {{ tag }}
          </li>
          <li v-if="hiddenTagCount" class="post-tag post-tag-count">
            +{{ hiddenTagCount }}
          </li>
        </ul>
      </div>
    </template>

    <template #header-end>
      <div v-if="showCover" class="post-cover">
        <img
          :src="imageSrc"
          alt=""
          loading="eager"
          @error="imageFailed = true"
        />
      </div>
    </template>

    <template #content>
      <div class="post-content">
        <NuxtLink to="/blog" class="post-pill">
          <UIcon name="mdi:arrow-left" class="post-pill-icon" />
          <span>All posts</span>
        </NuxtLink>

        <article class="post-prose">
          <ContentRenderer :value="content" />
        </article>

        <nav
          v-if="newerPost?.path || olderPost?.path"
          class="post-nav"
          aria-label="Post navigation"
        >
          <NuxtLink
            v-if="newerPost?.path"
            :to="newerPost.path"
            class="post-nav-item"
          >
            <UIcon name="mdi:chevron-left" class="post-nav-icon" />

            <span class="post-nav-body">
              <span class="post-nav-label">Newer post</span>
              <span class="post-nav-title">{{ newerPost.title }}</span>
            </span>
          </NuxtLink>

          <NuxtLink
            v-if="olderPost?.path"
            :to="olderPost.path"
            class="post-nav-item post-nav-item-end"
          >
            <span class="post-nav-body">
              <span class="post-nav-label">Older post</span>
              <span class="post-nav-title">{{ olderPost.title }}</span>
            </span>

            <UIcon name="mdi:chevron-right" class="post-nav-icon" />
          </NuxtLink>
        </nav>

        <div class="post-home">
          <NuxtLink to="/" class="post-pill">
            <UIcon name="mdi:home" class="post-pill-icon" />
            <span>Back to home</span>
          </NuxtLink>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<style scoped>
.post-title {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 2.25rem;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;

  margin: 0.25rem 0 0;

  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.post-meta-separator {
  color: var(--md-sys-color-outline);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;

  margin: 0.75rem 0 0;
  padding: 0;

  list-style: none;
}

.post-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;

  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);

  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
}

.post-tag-count {
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
}

.post-cover img {
  display: block;
  height: auto;
  border-radius: 12px;
  box-shadow:
    0 2px 4px rgb(0 0 0 / 10%),
    0 8px 16px rgb(0 0 0 / 8%);
}

.post-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-pill {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 0.5rem;

  min-height: 40px;
  padding: 0.5rem 1rem;

  border-radius: 999px;

  color: var(--md-sys-color-primary);
  text-decoration: none;

  font-size: 0.875rem;
  font-weight: 500;

  transition:
    background-color 150ms ease,
    color 150ms ease;
}

.post-pill:hover {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.post-pill:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.post-pill-icon {
  width: 18px;
  height: 18px;
}

.post-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;

  margin-top: 0.5rem;
  padding-top: 1.5rem;

  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.post-nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  min-height: 64px;
  padding: 0.75rem 1rem;
  box-sizing: border-box;

  border-radius: 16px;

  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);

  text-decoration: none;

  transition:
    background-color 150ms ease,
    box-shadow 150ms ease;
}

.post-nav-item:hover {
  background: var(--md-sys-color-surface-container-high);
  box-shadow:
    0 2px 6px rgb(0 0 0 / 10%),
    0 1px 2px rgb(0 0 0 / 12%);
}

.post-nav-item:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.post-nav-body {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  min-width: 0;
}

.post-nav-label {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
}

.post-nav-title {
  display: -webkit-box;
  overflow: hidden;

  color: var(--md-sys-color-on-surface);
  font-size: 0.875rem;
  line-height: 1.25rem;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.post-nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  color: var(--md-sys-color-on-surface-variant);
}

.post-nav-item-end {
  justify-content: flex-end;
  text-align: right;
}

.post-home {
  display: flex;
  justify-content: center;

  margin-top: 0.25rem;
}

.post-prose {
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  line-height: 1.625rem;
}

.post-prose :deep(h1),
.post-prose :deep(h2),
.post-prose :deep(h3) {
  margin: 2rem 0 0.75rem;
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
  line-height: 1.4;
}

.post-prose :deep(h1) {
  font-size: 1.375rem;
}

.post-prose :deep(h2) {
  font-size: 1.25rem;
}

.post-prose :deep(h3) {
  font-size: 1.0625rem;
}

.post-prose :deep(h1:first-child),
.post-prose :deep(h2:first-child),
.post-prose :deep(h3:first-child) {
  margin-top: 0;
}

.post-prose :deep(p) {
  margin: 0 0 1rem;
}

.post-prose :deep(a) {
  color: var(--md-sys-color-primary);
  text-decoration: none;
  border-bottom: 1px solid currentcolor;
}

.post-prose :deep(a:hover) {
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.post-prose :deep(strong) {
  font-weight: 600;
}

.post-prose :deep(ul),
.post-prose :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 1.5rem;
}

.post-prose :deep(li) {
  margin: 0.375rem 0;
}

.post-prose :deep(li::marker) {
  color: var(--md-sys-color-primary);
}

.post-prose :deep(blockquote) {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;

  border-left: 3px solid var(--md-sys-color-primary);
  border-radius: 0 12px 12px 0;

  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface-variant);
}

.post-prose :deep(blockquote > :last-child) {
  margin-bottom: 0;
}

.post-prose :deep(code) {
  padding: 0.125rem 0.375rem;

  border-radius: 6px;

  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);

  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8125rem;
}

.post-prose :deep(pre) {
  margin: 0 0 1rem;
  padding: 1rem;

  overflow-x: auto;

  border-radius: 16px;

  background: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);
}

.post-prose :deep(pre code) {
  padding: 0;

  background: none;
  font-size: 0.8125rem;
  line-height: 1.5rem;
}

.post-prose :deep(del) {
  color: var(--md-sys-color-on-surface-variant);
}

.post-prose :deep(sup) {
  font-size: 0.75em;
  line-height: 0;
}

.post-prose :deep(hr) {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.post-prose :deep(section.footnotes) {
  margin-top: 2rem;

  font-size: 0.875rem;
  line-height: 1.5rem;
}

.post-prose :deep(section.footnotes ol) {
  margin-bottom: 0;
}

.post-prose :deep(section.footnotes p) {
  margin: 0;
}

.post-prose :deep(h1 a),
.post-prose :deep(h2 a),
.post-prose :deep(h3 a),
.post-prose :deep(h4 a) {
  border-bottom: none;
  color: var(--md-sys-color-on-surface-variant);
}

.post-prose :deep(button) {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  padding: 0.25rem 0.5rem;

  border: none;
  border-radius: 8px;

  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);

  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1rem;

  cursor: pointer;

  transition:
    background-color 150ms ease,
    color 150ms ease;
}

.post-prose :deep(button:hover) {
  background: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);
}

.post-prose :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto 1rem;

  border-radius: 16px;
}

.post-prose :deep(table) {
  width: 100%;
  margin: 0 0 1rem;

  border-collapse: collapse;
  font-size: 0.875rem;
}

.post-prose :deep(th),
.post-prose :deep(td) {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  text-align: left;
}

.post-prose :deep(th) {
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
}

@media (max-width: 767px) {
  .post-title {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .post-header.has-cover {
    padding-right: clamp(100px, 30vw, 150px);
  }

  .post-cover {
    width: clamp(100px, 30vw, 150px);
  }
}

@media (min-width: 768px) {
  .post-title {
    font-size: 2rem;
    line-height: 2.5rem;
  }
}
</style>