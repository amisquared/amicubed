<script lang="ts" setup>
const year = new Date().getFullYear()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />

    <footer class="app-footer">
      <p class="app-footer-text">
        <b>
          <span>made with <UIcon name="mdi:heart" class="app-footer-heart" /> by ami, {{ year }}</span>
        </b>
      </p>
    </footer>
  </div>
</template>

<style>
* {
  font-family: 'Instrument Sans', sans-serif;
}
.app-footer {
  position: relative;
  padding: 0 1rem 2rem;
  text-align: center;
  z-index: 3;
}

.app-footer-text {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;

  margin: 0;

  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;

  min-height: 40;
  padding: 0.5rem 1.25rem;

  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 999px;
  background: var(--md-sys-color-surface);
}

.app-footer-separator {
  color: var(--md-sys-color-outline);
}

@media (min-width: 768px) {
  .app-footer {
    padding-bottom: 3rem;
  }
}
</style>