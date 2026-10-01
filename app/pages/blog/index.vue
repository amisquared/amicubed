<script lang="ts" setup>
import BaseLayout from '~/layouts/BaseLayout.vue';

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .select('path', 'title', 'description', 'image', 'date', 'tags')
    .order('date', 'DESC')
    .all()
)

usePageSeo({
  title: 'Blog',
  description: "Ami's blog",
  path: '/blog'
})

const filteredCount = ref<number>()

const countLabel = computed(() => {
  const count = filteredCount.value ?? posts.value?.length ?? 0

  return `${count} ${count === 1 ? 'post' : 'posts'}`
})
</script>

<template>
  <BaseLayout>
    <template #header-start>
      <h1>Blog</h1>
      <p class="subtitle">{{ countLabel }}</p>
    </template>
    <template #header-end></template>
    <template #content>
      <BlogList v-model:count="filteredCount" :posts="posts ?? []" />

      <div class="blog-home">
        <NuxtLink to="/" class="blog-pill">
          <UIcon name="mdi:home" class="blog-pill-icon" />
          <span>Back to home</span>
        </NuxtLink>
      </div>
    </template>
  </BaseLayout>
</template>

<style scoped>
h1 {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 2.25rem;
}

.subtitle {
  margin: 0.125rem 0 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.blog-home {
  display: flex;
  justify-content: center;

  margin-top: 1.5rem;
  padding-top: 1.5rem;

  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.blog-pill {
  display: inline-flex;
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

.blog-pill:hover {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.blog-pill:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.blog-pill-icon {
  width: 18px;
  height: 18px;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
    line-height: 2.5rem;
  }
}
</style>