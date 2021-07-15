// DOM Elements
const domSiteLogo = document.querySelector('img.q-navbar-logo');
const domThemeButton = document.querySelectorAll('.q-theme-button');
const domNavbarToggleButton = document.querySelector('#q-sidebar-toggle')
const domNavbarCloseButton = document.querySelector('#q-navbar-button-close');

// Event binding
domThemeButton.forEach(themeButton => {
  themeButton.addEventListener('click', () => toggleUserTheme())
})
domNavbarToggleButton.addEventListener('click', () => toggleSidebar());
domNavbarCloseButton.addEventListener('click', () => toggleSidebar());
domSiteLogo.addEventListener('mouseover', () => animateRotateLogo())

// Fire on DomContentLoaded
document.addEventListener('DOMContentLoaded', () => {
});

// Everything that should be handled right away
initUserTheme();
