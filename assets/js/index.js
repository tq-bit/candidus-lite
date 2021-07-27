// Query all necessary DOM elements
// DOM elements from ./default.hbs
const domSiteLogo = document.querySelector('img.q-navbar-logo');
const domThemeButton = document.querySelectorAll('.q-theme-button');
const domNavbarToggleButton = document.querySelector('#q-sidebar-toggle')
const domNavbarCloseButton = document.querySelector('#q-navbar-button-close');

// DOM elements from ./index.hbs
const domPostSearchInput = document.querySelector('#post-search-input') || null;
const domPostListItems = document.querySelectorAll('.q-post-list-item') || null;

// DOM elements specifically in ./posts.hbs
const domPostContentArea = document.querySelector('.q-post-article-content') || null;
const domPostReadingProgressBar = document.querySelector('#q-reading-progress') || null;
const domPostNavbar = document.querySelector('#q-post-navbar') || null;
const domPostImages = document.querySelectorAll('.kg-width-full');

// DOM elements specifically in ./partials/post-card-item.hbs
const domPostCardItemExcerpts = document.querySelectorAll('.q-post-card-body-excerpt')

// DOM Elements specifically in ./partials/image-zoom.hbs
const domImageZoomCloseButton = document.querySelector('#q-image-zoom-close');

// Define global, dynamic variables
let scrollerObserver = {
  isScrolling: false,
  checkInterval: 250,
}

// Event binding for all default elements
domThemeButton.forEach(themeButton => {
  themeButton.addEventListener('click', () => toggleUserTheme())
})
domNavbarToggleButton.addEventListener('click', () => toggleSidebar());
domNavbarCloseButton.addEventListener('click', () => toggleSidebar());

// Creates a custom scroll check event
document.addEventListener('scroll', () => {
  scrollerObserver.isScrolling = true;
})

setInterval(() => {
  if (scrollerObserver.isScrolling) {
    scrollerObserver.isScrolling = false;

    // Attach the scroll events
    // ./posts.hbs
    if (domPostContentArea && domPostReadingProgressBar) {
      monitorPostNavbar(domPostReadingProgressBar, scrollerObserver.checkInterval);
      monitorShowReadMorePostCards(domPostReadingProgressBar, 1000)
    }
  }
}, scrollerObserver.checkInterval)

// Events to be fired on DomContentLoaded
document.addEventListener('DOMContentLoaded', () => {

  // Event binding for site specific dom elements

  // ./index.hbs
  animateSlideInPosts();

  // Focus the search bar on ctrl + k
  if (domPostSearchInput) {
    domPostSearchInput.addEventListener('keyup', () => {
      filterPostList(domPostSearchInput, domPostListItems)
    })
  }

  // ./post.hbs
  // Execute post related functions
  if (domPostContentArea && domPostReadingProgressBar) {
    monitorReadingProgress(domPostContentArea, domPostReadingProgressBar);
    animateHidePostCards()
    // Add event listeners to fullscreen images
    domPostImages.forEach(domPostImage => {
      domPostImage.addEventListener('click', () => {
        toggleImageZoom(domPostImage);
      })
    });

    domImageZoomCloseButton.addEventListener('click', () => {
      toggleImageZoom()
    })
  }


  // ./partials/post-card-item.hbs
  // Hide a part of the excerpt
  if (domPostCardItemExcerpts) {
    hidePostCardExcerpts(domPostCardItemExcerpts);
  }
});

// Fire when a key event is registered
window.addEventListener('keydown', (event) => {
  focusPostListSearchButton(event, domPostSearchInput);
})

// Everything that should be handled right away
initUserTheme();
animateHidePosts();
