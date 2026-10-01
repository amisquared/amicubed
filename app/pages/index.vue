<script setup lang="ts">
import ProfileLayout from '~/layouts/ProfileLayout.vue';
import { SITE } from '~/utils/site';

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .select('path', 'title', 'description', 'image', 'date', 'tags')
    .order('date', 'DESC')
    .all()
)

const { canonical } = usePageSeo({
  path: '/'
})

useJsonLd({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: SITE.name,
      url: canonical.value,
      description: SITE.description
    },
    {
      '@type': 'Person',
      name: SITE.author,
      url: canonical.value
    }
  ]
})
</script>

<template>
  <ProfileLayout>
    <template #profile>
      <img src="/profile.png" alt="Profile picture" />
    </template>
    <template #header-start></template>
    <template #header-end>
      <img class="stupid" src="/st.png"/>
    </template>
    <template #content>
      <br>
      <br>
      <br>
      <IconList />
      <br>
      <Portfolio />

      <section class="blog-preview">
        <div class="section-heading">
          <h2>Blog</h2>
          <p>Latest posts</p>
        </div>

        <BlogList :posts="posts ?? []" :limit="3" :show-filters="false" />

        <NuxtLink to="/blog" class="blog-preview-more">
          <span>All posts</span>
          <UIcon name="mdi:arrow-right" class="blog-preview-more-icon" />
        </NuxtLink>
      </section>

      <br>
      <h2>Some information: </h2>
      <h3>This website also acts as a connectivity check!</h3>
      <p>See <a href="/generate_204">/generate_204</a></p>
      <h3>RSS feed? In the big 2026?</h3>
      <p>Yes. <a href="/rss.xml">/rss.xml</a></p>


    </template>
  </ProfileLayout>
</template>

<style scoped>

a {
  color: var(--md-sys-color-primary);
}

h3 {
  margin-bottom: 4px;
}

p {
  margin-top: 4px;
}

.greeting {
  margin: 0;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  line-height: 1.2;
}

.stupid {
  display: block;
}

.blog-preview {
  width: 100%;
  margin-top: 2.5rem;
}

.section-heading {
  margin-bottom: 1.5rem;
}

.section-heading h2 {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
}

.section-heading p {
  margin: 0.25rem 0 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.blog-preview-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  min-height: 40px;
  margin-top: 1rem;
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

.blog-preview-more:hover {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.blog-preview-more:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .stupid {
    filter: invert()
  }
}

@media (min-width: 768px) {
  .greeting {
    font-size: clamp(2rem, 4vw, 3rem);
  }
}

@media (min-width: 1024px) {
  .greeting {
    font-size: 3rem;
  }
}
</style>