/**
 * Post animations
 * 1) Hide posts on page load
 * 2) Slide in posts on load
 * 3) Hide post cards on page load
 * 4) Slide in post cards when user reaches end of page
 * 5) Slide featured posts on the main page
 */
const animateHidePosts = () => {
  // @ts-ignore
  anime({
    targets: '.q-post-list-item',
    translateY: '25px',
    opacity: 0,
    duration: 0,
  });
}

const animateSlideInPosts = () => {
  // @ts-ignore
  anime({
    targets: '.q-post-list-item',
    translateY: 0,
    // @ts-ignore
    delay: anime.stagger(50, { start: 250 }), // increase delay by 100ms for each elements.
    opacity: 1,
    duration: 1000,
  });
}

const animateHidePostCards = () => {
  // @ts-ignore
  anime({
    targets: '.q-post-card',
    translateY: '25px',
    opacity: 0,
    duration: 0,
  });
}

const animateSlideInPostCards = (duration) => {
  // @ts-ignore
  anime({
    targets: '.q-post-card',
    translateY: 0,
    // @ts-ignore
    delay: anime.stagger(50, { start: 250 }), // increase delay by 100ms for each elements.
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
  // @ts-ignore
  anime({
    targets: '#q-sidebar',
    translateY: '-100%',
    opacity: 0,
    easing: 'easeInOutSine',
    duration
  })
  // @ts-ignore
  setTimeout(() => domSidebar.classList.add('hidden'), duration)
}

const animateShowSidebar = (duration) => {
  // @ts-ignore
  domSidebar.classList.remove('hidden')
  // @ts-ignore
  anime({
    targets: '#q-sidebar',
    translateY: '0',
    opacity: 0.98,
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
  // @ts-ignore
  anime({
    targets: '#q-post-navbar',
    translateY: '0',
    easing: 'easeInOutSine',
    duration
  })
}

const hidePostNavbar = (duration) => {
  // @ts-ignore
  anime({
    targets: '#q-post-navbar',
    translateY: '-120px',
    easing: 'easeInOutSine',
    duration
  })
}

const animateHideImageZoom = (duration) => {
  // @ts-ignore
  anime({
    targets: '#q-image-zoom-wrapper',
    height: '0%',
    width: '0%',
    top: '50%',
    left: '50%',
    opacity: 0,
    easing: 'easeInOutSine',
    duration
  })
  // @ts-ignore
  setTimeout(() => domImageZoom.classList.add('hidden'), duration)
}

const animateShowImageZoom = (duration) => {
  // @ts-ignore
  domImageZoom.classList.remove('hidden')
  // @ts-ignore
  anime({
    targets: '#q-image-zoom-wrapper',
    height: '100%',
    width: '100%',
    top: '0',
    left: '0',
    opacity: 1,
    easing: 'easeInOutSine',
    duration
  })
}

// Slide in posts when page loads
// Create the Glider for the featured posts
// @ts-ignore
const glider = new Glider(document.querySelector('.glider'), {
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: true,
  dragVelocity: 0.2,
  scrollLock: true,
  scrollLockDelay: 100,
  scrollPropagate: true,
  responsive: [
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
      }
    }
  ]
})

function sliderAuto(glider, miliseconds) {
  const slidesCount = glider.track.childElementCount;
  let slideTimeout = null;
  let nextIndex = 1;

  function slide() {
    slideTimeout = setTimeout(
      function () {
        if (nextIndex >= slidesCount) {
          nextIndex = 0;
        }
        glider.scrollItem(nextIndex++);
      },
      miliseconds
    );
  }

  glider.ele.addEventListener('glider-animated', function () {
    window.clearInterval(slideTimeout);
    slide();
  });

  slide();
}

sliderAuto(glider, 5000)
