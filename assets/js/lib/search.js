/**
 * Functions related to the searchbar and matching lunr configuration
 * Note: To work, lunr requires a global variable named API_KEY which
 * grants access to ghost's content api
 *
 * Add this script to your
 * <script>
 * const Q_GHOST_API_ROOT = 'https://blog.q-bit.me';
 * const Q_GHOST_API_KEY = '6e0e24ecc7e23a8fac7d9bfd71';
 * </script>
 */

// TODO: [x] Fetch posts from the content api
// TODO: [x]Build an index and store it in localstorage
// TODO: [x]Make this index refresh itself every 8 hours
// TODO: [x]Build the actual search functionality
// TODO: [x]Use the search result to render the results inside 'q-search-list'
// TODO: [ ]Make the input field accessible and autofocused
// TODO: [ ]Make the delete button accessible
// TODO: [ ]Add open and close functionality to the search interface (also, close when button esc is clicked)
// TODO: [ ]Add proper error handling when plugin is registered

const useLunrSearch = (rootUrl = null, key = null) => {
  const resultList = document.getElementById('q-search-list');
  const placeholderItem = document.createElement('p');
  const path = '/ghost/api/v2/content/posts/';
  const indexName = 'q-search-index';
  const refreshInterval = 1000 * 60 * 60 * 8; // 8 hours

  const initLocalIndex = async () => {
    const localIndex = getIndex();
    const now = new Date().getTime();

    if (!localIndex) {
      return updateLocalIndex();
    }

    const { timestamp } = localIndex;
    const isExpired = timestamp < now - refreshInterval;
    if (isExpired) {
      return updateLocalIndex();
    }

    async function updateLocalIndex() {
      const posts = await fetchPosts();
      const lunrIndex = buildIndex(posts);
      const timestamp = saveIndex(lunrIndex);
      return timestamp;
    }
  };

  const toggleSearch = (domSearchWrapper) => {
    const isHidden = domSearchWrapper.classList.contains('hidden');
    const animationDuration = 750;

    if (!isHidden) {
      domSearchWrapper.classList.add('hidden');
    } else {
      domSearchWrapper.classList.remove('hidden');
    }
  };

  const search = (ev) => {
    const {
      target: { value },
    } = ev;
    const { lunrIndex } = getIndex();
    const blueprints = queryIndex(lunrIndex, value);
    return renderQueryResults(value, blueprints);
  };

  const renderQueryResults = (value, blueprints) => {
    while (resultList.firstChild) {
      resultList.removeChild(resultList.firstChild);
    }
    if (value === '') {
      return renderPlaceholder('😺 Your search results will show up here');
    }
    if (blueprints.length > 0) {
      return renderList();
    }
    return renderPlaceholder('😾 No posts found for this search');

    function renderPlaceholder(text) {
      placeholderItem.innerText = text;
      placeholderItem.classList.add('q-search-placeholder');
      resultList.append(placeholderItem);
    }

    function renderList() {
      blueprints.forEach((blueprint) => {
        const searchItem = document.createElement('li');
        const searchLink = document.createElement('a');

        searchItem.classList.add('q-search-item');
        searchLink.href = blueprint.url;
        searchLink.innerText = blueprint.title;
        searchItem.append(searchLink);
        resultList.append(searchItem);
      });
    }
  };

  const queryIndex = (lunrIndex, query) => {
    const results = lunrIndex.search(query);
    return results.map((entry) => JSON.parse(entry.ref));
  };

  const buildIndex = (posts) => {
    const documents = posts.map((post) => {
      const blueprint = JSON.stringify({
        title: post.title,
        url: post.url,
      });
      return {
        blueprint,
        title: post.title,
        excerpt: post.excerpt,
        html: post.html,
      };
    });

    const lunrIndex = lunr(function () {
      this.ref('blueprint');
      this.field('title');
      this.field('excerpt');
      this.field('html');
      documents.forEach(function (doc) {
        this.add(doc);
      }, this);
    });
    console.log(lunrIndex);
    return lunrIndex;
  };

  const getIndex = () => {
    const payload = JSON.parse(localStorage.getItem(indexName));
    if (payload) {
      return {
        timestamp: payload.timestamp,
        lunrIndex: lunr.Index.load(payload.lunrIndex),
      };
    }
  };

  const saveIndex = (lunrIndex) => {
    const timestamp = new Date().getTime();
    const payload = {
      timestamp,
      lunrIndex,
    };
    localStorage.setItem(indexName, JSON.stringify(payload));
    return timestamp;
  };

  const fetchPosts = async (limit = 9999) => {
    if (!rootUrl) {
      console.warn('No rootUrl url specified. Using relative path');
    }
    if (!key) {
      throw new Error('No content api key found: Q_GHOST_API_KEY is undefined');
    }

    const url = rootUrl + path + '?limit=' + limit + '&key=' + key;
    const response = await fetch(url);
    const { meta, posts } = await response.json();
    return posts;
  };

  return { initLocalIndex, search, renderQueryResults, toggleSearch };
};
