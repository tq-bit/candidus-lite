

const copyCodeToClipboard = function(sectionNode) {
  navigator.clipboard.writeText(sectionNode.innerText);
}

const renderCodeCopyElement = function(selector) {
  const codeSections = document.querySelectorAll(selector);

  codeSections.forEach(function(section)  {
    section.parentElement.style.position = 'relative'
    const codeClip = document.createElement('span')
    const codeClipWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const codeClipPart = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Set the necessary attributes
    codeClip.classList.add('q-post-code-clip-icon');
    codeClip.setAttribute('tabindex', '0');

    codeClipWrapper.setAttribute('viewBox', '0 0 24 24');
    codeClipWrapper.setAttribute('fill', 'none');
    codeClipWrapper.setAttribute('stroke', '#fff');

    // Style the svg paths
    codeClipPart.setAttribute('stroke-linecap', 'round')
    codeClipPart.setAttribute('stroke-linejoin', 'round')
    codeClipPart.setAttribute('d', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2')

    // Add the event listener
    codeClip.addEventListener('click', function(ev) {
      copyCodeToClipboard(section)
    })

    // Append the elements together
    codeClipWrapper.appendChild(codeClipPart)
    codeClip.appendChild(codeClipWrapper)
    section.parentElement.appendChild(codeClip)
  })
}

renderCodeCopyElement('pre code');