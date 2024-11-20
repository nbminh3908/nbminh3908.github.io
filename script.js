const toggleButton = document.getElementById('theme-toggle');
const toggleIcon = document.getElementById('toggle-icon');

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        toggleIcon.src = 'https://raw.githubusercontent.com/nbminh3908/nbminh3908.github.io/refs/heads/main/assets/toggle-light-mode.svg';
        toggleIcon.alt = 'Dark Mode';
    } else {
        toggleIcon.src = 'https://raw.githubusercontent.com/nbminh3908/nbminh3908.github.io/refs/heads/main/assets/toggle-dark-mode.svg';
        toggleIcon.alt = 'Light Mode';
    }
});
