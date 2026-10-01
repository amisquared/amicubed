<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const props = withDefaults(
  defineProps<{
    posts: BlogPost[]
    tag?: string
    limit?: number
    showFilters?: boolean
  }>(),
  { showFilters: true }
)

const count = defineModel<number | undefined>('count')

const activeTag = ref<string | null>(props.tag ?? null)

const allTags = computed(() => {
  const counts = new Map<string, number>()

  for (const post of props.posts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort(([aTag, aCount], [bTag, bCount]) =>
      bCount - aCount || aTag.localeCompare(bTag)
    )
    .map(([tag]) => tag)
})

const filteredPosts = computed(() => {
  const tag = activeTag.value

  if (!tag) return props.posts

  return props.posts.filter(post => post.tags?.includes(tag))
})

const visiblePosts = computed(() =>
  typeof props.limit === 'number'
    ? filteredPosts.value.slice(0, props.limit)
    : filteredPosts.value
)

watch(filteredPosts, posts => {
  count.value = posts.length
}, { immediate: true })

function selectTag(tag: string | null) {
  activeTag.value = tag
}
</script>

<template>
  <div class="blog-list-wrapper">
    <div v-if="showFilters && allTags.length" class="blog-filters">
      <button
        type="button"
        class="blog-filter"
        :class="{ 'is-active': activeTag === null }"
        :aria-pressed="activeTag === null"
        @click="selectTag(null)"
      >
        All
      </button>

      <button
        v-for="tag in allTags"
        :key="tag"
        type="button"
        class="blog-filter"
        :class="{ 'is-active': activeTag === tag }"
        :aria-pressed="activeTag === tag"
        @click="selectTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <div v-if="visiblePosts.length" class="blog-list">
      <BlogCard
        v-for="(post, index) in visiblePosts"
        :key="post.path ?? index"
        :post="post"
      />
    </div>

    <div v-else-if="!posts.length" class="blog-empty">
      <p class="blog-empty-title">No posts yet</p>
      <p class="blog-empty-text">
        Once something gets published it'll show up here.
      </p>
    </div>

    <div v-else class="blog-empty">
      <p class="blog-empty-title">
        Nothing tagged &ldquo;{{ activeTag }}&rdquo;
      </p>
      <button type="button" class="blog-clear" @click="selectTag(null)">
        Clear filter
      </button>
    </div>
  </div>
</template>

<style scoped>
.blog-list-wrapper {
  width: 100%;
}

.blog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  margin: 0 0 1.25rem;
}

.blog-filter {
  display: inline-flex;
  align-items: center;

  min-height: 32px;
  padding: 0.25rem 0.875rem;

  border: none;
  border-radius: 999px;

  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);

  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1rem;

  cursor: pointer;

  transition:
    background-color 150ms ease,
    color 150ms ease;
}

.blog-filter:hover {
  background: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);
}

.blog-filter.is-active {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.blog-filter:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.blog-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.blog-empty {
  padding: 2.5rem 0;
  text-align: center;
}

.blog-empty-title {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.5rem;
}

.blog-empty-text {
  margin: 0.375rem 0 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.blog-clear {
  margin-top: 1rem;
  padding: 0.5rem 1rem;

  border: none;
  border-radius: 999px;

  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);

  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;

  cursor: pointer;

  transition: background-color 150ms ease;
}

.blog-clear:hover {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.blog-clear:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}
</style>