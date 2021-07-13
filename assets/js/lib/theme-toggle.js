const moon = document.querySelector('#q-moon')
const sun = document.querySelector('#q-sun')

const toggleUserTheme = () => {
  const activeTheme = localStorage.getItem("user-theme");
  if (activeTheme === "light-theme") {
    setTheme("dark-theme");
  } else {
    setTheme("light-theme");
  }
}

const setTheme = (theme) => {
  localStorage.setItem("user-theme", theme);
  document.documentElement.className = theme;
  if(theme === "dark-theme") {
    moon.classList.remove('hidden')
    sun.classList.add('hidden');
  } else {
    sun.classList.remove('hidden');
    moon.classList.add('hidden')
  }
}

const getMediaPreference = () => {
  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  if (hasDarkPreference) {
    return "dark-theme";
  } else {
    return "light-theme";
  }
}

const initUserTheme = () => {
  const userPreference = getMediaPreference();
  return setTheme(userPreference);
}
