const useCodeToolbar = () => {
  const copy = (domCodeSection) => {
    navigator.clipboard.writeText(domCodeSection.innerText);
  };

  const appendCopyIcons = (domCodeSection) => {
    const { parentElement: codeSectionBlock } = domCodeSection;
    const copyBadge = renderToolbarBadge('♻ Copy');

    // Add the event listeners
    copyBadge.addEventListener('click', () => copyTextToClipboard());

    // Append all elements to the toolbar
    const toolbar = renderCodeToolbar(copyBadge);

    // Insert toolbar at the start of the codeblock
    codeSectionBlock.insertBefore(toolbar, codeSectionBlock.childNodes[0]);

    function copyTextToClipboard() {
      copyBadge.innerText = '✔ Copied!';
      copy(domCodeSection);
      setTimeout(() => (copyBadge.innerText = '♻ Copy'), 3000);
    }
  };

  const renderToolbarBadge = (content) => {
    const isStringContent = typeof content === 'string';
    const isDomContent = typeof content === 'object';
    const badgeItem = document.createElement('span');
    badgeItem.classList.add('q-post-article-code-badge');

    if (isStringContent) {
      const uppercaseText =
        content.charAt(0).toUpperCase() + content.substring(1);
      badgeItem.innerText = uppercaseText;
    }
    if (isDomContent) {
      badgeItem.appendChild(content);
    }
    return badgeItem;
  };

  const renderCodeToolbar = (...toolbarActionItems) => {
    const toolbarElement = document.createElement('nav');
    toolbarActionItems.forEach((item) => toolbarElement.appendChild(item));
    toolbarElement.classList.add('q-post-article-code-toolbar');
    return toolbarElement;
  };

  const renderCopyAlert = () => {};

  return { appendCopyIcons };
};
