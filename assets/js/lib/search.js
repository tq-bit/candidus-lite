const useLunrSearch = (rootUrl = null, key = null) => {
  const resultList = document.getElementById('q-search-list');
  const searchInput = document.getElementById('q-search-input');
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
      hideSearch(domSearchWrapper);
    } else {
      showSearch(domSearchWrapper);
    }
  };

  const showSearch = (domSearchWrapper) => {
    domSearchWrapper.classList.remove('hidden');
    searchInput.focus();
  };

  const hideSearch = (domSearchWrapper) => {
    domSearchWrapper.classList.add('hidden');
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
        searchItem.innerText = '🔖 ' + blueprint.title;
        searchLink.href = blueprint.url;
        searchLink.append(searchItem);
        resultList.append(searchLink);
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

  return {
    initLocalIndex,
    search,
    renderQueryResults,
    toggleSearch,
    showSearch,
    hideSearch,
  };
};
