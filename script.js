const toggleThemeButton = document.getElementById('theme-toggle');

toggleThemeButton.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});
