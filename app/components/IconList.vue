<script setup lang="ts">
const skills = [
  { name: 'Vue', icon: 'simple-icons:vuedotjs' },
  { name: 'Nuxt', icon: 'simple-icons:nuxt' },
  { name: 'TypeScript', icon: 'simple-icons:typescript' },
  { name: 'JavaScript', icon: 'simple-icons:javascript' },
  { name: 'HTML', icon: 'simple-icons:html5' },
  { name: 'CSS', icon: 'simple-icons:css3' },
  { name: 'KiCAD', icon: 'simple-icons:kicad' },
  { name: 'FreeCAD', icon: 'simple-icons:freecad' },
  { name: 'Luau', icon: 'simple-icons:luau' },
  { name: 'Git', icon: 'simple-icons:git' },
]
</script>

<template>
  <section class="skills">
    <div class="section-heading">
      <h2>Skills</h2>
      <p>Technologies I work with</p>
    </div>

    <div class="skills-grid">
      <div
        v-for="skill in skills"
        :key="skill.name"
        class="skill"
        :data-tooltip="skill.name"
      >
        <div class="skill-icon-container">
          <UIcon :name="skill.icon" class="skill-icon" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
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

.skills-grid {
  display: flex;
  flex-wrap: wrap;
}

.skill {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 64px;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  border-radius: 16px;
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  transition:
    background-color 150ms ease,
    box-shadow 150ms ease;
}

.skill:hover {
  background: var(--md-sys-color-surface-container-high);
}

.skill-icon-container {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.skill-icon {
  width: 22px;
  height: 22px;
}

</style>