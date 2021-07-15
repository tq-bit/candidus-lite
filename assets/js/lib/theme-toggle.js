const moonIcons = document.querySelectorAll('.q-moon')
const sunIcons = document.querySelectorAll('.q-sun')

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
  if (theme === "dark-theme") {
    moonIcons.forEach(moon => moon.classList.remove('hidden'));
    sunIcons.forEach(sun => sun.classList.add('hidden'))
  } else {
    sunIcons.forEach(sun => sun.classList.remove('hidden'))
    moonIcons.forEach(moon => moon.classList.add('hidden'));
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
