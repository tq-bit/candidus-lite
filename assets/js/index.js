// DOM Elements
const domSiteLogo = document.querySelector('img.q-navbar-logo');
const domThemeButton = document.querySelectorAll('.q-theme-button');
const domNavbarToggleButton = document.querySelector('#q-sidebar-toggle')
const domNavbarCloseButton = document.querySelector('#q-navbar-button-close');
const domPostSearchInput = document.querySelector('#post-search-input') || null;
const domPostListItems = document.querySelectorAll('.q-post-list-item') || null;

// Event binding for all default elements
domThemeButton.forEach(themeButton => {
  themeButton.addEventListener('click', () => toggleUserTheme())
})
domNavbarToggleButton.addEventListener('click', () => toggleSidebar());
domNavbarCloseButton.addEventListener('click', () => toggleSidebar());
domSiteLogo.addEventListener('mouseover', () => animateRotateLogo());

// Event binding for site specific dom elements
if (domPostSearchInput) {
  domPostSearchInput.addEventListener('keyup', () => {
    filterPostList(domPostSearchInput, domPostListItems)
  })
}


// Fire on DomContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  animateSlideInPosts();
});

// Everything that should be handled right away
initUserTheme();
animateHidePosts();
