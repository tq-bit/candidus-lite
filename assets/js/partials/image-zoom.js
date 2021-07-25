const domImageZoom = document.querySelector('#q-image-zoom-wrapper');
const domImageZoomBody = document.querySelector('#q-image-zoom-body');

const toggleImageZoom = (domPostImage) => {
  const isHidden = domImageZoom.classList.contains('hidden');
  const animationDuration = 500;

  // Remove image if already present
  const existingImage = domImageZoomBody.querySelector('img');
  if (existingImage) {
    domImageZoomBody.removeChild(existingImage);
  }

  // Add the new element, if one is passed
  if (domPostImage) {
    const imageElement = domPostImage.querySelector('img').cloneNode();
    domImageZoomBody.appendChild(imageElement);
  }

  if (isHidden) {
    animateShowImageZoom(animationDuration);
  } else {
    animateHideImageZoom(animationDuration);
  }
}

// Initially hide the sidebar
animateHideImageZoom(0);