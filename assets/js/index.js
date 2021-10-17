// Query all necessary DOM elements
// DOM elements from ./default.hbs
const domSiteLogo = document.querySelector('img.q-navbar-logo');

// DOM elements specifically in ./posts.hbs
const domPostContentArea =
  document.querySelector('.q-post-article-content') || null;
const domPostImages = document.querySelectorAll('.kg-width-full');

// DOM elements specifically in ./partials/post-card-item.hbs
const domPostCardItemExcerpts = document.querySelectorAll(
  '.q-post-card-body-excerpt'
);

// DOM Elements specifically in ./partials/image-zoom.hbs
const domImageZoomCloseButton = document.querySelector('#q-image-zoom-close');

const registerSearchPlugin = () => {
  try {
    const root = Q_GHOST_API_ROOT;
    const key = Q_GHOST_API_KEY;
    const { initLocalIndex, search, toggleSearch, showSearch, hideSearch } =
      useLunrSearch(root, key);
    // DOM Elements for the ./partials/search.hbs
    const domSearchButton = document.querySelector('#q-search-button');
    const domSearchWrapper = document.querySelector('#q-search-wrapper');
    const domSearchInput = document.querySelector('#q-search-input');
    const domSearchDeleteButton = document.querySelector('#q-search-delete');

    domSearchButton.classList.remove('hidden');

    domSearchButton.addEventListener('click', (ev) => {
      toggleSearch(domSearchWrapper);
    });

    domSearchWrapper.addEventListener('click', (ev) => {
      const hasClickedWrapper = ev.target === domSearchWrapper;
      if (hasClickedWrapper) {
        toggleSearch(domSearchWrapper);
      }
    });

    domSearchInput.addEventListener('keyup', (ev) => {
      let handler = null;
      clearTimeout(handler);
      handler = setTimeout(() => search(ev), 500);
    });
    domSearchDeleteButton.addEventListener('click', () => {
      domSearchInput.value = '';
    });

    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        hideSearch(domSearchWrapper);
      }

      if (ev.ctrlKey && ev.key.toLowerCase() === 'k') {
        ev.preventDefault();
        showSearch(domSearchWrapper);
      }
    });

    // Build up the search index
    initLocalIndex();
    console.log('Search plugin registered');
  } catch (error) {
    console.groupCollapsed('Search plugin disabled');
    console.warn('In order to use the search plugin, register it:');
    console.log('<script>');
    console.log('const Q_GHOST_API_ROOT = "YOUR_ROOT_URL";');
    console.log('const Q_GHOST_API_KEY = "YOUR_CONTENT_API_KEY";');
    console.log('</script>');
    console.groupEnd();
  }
};

const registerGliderPlugin = () => {
  const domGliderElement = document.querySelector('.glider');

  if (domGliderElement) {
    const gliderConfig = {
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      dragVelocity: 0.2,
      scrollLock: true,
      arrows: {
        prev: '.q-glider-prev',
        next: '.q-glider-next',
      },
      scrollLockDelay: 100,
      scrollPropagate: true,
      responsive: [
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 3,
          },
        },
      ],
    };
    const glider = new Glider(domGliderElement, gliderConfig);
    animateGliderAuto(glider, 5000);
  }
};

const registerClipboardPlugin = () => {
  const { appendCopyIcons } = useClipboard();
  const domCodeSections = document.querySelectorAll('pre code');
  return appendCopyIcons(domCodeSections);
};

const registerPostProgressbar = () => {
  const progressNav = document.getElementById('q-post-navbar') || null;
  const progressBar = document.getElementById('q-reading-progress');
  const { monitorProgressBar, monitorProgressNav } = usePostProgressBar(
    domPostContentArea,
    progressNav,
    progressBar
  );
  if (progressNav && progressBar) {
    monitorProgressBar();
    monitorProgressNav();
  }
};

const registerThemeButtons = () => {
  const domThemeButton = document.querySelectorAll('.q-theme-button');
  const { initUserTheme, toggleUserTheme } = useTheme();
  domThemeButton.forEach((themeButton) => {
    themeButton.addEventListener('click', () => toggleUserTheme());
  });
  initUserTheme();
};

const registerSidebar = () => {
  const domSidebar = document.getElementById('q-sidebar');
  const domNavbarToggleButton = document.getElementById('q-sidebar-toggle');
  const domNavbarCloseButton = document.getElementById('q-navbar-button-close');

  const { toggleSidebar, hideSidebar } = useSidebar(domSidebar);
  domNavbarToggleButton.addEventListener('click', () => toggleSidebar());
  domNavbarCloseButton.addEventListener('click', () => hideSidebar());
  hideSidebar();
};

const registerImageZoom = () => {
  const imageWrapper = document.getElementById('q-image-zoom-wrapper');
  const imageBody = document.getElementById('q-image-zoom-body');
  const imageCloseButton = document.getElementById('q-image-zoom-close');
  if (imageWrapper && imageBody) {
    const { toggleImageZoom, hideImageZoom } = useImageZoom(
      imageWrapper,
      imageBody
    );

    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        hideImageZoom();
      }
    });
    document.querySelectorAll('img.kg-image').forEach((image) => {
      return image.addEventListener('click', (ev) => {
        return toggleImageZoom(ev.target);
      });
    });
    imageCloseButton.addEventListener('click', () => hideImageZoom());
    hideImageZoom();
  }
};

/**
 * @desc This is a utility function that wraps around the standard
 * 'scroll' event listener. It ensures the registered functions
 * fire only after a certain delay and not on every captured
 * scroll event.
 * @param {Function[]} fn
 * @returns {void}
 */
const registerScrollingObserver = (...fn) => {
  let scrollerObserverConfig = {
    isScrolling: false,
    checkInterval: 250,
  };
  document.addEventListener('scroll', () => {
    scrollerObserverConfig.isScrolling = true;
  });
  setInterval(() => {
    if (scrollerObserverConfig.isScrolling) {
      scrollerObserverConfig.isScrolling = false;
      fn.forEach((entry) => entry());
    }
  }, scrollerObserverConfig.checkInterval);
};

// Creates a custom scroll check event

// Events to be fired on DomContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Event binding for site specific dom elements
  // ./index.hbs

  animateSlideInItemsStagger(1000, '.q-post-list-item-wrapper');

  // ./partials/post-card-item.hbs
  // Hide a part of the excerpt
  if (domPostCardItemExcerpts) {
    hidePostCardExcerpts(domPostCardItemExcerpts);
  }

  // Reframe iframes, if available
  reframe('iframe');
  registerGliderPlugin();
  registerSearchPlugin();
  registerClipboardPlugin();
  registerImageZoom();

  // Register functions to the scroll observer
  const onScrollCollection = [registerPostProgressbar];

  registerScrollingObserver(...onScrollCollection);
});

// Everything that should be handled right away
registerThemeButtons();
registerSidebar();
animateSlideOutItems(
  1000,
  'bottom',
  '.q-post-list-item-wrapper',
  '.q-post-card'
);
