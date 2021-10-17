const useClipboard = () => {
  const copy = (section) => {
    navigator.clipboard.writeText(section.innerText);
  };

  const appendCopyIcons = (domCodeSections) => {
    domCodeSections.forEach(function (section) {
      section.parentElement.style.position = 'relative';
      const copyIcon = renderCopyIcon();

      // Add the event listeners
      copyIcon.addEventListener('click', () => copy(section));

      section.parentElement.appendChild(copyIcon);
    });
  };

  const renderCopyIcon = () => {
    const svgPath =
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2';
    const svgNsUrl = 'http://www.w3.org/2000/svg';
    const copyIcon = document.createElement('span');
    const iconSvg = document.createElementNS(svgNsUrl, 'svg');
    const iconPath = document.createElementNS(svgNsUrl, 'path');

    // Set the necessary attributes
    copyIcon.classList.add('q-post-code-clip-icon');
    copyIcon.setAttribute('tabindex', '0');

    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('fill', 'none');
    iconSvg.setAttribute('stroke', '#fff');

    // Style the svg paths
    iconPath.setAttribute('stroke-linecap', 'round');
    iconPath.setAttribute('stroke-linejoin', 'round');
    iconPath.setAttribute('d', svgPath);

    iconSvg.appendChild(iconPath);
    copyIcon.appendChild(iconSvg);
    return copyIcon;
  };

  const renderCopyAlert = () => {};

  return { appendCopyIcons };
};
