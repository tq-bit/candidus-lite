/**
 * Functions specifially for post and post items
 * 1) Filter post list on index page
 * 2) Focus the searchbar when pressing CTRL + K
 * 3) Monitor reading progress
 * 4) Toggle the post navbar
 */

const filterPostList = (searchInput, searchList) => {
  const filter = searchInput.value.toUpperCase();

  searchList.forEach(searchItem => {
    const text = searchItem.innerText.toUpperCase();
    if (text.includes(filter)) {
      searchItem.style.display = "";
    } else {
      searchItem.style.display = "none";
    }
  })
}

const focusPostListSearchButton = (event, searchfield) => {
  if (event.key.toLowerCase() === 'escape') {
    event.preventDefault();
    searchfield.blur();
  }
  if (event.ctrlKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchfield.focus()
  }
}

const monitorReadingProgress = function (contentArea, progressBar) {
  // Grab content area and progress bar

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

const monitorPostNavbar = (domPostReadingProgressBar, duration) => {
  const readingProgress = domPostReadingProgressBar.value
  if (readingProgress > 0.05) {
    showPostNavbar(duration);
  }

  if (readingProgress <= 0.05) {
    hidePostNavbar(duration);
  }

}