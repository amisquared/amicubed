<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const props = withDefaults(
  defineProps<{
    post: BlogPost
    headingLevel?: 'h2' | 'h3'
  }>(),
  { headingLevel: 'h3' }
)

const imageSrc = computed(() => props.post.image?.trim() || undefined)

const imageFailed = ref(false)

watch(imageSrc, () => {
  imageFailed.value = false
})

const showBanner = computed(() => Boolean(imageSrc.value) && !imageFailed.value)

const parsedDate = computed(() => {
  if (!props.post.date) return null

  const date = new Date(props.post.date)

  return Number.isNaN(date.getTime()) ? null : date
})

const isoDate = computed(() => parsedDate.value?.toISOString())

const formattedDate = computed(() =>
  parsedDate.value?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
)

const visibleTags = computed(() => props.post.tags?.slice(0, 3) ?? [])

const hiddenTagCount = computed(() =>
  Math.max((props.post.tags?.length ?? 0) - visibleTags.value.length, 0)
)
</script>

<template>
  <article class="blog-card">
    <div v-if="showBanner" class="blog-card-banner">
      <img
        :src="imageSrc"
        :alt="post.title ?? 'Post cover'"
        loading="lazy"
        @error="imageFailed = true"
      />
    </div>

    <div class="blog-card-content">
      <div v-if="formattedDate" class="blog-card-meta">
        <time :datetime="isoDate">{{ formattedDate }}</time>
      </div>

      <component :is="headingLevel" class="blog-card-title">
        <NuxtLink v-if="post.path" :to="post.path" class="blog-card-link">
          {{ post.title }}
        </NuxtLink>
        <template v-else>
          {{ post.title }}
        </template>
      </component>

      <p v-if="post.description" class="blog-card-description">
        {{ post.description }}
      </p>

      <ul v-if="visibleTags.length" class="blog-card-tags">
        <li v-for="tag in visibleTags" :key="tag" class="blog-card-tag">
          {{ tag }}
        </li>
        <li v-if="hiddenTagCount" class="blog-card-tag blog-card-tag-count">
          +{{ hiddenTagCount }}
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.blog-card {
  position: relative;

  overflow: hidden;
  border-radius: 24px;
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);

  transition:
    background-color 150ms ease,
    box-shadow 150ms ease;
}

.blog-card:hover {
  background: var(--md-sys-color-surface-container-high);
  box-shadow:
    0 2px 6px rgb(0 0 0 / 10%),
    0 1px 2px rgb(0 0 0 / 12%);
}

.blog-card:focus-within {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.blog-card-banner {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.blog-card-banner img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 300ms
    cubic-bezier(0.2, 0, 0, 1);
}

.blog-card:hover .blog-card-banner img {
  transform: scale(1.03);
}

.blog-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.25rem;
}

.blog-card-meta {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.8125rem;
  line-height: 1.25rem;
}

.blog-card-title {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.75rem;
}

.blog-card-link {
  color: inherit;
  text-decoration: none;
}

.blog-card-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.blog-card-description {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.25rem;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.blog-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;

  margin: 0;
  padding: 0.25rem 0 0;

  list-style: none;
}

.blog-card-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);

  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
}

.blog-card-tag-count {
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
}
</style>