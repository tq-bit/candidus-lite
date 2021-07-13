// DOM Elements
const domThemeButton = document.querySelector('#q-theme-button')

// Event binding
domThemeButton.addEventListener('click', () => {
  toggleUserTheme()
})

document.addEventListener('DOMContentLoaded', () => {
});

// Everything that should be handled right away
initUserTheme();
