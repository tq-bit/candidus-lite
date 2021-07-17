/**
 * Functions specifially for post and post items
 * 1) Filter post list on index page
 * 2) Focus the searchbar when pressing CTRL + K
 */

const filterPostList = (searchInput, searchList) => {
  const filter = searchInput.value.toUpperCase();

  searchList.forEach(searchItem => {
    const text = searchItem.innerText.toUpperCase();
    if (text.includes(filter)) {
      searchItem.style.display = "";
    } else {
      searchItem.style.display = "none";
    }
  })
}

const focusPostListSearchButton = (event, searchfield) => {
  if (event.key.toLowerCase() === 'escape') {
    event.preventDefault();
    searchfield.blur();
  }
  if(event.ctrlKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchfield.focus()
  }
}