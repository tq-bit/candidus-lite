/**
 * Functions specifially for posts and post related items
 * 1) Monitor reading progress
 * 2) Toggle the post navbar when user scrolls down in the post content
 * 3) Show the post cards once user scrolls below 95% of the post
 * 4) Hide a part of the excerpt in the post card
 * 5) Scroll to a clicked h2 element
 */

const usePostProgressBar = (contentArea, progressNav, progressBar) => {
  const monitorProgressBar = () => {
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

  const monitorProgressNav = () => {
    const readingProgress = progressBar.value;
    if (readingProgress > 0.05) {
      //@ts-ignore
      anime({
        targets: '#' + progressNav.id,
        translateY: '0',
        easing: 'easeInOutSine',
        duration: 250,
      });
    }

    if (readingProgress <= 0.05) {
      //@ts-ignore
      anime({
        targets: '#' + progressNav.id,
        translateY: '-120px',
        easing: 'easeInOutSine',
        duration: 250,
      });
    }
  };
  return { monitorProgressBar, monitorProgressNav };
};

// 3)
const monitorShowReadMorePostCards = (domPostReadingProgressBar) => {
  const readingProgress = domPostReadingProgressBar.value;
  if (readingProgress < 0.98) {
    animateSlideOutItems(500, 'bottom', '.q-post-card-wrapper');
  }

  if (readingProgress >= 0.98) {
    animateSlideInItemsStagger(500, '.q-post-card-wrapper');
  }
};

// 4)
const hidePostCardExcerpts = (domPostExcerptItems) => {
  domPostExcerptItems.forEach((excerptItem) => {
    const newText = excerptItem.innerText.split(' ').splice(0, 20);
    excerptItem.innerText = [...newText, '...'].join(' ');
  });
};

// 5)
document.querySelectorAll('.q-post-article h2').forEach((element) => {
  element.addEventListener('click', () => {
    const postNavbar = document.querySelector('#q-post-navbar');
    let coord = 0;
    if (!!postNavbar) {
      const { height } = postNavbar.getClientRects()[0];
      coord = element.getBoundingClientRect().top + window.scrollY - height;
    } else {
      coord = element.getBoundingClientRect().top + window.scrollY;
    }
    window.scroll({ top: coord });
  });
});
