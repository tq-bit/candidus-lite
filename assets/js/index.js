// Query all necessary DOM elements
// DOM elements from ./default.hbs
const domSiteLogo = document.querySelector('img.q-navbar-logo');
const domNavbarToggleButton = document.querySelector('#q-sidebar-toggle');
const domNavbarCloseButton = document.querySelector('#q-navbar-button-close');

// DOM elements specifically in ./posts.hbs
const domPostContentArea =
  document.querySelector('.q-post-article-content') || null;
const domPostReadingProgressBar =
  document.querySelector('#q-reading-progress') || null;
const domPostNavbar = document.querySelector('#q-post-navbar') || null;
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

const registerScrollingObserver = () => {
  let scrollerObserver = {
    isScrolling: false,
    checkInterval: 250,
  };
  document.addEventListener('scroll', () => {
    scrollerObserver.isScrolling = true;
  });
  setInterval(() => {
    if (scrollerObserver.isScrolling) {
      scrollerObserver.isScrolling = false;

      // Attach the scroll events
      // ./posts.hbs
      if (domPostContentArea && domPostReadingProgressBar) {
        monitorPostNavbar(
          domPostReadingProgressBar,
          scrollerObserver.checkInterval
        );
        monitorShowReadMorePostCards(domPostReadingProgressBar);
      }
    }
  }, scrollerObserver.checkInterval);
};

const registerThemeButtons = () => {
  const domThemeButton = document.querySelectorAll('.q-theme-button');
  const { initUserTheme, toggleUserTheme } = useTheme();
  domThemeButton.forEach((themeButton) => {
    themeButton.addEventListener('click', () => toggleUserTheme());
  });
  initUserTheme();
};

// Define global variables

// Event binding for all default elements

domNavbarToggleButton.addEventListener('click', () => toggleSidebar());
domNavbarCloseButton.addEventListener('click', () => toggleSidebar());

// Creates a custom scroll check event

// Events to be fired on DomContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Event binding for site specific dom elements
  // ./index.hbs

  animateSlideInItemsStagger(1000, '.q-post-list-item-wrapper');

  // ./post.hbs
  // Execute post related functions
  if (domPostContentArea && domPostReadingProgressBar) {
    monitorReadingProgress(domPostContentArea, domPostReadingProgressBar);
    // Add event listeners to fullscreen images
    domPostImages.forEach((domPostImage) => {
      domPostImage.addEventListener('click', () => {
        toggleImageZoom(domPostImage);
      });
    });

    domImageZoomCloseButton.addEventListener('click', () => {
      toggleImageZoom();
    });
  }

  // ./partials/post-card-item.hbs
  // Hide a part of the excerpt
  if (domPostCardItemExcerpts) {
    hidePostCardExcerpts(domPostCardItemExcerpts);
  }

  // Reframe iframes, if available
  reframe('iframe');
  registerScrollingObserver();
  registerGliderPlugin();
  registerSearchPlugin();
  registerClipboardPlugin();
});

// Everything that should be handled right away
registerThemeButtons();
animateSlideOutItems(
  1000,
  'bottom',
  '.q-post-list-item-wrapper',
  '.q-post-card'
);
