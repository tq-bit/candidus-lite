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
 * Post animations
 * 1) Hide posts on page load
 * 1) Slide in posts on load
 */
const animateHidePosts = () => {
  anime({
    targets: '.q-post-list-item',
    translateY: '25px',
    opacity: 0,
    duration: 0,
  });
}

const animateSlideInPosts = () => {
  anime({
    targets: '.q-post-list-item',
    translateY: 0,
    delay: anime.stagger(50, { start: 550 }), // increase delay by 100ms for each elements.
    opacity: 1,
    duration: 1000,
  });
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

/**
 * Post navbar animations
 * 1) hide post navbar
 * 2) show post navbar
 */

const showPostNavbar = (duration) => {
  anime({
    targets: '#q-post-navbar',
    translateY: '0',
    easing: 'easeInOutSine',
    duration
  })
}

const hidePostNavbar = (duration) => {
  anime({
    targets: '#q-post-navbar',
    translateY: '-60px',
    easing: 'easeInOutSine',
    duration
  })
}