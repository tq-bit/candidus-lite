// Query all necessary DOM elements
const domSiteLogo = document.querySelector('img.q-navbar-logo');
const domThemeButton = document.querySelectorAll('.q-theme-button');
const domNavbarToggleButton = document.querySelector('#q-sidebar-toggle')
const domNavbarCloseButton = document.querySelector('#q-navbar-button-close');
const domPostSearchInput = document.querySelector('#post-search-input') || null;
const domPostListItems = document.querySelectorAll('.q-post-list-item') || null;
const domPostContentArea = document.querySelector('.q-post-article-content');
const domPostReadingProgressBar = document.querySelector('#q-reading-progress')
const domPostNavbar = document.querySelector('#q-post-navbar');

// Define global variables
let scrollerObserver = {
  isScrolling: false,
  checkInterval: 250,
}
let qIsScrolling = false

// Event binding for all default elements
domThemeButton.forEach(themeButton => {
  themeButton.addEventListener('click', () => toggleUserTheme())
})
domNavbarToggleButton.addEventListener('click', () => toggleSidebar());
domNavbarCloseButton.addEventListener('click', () => toggleSidebar());
domSiteLogo.addEventListener('mouseover', () => animateRotateLogo());

// Create a custom scroll check event
document.addEventListener('scroll', () => {
  scrollerObserver.isScrolling = true;
})

setInterval(() => {
  if (scrollerObserver.isScrolling) {
    scrollerObserver.isScrolling = false;

    // Attach the scroll events
    // ./posts.hbs
    if(domPostContentArea) {
      monitorPostNavbar(domPostReadingProgressBar, scrollerObserver.checkInterval);
    }
  }
}, scrollerObserver.checkInterval)

// Fire on DomContentLoaded
document.addEventListener('DOMContentLoaded', () => {

  // Event binding for site specific dom elements

  // ./index.hbs
  // Slide in posts when page loads
  animateSlideInPosts();

  // Focus the search bar on ctrl + k
  if (domPostSearchInput) {
    domPostSearchInput.addEventListener('keyup', () => {
      filterPostList(domPostSearchInput, domPostListItems)
    })
  }

  // ./post.hbs
  // Execute post related functions
  if (domPostContentArea) {
    monitorReadingProgress(domPostContentArea, domPostReadingProgressBar);
  }
});

// Fire when a key event is registered
window.addEventListener('keydown', (event) => {
  focusPostListSearchButton(event, domPostSearchInput);
})

// Everything that should be handled right away
initUserTheme();
animateHidePosts();