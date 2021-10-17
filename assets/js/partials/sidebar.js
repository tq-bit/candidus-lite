// TODO: Replace the hard coded targets with target ids

const useSidebar = (domSidebar) => {
  const animationSpeed = 750;

  const toggleSidebar = () => {
    const isHidden = domSidebar.classList.contains('hidden');

    if (isHidden) {
      showSidebar();
    } else {
      hideSidebar();
    }
  };
  const hideSidebar = () => {
    // @ts-ignore
    anime({
      targets: '#' + domSidebar.id,
      translateX: '100%',
      opacity: 0,
      easing: 'easeInOutSine',
      duration: animationSpeed,
    });
    // @ts-ignore
    setTimeout(() => domSidebar.classList.add('hidden'), animationSpeed);
  };

  const showSidebar = () => {
    // @ts-ignore
    domSidebar.classList.remove('hidden');
    // @ts-ignore
    anime({
      targets: '#' + domSidebar.id,
      translateX: '0',
      opacity: 0.99,
      easing: 'easeInOutSine',
      duration: animationSpeed,
    });
  };
  return { toggleSidebar, showSidebar, hideSidebar };
};