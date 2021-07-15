const sidebar = document.querySelector('#q-sidebar');

const toggleSidebar = () => {
  const isHidden = sidebar.classList.contains('hidden');
  const animationDuration = 750;

  if (isHidden) {
    showSidebar(animationDuration);
  } else {
    hideSidebar(animationDuration);
  }
}

// Initially hide the sidebar
hideSidebar(0);