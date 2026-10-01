<script setup lang="ts">
const projects = [
  {
    name: 'amicubed',
    description: 'My website, in Nuxt',
    banner: '/self.png',
    technologies: [
      { name: 'Nuxt', icon: 'simple-icons:nuxt' },
      { name: 'Vue', icon: 'simple-icons:vuedotjs' },
      { name: 'TypeScript', icon: 'simple-icons:typescript' },
    ],
    links: [
      {
        name: 'Live Demo',
        icon: 'lucide:external-link',
        href: '#',
      },
      {
        name: 'GitHub',
        icon: 'simple-icons:github',
        href: 'https://github.com/amisqaured/amicubed',
      },
    ],
  }
]
</script>

<template>
  <section class="projects">
    <div class="section-heading">
      <h2>Projects</h2>
      <p>Things I've built</p>
    </div>

    <div class="projects-grid">
      <article
        v-for="project in projects"
        :key="project.name"
        class="project"
      >
        <div class="project-banner">
          <img
            :src="project.banner"
            :alt="`${project.name} banner`"
          />
        </div>

        <div class="project-content">
          <div class="project-info">
            <h3>{{ project.name }}</h3>

            <p>
              {{ project.description }}
            </p>
          </div>

          <div class="project-technologies">
            <div
              v-for="technology in project.technologies"
              :key="technology.name"
              class="technology"
              :data-tooltip="technology.name"
            >
              <UIcon :name="technology.icon" />
            </div>
          </div>

          <div class="project-links">
            <a
              v-for="link in project.links"
              :key="link.name"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link"
            >
              <UIcon :name="link.icon" />
              <span>{{ link.name }}</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.projects {
  width: 100%;
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(280px, 1fr)
  );
  gap: 1rem;
}

.project {
  overflow: hidden;
  border-radius: 24px;
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);

  transition:
    background-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.project:hover {
  background: var(--md-sys-color-surface-container-high);
  box-shadow:
    0 2px 6px rgb(0 0 0 / 10%),
    0 1px 2px rgb(0 0 0 / 12%);
}

.project-banner {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.project-banner img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 300ms
    cubic-bezier(0.2, 0, 0, 1);
}

.project:hover .project-banner img {
  transform: scale(1.03);
}

.project-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
}

.project-info h3 {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.75rem;
}

.project-info p {
  margin: 0.375rem 0 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.technology {
  display: grid;
  place-items: center;

  width: 36px;
  height: 36px;

  border-radius: 10px;

  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);

  transition:
    background-color 150ms ease,
    transform 150ms ease;
}

.technology:hover {
  background: var(--md-sys-color-secondary);
  color: var(--md-sys-color-on-secondary);
  transform: translateY(-1px);
}

.technology :deep(svg) {
  width: 19px;
  height: 19px;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-link {
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

.project-link:hover {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.project-link :deep(svg) {
  width: 18px;
  height: 18px;
}
</style>