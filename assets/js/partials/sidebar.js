// TODO: Refactor sidebar variable to domSidebar
const domSidebar = document.querySelector('#q-sidebar');

const toggleSidebar = () => {
  const isHidden = domSidebar.classList.contains('hidden');
  const animationDuration = 750;

  if (isHidden) {
    animateShowSidebar(animationDuration);
  } else {
    animateHideSidebar(animationDuration);
  }
}

// Initially hide the sidebar
animateHideSidebar(0);