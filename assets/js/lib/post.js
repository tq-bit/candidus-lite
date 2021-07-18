/**
 * Functions specifially for posts and post related items
 * 1) Filter post list on index page
 * 2) Focus the searchbar when pressing CTRL + K
 * 3) Monitor reading progress
 * 4) Toggle the post navbar when user scrolls down in the post content
 * 5) Hide a part of the excerpt in the post card
 */

// 1)
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

// 2)
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
const hidePostCardExcerpts = (domPostExcerptItems) => {
  domPostExcerptItems.forEach(excerptItem => {
    const newText = excerptItem.innerText.split(' ').splice(0, 20);
    excerptItem.innerText = [...newText, '...'].join(' ')
    console.log(newText)
  })
}

hidePostNavbar(0)