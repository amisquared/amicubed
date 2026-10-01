import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  let tooltip: HTMLDivElement | null = null
  let target: HTMLElement | null = null

  const createTooltip = () => {
    if (tooltip) return

    tooltip = document.createElement('div')
    tooltip.setAttribute('role', 'tooltip')

    Object.assign(tooltip.style, {
      position: 'fixed',
      zIndex: '9999',
      pointerEvents: 'none',
      opacity: '0',
      transform: 'translate3d(0, 4px, 0)',
      transition:
        'opacity 120ms cubic-bezier(0.2, 0, 0, 1), transform 120ms cubic-bezier(0.2, 0, 0, 1)',
      padding: '8px 12px',
      borderRadius: '12px',
      background: 'var(--md-sys-color-inverse-surface, #303030)',
      color: 'var(--md-sys-color-inverse-on-surface, #fff)',
      fontFamily: 'var(--md-sys-typescale-body-medium-font, system-ui)',
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '500',
      boxShadow:
        '0 1px 2px rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.12)',
      whiteSpace: 'nowrap',
      userSelect: 'none',
    })

    document.body.appendChild(tooltip)
  }

  const moveTooltip = (event: MouseEvent) => {
    if (!tooltip) return

    const offset = 16

    let x = event.clientX + offset
    let y = event.clientY + offset

    const rect = tooltip.getBoundingClientRect()

    if (x + rect.width > window.innerWidth - 8) {
      x = event.clientX - rect.width - offset
    }

    if (y + rect.height > window.innerHeight - 8) {
      y = event.clientY - rect.height - offset
    }

    tooltip.style.left = `${x}px`
    tooltip.style.top = `${y}px`
  }

  const showTooltip = (element: HTMLElement, event: MouseEvent) => {
    createTooltip()

    if (!tooltip) return

    target = element

    const text =
      element.dataset.tooltip ||
      element.getAttribute('aria-label') ||
      ''

    if (!text) return

    tooltip.textContent = text
    tooltip.style.opacity = '1'
    tooltip.style.transform = 'translate3d(0, 0, 0)'

    moveTooltip(event)
  }

  const hideTooltip = () => {
    if (!tooltip) return

    tooltip.style.opacity = '0'
    tooltip.style.transform = 'translate3d(0, 4px, 0)'
    target = null
  }

  document.addEventListener(
    'mouseover',
    (event) => {
      const element = (event.target as HTMLElement)?.closest(
        '[data-tooltip]'
      ) as HTMLElement | null

      if (!element) return

      showTooltip(element, event as MouseEvent)
    },
    true
  )

  document.addEventListener(
    'mousemove',
    (event) => {
      if (!target) return

      moveTooltip(event)
    },
    { passive: true }
  )

  document.addEventListener(
    'mouseout',
    (event) => {
      const element = (event.target as HTMLElement)?.closest(
        '[data-tooltip]'
      )

      if (element === target) {
        hideTooltip()
      }
    },
    true
  )
})