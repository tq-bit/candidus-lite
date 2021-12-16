/**
 *
 * @param {Number} duration Miliseconds the animation is meant to run
 * @param {String} movement One 'top' or 'bottom'
 * @param  {String[]} targets The CSS selectors to be animated
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
 * @param  {String[]} targets The CSS selectors to be animated
 */
const animateSlideInItemsStagger = (duration, ...targets) => {
  targets.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => (element.style.display = 'block'));
  });
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
