document.getElementById('test').addEventListener('click', async () => {
    window.electronAPI.log('test from script.js')
    await window.electronAPI.openDir();
})