document.getElementById('test').addEventListener('click', async () => {
    window.electronAPI.log('test from script.js')
    await window.electronAPI.openDir();
})

const minBtn = document.getElementById('minBtn');
const maxBtn = document.getElementById('maxBtn');
const closeBtn = document.getElementById('closeBtn');

minBtn.addEventListener('click', () => {
    window.electronAPI.minimize();
});

maxBtn.addEventListener('click', () => {
    window.electronAPI.maximize();
});

closeBtn.addEventListener('click', () => {
    window.electronAPI.close();
});