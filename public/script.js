// import { ipcRenderer } from '@electron';
import { createListFromTree } from './fileTree.js';

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

openBtn.addEventListener("click", async () => {
    try {
        const result = await window.electronAPI.openDir();

        if (result) {
            const container = document.getElementById("file-tree-container");
            console.log(result);
            container.innerHTML = createListFromTree(result);

            eventListenerForFolders();
        } else {
            console.log("No file tree returned or invalid file tree structure");
        }
    } catch (error) {
        console.error("Error opening directory:", error);
    }
});

async function eventListenerForFolders() {
    const folders = document.querySelectorAll("#fileTree .folder-name")
    const files = document.querySelectorAll('#fileTree .file')

    if (folders && files) {
        folders.forEach(folder => {
            folder.addEventListener('click', () => {
                const list = folder.nextElementSibling;
                console.log(list);
                list.classList.toggle('open');
                folder.classList.toggle('open');
            })
        })

        files.forEach(file => {
            file.addEventListener('click', async () => {
                const path = file.getAttribute('data-path');
                const fileContent = await window.electronAPI.openFile(path);
                const editor = document.getElementById('code');
                editor.innerHTML = fileContent;
            })
        })
    }
}