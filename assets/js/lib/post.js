/**
 * Functions specifially for posts and post related items
 * 1) Filter post list on index page DEPRECATED
 * 2) Focus the searchbar when pressing CTRL + K
 * 3) Monitor reading progress
 * 4) Toggle the post navbar when user scrolls down in the post content
 * 5) Show the post cards once user scrolls below 95% of the post
 * 6) Hide a part of the excerpt in the post card
 */

// 2)
const focusPostListSearchButton = (event, searchfield) => {
  if (event.key.toLowerCase() === 'escape' && !!searchfield) {
    event.preventDefault();
    searchfield.blur();
  }
  if (event.ctrlKey && event.key.toLowerCase() === 'k' && !!searchfield) {
    event.preventDefault();
    searchfield.focus()
  }
}

// 3)
const monitorReadingProgress = function (contentArea, progressBar) {

  let frameListening = function () {
    let contentBox = contentArea.getBoundingClientRect();
    let midPoint = window.innerHeight / 2;
    if (contentBox.top > midPoint) {
      progressBar.value = 0;
    }
    if (contentBox.top < midPoint) {
      progressBar.value = progressBar.max;
    }
    if (contentBox.top <= midPoint && contentBox.bottom >= midPoint) {
      progressBar.value =
        (progressBar.max * Math.abs(contentBox.top - midPoint)) /
        contentBox.height;
    }

    window.requestAnimationFrame(frameListening);

  };
  window.requestAnimationFrame(frameListening);
};

// 4)
const monitorPostNavbar = (domPostReadingProgressBar, duration) => {
  const readingProgress = domPostReadingProgressBar.value
  if (readingProgress > 0.05) {
    showPostNavbar(duration);
  }

  if (readingProgress <= 0.05) {
    hidePostNavbar(duration);
  }
}

// 5)
const monitorShowReadMorePostCards = (domPostReadingProgressBar) => {
  const readingProgress = domPostReadingProgressBar.value
  if(readingProgress < 0.98) {
    animateSlideOutItems(500, 'bottom', '.q-post-card-wrapper')
  }

  if (readingProgress >= 0.98) {
    animateSlideInItemsStagger(500, '.q-post-card-wrapper')
  }
}

// 6)
const hidePostCardExcerpts = (domPostExcerptItems) => {
  domPostExcerptItems.forEach(excerptItem => {
    const newText = excerptItem.innerText.split(' ').splice(0, 20);
    excerptItem.innerText = [...newText, '...'].join(' ');
  })
}

hidePostNavbar(0)