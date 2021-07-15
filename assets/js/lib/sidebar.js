const sidebar = document.querySelector('#q-sidebar');

const hideSidebar = (duration) => {
  anime({
    targets: '#q-sidebar',
    translateY: '-100%',
    opacity: 0,
    easing: 'easeInOutSine',
    duration
  })
  setTimeout(() => sidebar.classList.add('hidden'), duration)
}

const showSidebar = (duration) => {
  sidebar.classList.remove('hidden')
  anime({
    targets: '#q-sidebar',
    translateY: '0',
    opacity: 0.95,
    easing: 'easeInOutSine',
    duration
  })
}

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