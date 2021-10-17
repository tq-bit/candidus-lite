const useImageZoom = (imageWrapper, imageBody) => {
  const animationSpeed = 500;

  const toggleImageZoom = (clickedImage) => {
    const isHidden = imageWrapper.classList.contains('hidden');

    console.log('Toggling. isHidde = ', isHidden);

    if (isHidden) {
      showImageZoom(clickedImage);
    } else {
      hideImageZoom();
    }
  };

  const showImageZoom = (clickedImage) => {
    if (clickedImage) {
      const imageElement = clickedImage.cloneNode();
      imageBody.appendChild(imageElement);
    }
    imageWrapper.classList.remove('hidden');
    // @ts-ignore
    anime({
      targets: '#q-image-zoom-wrapper',
      height: '100%',
      width: '100%',
      top: '0',
      left: '0',
      opacity: 1,
      easing: 'easeInOutSine',
      duration: animationSpeed,
    });
  };

  const hideImageZoom = () => {
    const presentImage = imageBody.querySelector('img');

    // @ts-ignore
    anime({
      targets: '#q-image-zoom-wrapper',
      height: '0%',
      width: '0%',
      top: '105%',
      left: '50%',
      opacity: 0,
      easing: 'easeInOutSine',
      duration: animationSpeed,
    });
    // @ts-ignore
    setTimeout(() => {
      imageWrapper.classList.add('hidden');
      if (presentImage) {
        imageBody.removeChild(presentImage);
      }
    }, animationSpeed);
  };

  return { toggleImageZoom, showImageZoom, hideImageZoom };
};
