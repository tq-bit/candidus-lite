/**
 * Functions specifially for post and post items
 * 1) Filter post list on index page
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