/**
 * Post animations
 * 1) Hide posts on page load
 * 2) Slide in posts on load
 * 3) Hide post cards on page load
 * 4) Slide in post cards when user reaches end of page
 * 5) Slide featured posts on the main page
 */

/**
 *
 * @param {Number} duration Miliseconds the animation is meant to run
 * @param {String} movement One 'top' or 'bottom'
 * @param  {...String} targets The CSS selectors to be animated
 */
const animateSlideOutItems = (duration, movement, ...targets) => {
  const translateY = movement === 'top' ? '-100%' : '25px';
  // @ts-ignore
  anime({
    targets,
    translateY,
    opacity: 0,
    duration,
  });
};

/**
 *
 * @param {Number} duration Miliseconds the animation is meant to run
 * @param  {...String} targets The CSS selectors to be animated
 */
const animateSlideInItemsStagger = (duration, ...targets) => {
  // @ts-ignore
  anime({
    targets,
    translateY: 0,
    // @ts-ignore
    delay: anime.stagger(50, { start: 250 }), // increase delay by 100ms for each elements.
    opacity: 1,
    duration: duration,
  });
};


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
    duration,
  });
};

const hidePostNavbar = (duration) => {
  // @ts-ignore
  anime({
    targets: '#q-post-navbar',
    translateY: '-120px',
    easing: 'easeInOutSine',
    duration,
  });
};

const animateHideImageZoom = (duration) => {
  if (domImageZoom) {
    // @ts-ignore
    anime({
      targets: '#q-image-zoom-wrapper',
      height: '0%',
      width: '0%',
      top: '105%',
      left: '50%',
      opacity: 0,
      easing: 'easeInOutSine',
      duration,
    });
    // @ts-ignore
    setTimeout(() => domImageZoom.classList.add('hidden'), duration);
  }
};

const animateShowImageZoom = (duration) => {
  if (domImageZoom) {
    // @ts-ignore
    domImageZoom.classList.remove('hidden');
    // @ts-ignore
    anime({
      targets: '#q-image-zoom-wrapper',
      height: '100%',
      width: '100%',
      top: '0',
      left: '0',
      opacity: 1,
      easing: 'easeInOutSine',
      duration,
    });
  }
};

// Slide in posts when page loads
// Create the Glider for the featured posts
function animateGliderAuto(glider, miliseconds) {
  const slidesCount = glider.track.childElementCount;
  let slideTimeout = null;
  let nextIndex = 1;

  function slide() {
    slideTimeout = setTimeout(function () {
      if (nextIndex >= slidesCount) {
        nextIndex = 0;
      }
      glider.scrollItem(nextIndex++);
    }, miliseconds);
  }

  glider.ele.addEventListener('glider-animated', function () {
    window.clearInterval(slideTimeout);
    slide();
  });

  slide();
}
