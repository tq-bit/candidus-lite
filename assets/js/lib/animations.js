/**
 * Navbar animations
 * 1) animateRotateLogo
 */
const animateRotateLogo = () => {
  const animationDuration = 500;
  anime({
    targets: '.q-navbar-logo',
    rotate: {
      value: 180,
      duration: animationDuration,
      easing: 'easeInOutQuad'
    }
  })
}

/**
 * Sidebar animations
 * 1) hide sidebar
 * 2) showSidebar
 */
const hideSidebar = (duration) => {
  anime({
    targets: '#q-sidebar',
    translateY: '-100%',
    opacity: 0,
    easing: 'easeInOutSine',
    duration
  })
  setTimeout(() => sidebar.classList.add('hidden'), duration)
}

const showSidebar = (duration) => {
  sidebar.classList.remove('hidden')
  anime({
    targets: '#q-sidebar',
    translateY: '0',
    opacity: 0.95,
    easing: 'easeInOutSine',
    duration
  })
}