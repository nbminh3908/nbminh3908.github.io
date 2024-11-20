const toggleButton = document.getElementById('theme-toggle');
const toggleIcon = document.getElementById('toggle-icon');

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        toggleIcon.src = 'https://cdn.discordapp.com/attachments/994428465291997184/1308807519199563946/dark-mode-night-moon-svgrepo-com.svg?ex=673f497d&is=673df7fd&hm=c238f8ef09c01f0e1eb1667f9b38fd3169e1d823f3536a537dea1ba58039a463&';
        toggleIcon.alt = 'Dark Mode';
    } else {
        toggleIcon.src = 'https://cdn.discordapp.com/attachments/994428465291997184/1308807550204117075/light-mode-svgrepo-com.svg?ex=673f4984&is=673df804&hm=4eca033627d325d6f067e51187356292fdd97f6883845ff7fb875541dd046920&';
        toggleIcon.alt = 'Light Mode';
    }
});
