// DOM Elements
const domThemeButton = document.querySelector('#q-theme-button');
const domNavbarToggleButton = document.querySelector('#q-sidebar-toggle')
const domNavbarCloseButton = document.querySelector('#q-navbar-button-close')

// Event binding
domThemeButton.addEventListener('click', () => toggleUserTheme())
domNavbarToggleButton.addEventListener('click', () => toggleSidebar());
domNavbarCloseButton.addEventListener('click', () => toggleSidebar());
document.addEventListener('DOMContentLoaded', () => {
});

// Everything that should be handled right away
initUserTheme();
