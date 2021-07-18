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
 * 2) Slide in posts on load
 * 3) Hide post cards on page load
 * 4) Slide in post cards when user reaches end of page
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

const animateHidePostCards = () => {
  anime({
    targets: '.q-post-card',
    translateY: '25px',
    opacity: 0,
    duration: 0,
  });
}

const animateSlideInPostCards = (duration) => {
  anime({
    targets: '.q-post-card',
    translateY: 0,
    delay: anime.stagger(150, { start: 450 }), // increase delay by 100ms for each elements.
    opacity: 1,
    duration: duration,
  });
}

/**
 * Sidebar animations
 * 1) hide sidebar
 * 2) animateShowSidebar
 */
const animateHideSidebar = (duration) => {
  anime({
    targets: '#q-sidebar',
    translateY: '-100%',
    opacity: 0,
    easing: 'easeInOutSine',
    duration
  })
  setTimeout(() => domSidebar.classList.add('hidden'), duration)
}

const animateShowSidebar = (duration) => {
  domSidebar.classList.remove('hidden')
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