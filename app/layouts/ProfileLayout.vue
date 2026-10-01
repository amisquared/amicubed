<template>
  <main class="page">
    <div class="bg-image"></div>
    <div class="subpage">
      <div class="header">
        <div class="profile">
          <slot name="profile" />
        </div>
        <div class="header-text">
          <slot name="header-start" />
        </div>
        <div class="header-image">
          <slot name="header-end" />
        </div>
      </div>
      <div class="content-container">
        <slot name="content"/>
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
  min-height: 0;
  box-sizing: border-box;
  padding: 0 1.5rem 0.5rem;
  border-radius: 16px 16px 0 0;
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  
  overflow: visible;
}

.profile {
  position: absolute;
  top: 0;
  left: 20%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: clamp(80px, 22vw, 120px);
  aspect-ratio: 1 / 1;
}

.profile img {
  aspect-ratio: 1 / 1;
  width: 100%;
  display: block;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--md-sys-color-surface);
  box-sizing: border-box;
}

.header-text {
  padding-top: 12px;
  padding-left: calc(20% + clamp(40px, 11vw, 60px) + clamp(0.5rem, 1.5vw, 1rem));
  min-height: clamp(80px, 22vw, 120px);
}

.header-text ::slotted(*) {
  margin: 0;
}

.header-image {
  position: absolute;
  top: 12px;
  left: calc(20% + clamp(40px, 11vw, 60px) + clamp(-0.5rem, -1vw, -0.25rem));
}

.header-image ::slotted(*) {
  width: clamp(140px, 30vw, 200px);
  height: auto;
  display: block;
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
    padding: 0 2rem 0.5rem;
  }

  .profile {
    width: clamp(100px, 18vw, 140px);
    left: 20%;
    transform: translate(-50%, -50%);
    top: 0;
  }

  .header-text {
    padding-top: 12px;
    min-height: clamp(100px, 18vw, 140px);
    padding-left: calc(20% + clamp(50px, 9vw, 70px) + clamp(0.75rem, 2vw, 1.25rem));
  }

  .header-image {
    top: 12px;
    left: calc(20% + clamp(50px, 9vw, 70px) + clamp(-0.5rem, -1vw, -0.25rem));
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
    padding: 0 2rem -1rem;
  }

  .profile {
    width: clamp(110px, 15vw, 150px);
    left: 20%;
    top: 0;
    transform: translate(-50%, -50%);
  }

  .header-text {
    padding-top: 12px;
    min-height: 150px;
    padding-left: calc(20% + 75px + 1rem);
  }

  .header-image {
    top: 12px;
    left: calc(20% + 75px - 0.5rem);
  }

  .header-image ::slotted(*) {
    width: 250px;
  }

  .content-container {
    padding: 1rem 4rem 4rem;
  }
}
</style>