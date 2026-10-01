import { argbFromHex, themeFromSourceColor, applyTheme, themeFromImage } from "@poupe/material-color-utilities";

export default defineNuxtPlugin(async () => {
  if (!import.meta.client) return

  const image = new Image()
  image.crossOrigin = "anonymous"
  image.src = "/background.png"
  await image.decode()
  const theme = await themeFromImage(image)

  applyTheme(theme, {
    target: document.documentElement,
    dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  })
})