const useLunrSearch = (rootUrl = null, key = null) => {
  const resultListItem = document.getElementById('q-search-list');
  const searchInputItem = document.getElementById('q-search-input');
  const placeholderItem = document.createElement('p');
  const apiPath = '/ghost/api/v2/content/posts/';
  const workerPath = '/assets/built/workers/indexworker.js';
  const localIndexName = 'q-search-index';
  const refreshInterval = 1000 * 60 * 60 * 8; // 8 hours
  const animationDuration = 750;

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
      const indexWorker = new Worker(workerPath);

      const posts = await fetchPosts();
      indexWorker.postMessage(posts);
      indexWorker.onmessage = (ev) => {
        const { data: serializedIndex } = ev;
        const lunrIndex = JSON.parse(serializedIndex);
        const timestamp = saveIndex(lunrIndex);
        return timestamp;
      };
    }
  };

  const toggleSearch = (domSearchWrapper) => {
    const isHidden = domSearchWrapper.classList.contains('hidden');

    if (!isHidden) {
      hideSearch(domSearchWrapper);
    } else {
      showSearch(domSearchWrapper);
    }
  };

  const showSearch = (domSearchWrapper) => {
    const isHidden = domSearchWrapper.classList.contains('hidden');
    if (isHidden) {
      domSearchWrapper.classList.remove('hidden');
      // @ts-ignore
      anime({
        targets: '#' + domSearchWrapper.id,
        opacity: 1,
        duration: animationDuration,
      });
      searchInputItem.focus();
    }
  };

  const hideSearch = (domSearchWrapper) => {
    const isHidden = domSearchWrapper.classList.contains('hidden');
    if (!isHidden) {
      // @ts-ignore
      anime({
        targets: '#' + domSearchWrapper.id,
        opacity: 0,
        duration: animationDuration,
      });
      setTimeout(
        () => domSearchWrapper.classList.add('hidden'),
        animationDuration
      );
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
    while (resultListItem.firstChild) {
      resultListItem.removeChild(resultListItem.firstChild);
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
      resultListItem.append(placeholderItem);
    }

    function renderList() {
      blueprints.forEach((blueprint) => {
        const searchItem = document.createElement('li');
        const searchLink = document.createElement('a');

        searchItem.classList.add('q-search-item');
        searchItem.innerText = '🔖 ' + blueprint.title;
        searchLink.href = blueprint.url;
        searchLink.append(searchItem);
        resultListItem.append(searchLink);
      });
    }
  };

  const queryIndex = (lunrIndex, query) => {
    const results = lunrIndex.search(query);
    return results.map((entry) => JSON.parse(entry.ref));
  };

  const getIndex = () => {
    const payload = JSON.parse(localStorage.getItem(localIndexName));
    if (payload) {
      return {
        timestamp: payload.timestamp,
        // @ts-ignore
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
    localStorage.setItem(localIndexName, JSON.stringify(payload));
    return timestamp;
  };

  const fetchPosts = async (limit = 9999) => {
    if (!rootUrl) {
      console.warn('No rootUrl url specified. Using relative path');
    }
    if (!key) {
      throw new Error('No content api key found: Q_GHOST_API_KEY is undefined');
    }

    const url = rootUrl + apiPath + '?limit=' + limit + '&key=' + key;
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
