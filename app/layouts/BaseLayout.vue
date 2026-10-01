<template>
  <main class="page">
    <div class="bg-image"></div>

    <div class="subpage">
      <div class="header">
        <div class="header-text">
          <slot name="header-start" />
        </div>

        <div class="header-image">
          <slot name="header-end" />
        </div>
      </div>

      <div class="content-container">
        <slot name="content" />
      </div>
    </div>
  </main>
</template>

<style>
body {
  margin: 0;
}

.page {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  overflow: hidden;
}

.bg-image {
  position: fixed;
  inset: -20px;
  z-index: 0;

  background-image: url("/background.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(16px);
}

.subpage {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.header {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 16px 16px 0 0;
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}

.header-text {
  width: 100%;
  min-height: 0;
  margin: 0;
  padding: 0;
  text-align: left;
}

.header-text ::slotted(*) {
  margin: 0;
  padding: 0;
  text-align: left;
}

.header-image {
  position: absolute;
  top: 12px;
  right: 1rem;
}

.content-container {
  width: 100%;
  box-sizing: border-box;
  min-height: 50vh;
  padding: 1rem 1.5rem 2rem;
  border-radius: 0 0 16px 16px;
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);

  box-shadow:
    0 2px 4px rgb(0 0 0 / 10%),
    0 8px 16px rgb(0 0 0 / 10%),
    0 20px 40px rgb(0 0 0 / 8%);
}

@media (min-width: 768px) {
  .page {
    padding: 15vh 2rem 4rem;
  }

  .subpage {
    max-width: 600px;
  }

  .header {
    padding: 1rem 2rem;
  }

  .header-image {
    right: 2rem;
  }

  .header-image ::slotted(*) {
    width: clamp(180px, 25vw, 250px);
  }

  .content-container {
    padding: 1.5rem 3rem 3rem;
  }
}

@media (min-width: 1024px) {
  .page {
    padding: 20vh 2rem 4rem;
  }

  .subpage {
    max-width: 500px;
  }

  .header {
    padding: 1rem 2rem;
  }

  .header-image {
    right: 2rem;
  }

  .header-image ::slotted(*) {
    width: 250px;
  }

  .content-container {
    padding: 1rem 4rem 4rem;
  }
}
</style>